import { defaultMenuSeed, defaultCategorySeed } from "../../src/menu-seed.js";

const encoder = new TextEncoder();
const SESSION_COOKIE = "huhus_session";
let cachedDarajaToken = null;

function json(data, status=200, headers={}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", ...headers }
  });
}
function makeId() { return crypto.randomUUID(); }
function randomBytes(length=32) { const bytes=new Uint8Array(length); crypto.getRandomValues(bytes); return bytes; }
function toBase64Url(bytes) {
  let raw=""; for (const b of bytes) raw+=String.fromCharCode(b);
  return btoa(raw).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
function fromBase64(value) { return Uint8Array.from(atob(value), c=>c.charCodeAt(0)); }
async function digest(value) { return toBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256",encoder.encode(value)))); }
async function derivePassword(password,salt) {
  const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:100000,hash:"SHA-256"},key,256);
  return toBase64Url(new Uint8Array(bits));
}
function constantTimeEqual(a,b) {
  const x=encoder.encode(String(a)),y=encoder.encode(String(b));
  if(x.length!==y.length)return false;
  let difference=0; for(let i=0;i<x.length;i++)difference|=x[i]^y[i];
  return difference===0;
}
function cookieToken(request) {
  const item=(request.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(SESSION_COOKIE+"="));
  return item?decodeURIComponent(item.slice(SESSION_COOKIE.length+1)):"";
}
function sessionCookie(token,age) {
  return SESSION_COOKIE+"="+encodeURIComponent(token)+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age="+age;
}
async function readBody(request) { try{return await request.json();}catch{return null;} }
function parseJson(value,fallback) { try{return JSON.parse(value||"");}catch{return fallback;} }
function normalizePhone(value) {
  let phone=String(value||"").replace(/[\s()+-]/g,"");
  if(phone.startsWith("0"))phone="254"+phone.slice(1);
  else if(phone.startsWith("7")||phone.startsWith("1"))phone="254"+phone;
  return /^254[17]\d{8}$/.test(phone)?phone:"";
}
function makeReference() {
  const date=new Date().toISOString().slice(2,10).replace(/-/g,"");
  return "HU"+date+toBase64Url(randomBytes(4)).slice(0,5).toUpperCase();
}
async function getSetting(db,key,fallback="") {
  const row=await db.prepare("SELECT setting_value FROM app_settings WHERE setting_key=?").bind(key).first();
  return row?row.setting_value:fallback;
}
async function getSettings(db) {
  const result=await db.prepare("SELECT setting_key,setting_value FROM app_settings").all();
  const values=Object.fromEntries((result.results||[]).map(x=>[x.setting_key,x.setting_value]));
  return {
    deliveryEnabled:values.delivery_enabled!=="false",
    collectionEnabled:values.collection_enabled!=="false",
    storeOpen:values.store_open!=="false",
    deliveryFeeKes:Number(values.delivery_fee_kes||0),
    minimumOrderKes:Number(values.minimum_order_kes||0),
    demoMode:values.demo_mode!=="false"
  };
}
async function seedCatalog(db) {
  const categoryCount=await db.prepare("SELECT COUNT(*) AS n FROM menu_categories").first();
  if(!Number(categoryCount?.n||0)) {
    const rows=defaultCategorySeed.map((x,i)=>db.prepare(
      "INSERT OR IGNORE INTO menu_categories(id,label,intro,image_url,sort_order,is_active) VALUES(?,?,?,?,?,1)"
    ).bind(x.id,x.label,x.intro||"",x.image||"",i));
    await db.batch(rows);
  }
  const itemCount=await db.prepare("SELECT COUNT(*) AS n FROM menu_items").first();
  if(!Number(itemCount?.n||0)) {
    const rows=defaultMenuSeed.map((x,i)=>{
      const variants=Array.isArray(x.variants)?x.variants:[];
      const basePrice=Number.isInteger(x.price)?x.price:(variants.length?Math.min(...variants.map(v=>Number(v.price)||0)):0);
      return db.prepare(
        "INSERT OR IGNORE INTO menu_items(id,category_id,name,description,price_kes,variants_json,image_url,badge,available,sort_order) VALUES(?,?,?,?,?,?,?,?,1,?)"
      ).bind(x.id,x.category,x.name,x.description||"",basePrice,JSON.stringify(variants),x.image||"",x.badge||"",i);
    });
    for(let i=0;i<rows.length;i+=75)await db.batch(rows.slice(i,i+75));
  }
}
async function getCatalog(db) {
  await seedCatalog(db);
  const [categories,items]=await Promise.all([
    db.prepare("SELECT id,label,intro,image_url FROM menu_categories WHERE is_active=1 ORDER BY sort_order,label").all(),
    db.prepare("SELECT i.id,i.category_id AS category,i.name,i.description,i.price_kes AS price,i.variants_json,i.image_url,i.badge,i.available FROM menu_items i JOIN menu_categories c ON c.id=i.category_id WHERE c.is_active=1 ORDER BY c.sort_order,i.sort_order,i.name").all()
  ]);
  return {
    categories:categories.results||[],
    items:(items.results||[]).map(x=>({...x,variants:parseJson(x.variants_json,[]),available:Boolean(x.available)}))
  };
}
async function bootstrapOwner(db,env) {
  if(!env.HUHUS_ADMIN_EMAIL||!env.HUHUS_ADMIN_PASSWORD)return;
  const existing=await db.prepare("SELECT COUNT(*) AS n FROM staff_users").first();
  if(Number(existing?.n||0)>0)return;
  const salt=randomBytes(16),email=String(env.HUHUS_ADMIN_EMAIL).trim().toLowerCase();
  await db.prepare("INSERT OR IGNORE INTO staff_users(id,email,display_name,password_hash,password_salt,role,is_active) VALUES(?,?,?,?,?,'owner',1)")
    .bind(makeId(),email,"Huhu’s System Owner",await derivePassword(env.HUHUS_ADMIN_PASSWORD,salt),toBase64Url(salt)).run();
}
async function authenticate(request,db) {
  const token=cookieToken(request); if(!token)return null;
  return await db.prepare(
    "SELECT u.id,u.email,u.display_name,u.role FROM staff_sessions s JOIN staff_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.is_active=1"
  ).bind(await digest(token),new Date().toISOString()).first();
}
async function login(request,env,db) {
  await bootstrapOwner(db,env);
  const input=await readBody(request),email=String(input?.email||"").trim().toLowerCase(),password=String(input?.password||"");
  if(!email||!password)return json({error:"Enter your email and password."},400);
  const user=await db.prepare("SELECT * FROM staff_users WHERE email=? COLLATE NOCASE AND is_active=1").bind(email).first();
  if(!user)return json({error:"Email or password is incorrect."},401);
  const calculated=await derivePassword(password,fromBase64(user.password_salt));
  if(!constantTimeEqual(calculated,user.password_hash))return json({error:"Email or password is incorrect."},401);
  const token=toBase64Url(randomBytes(32)),expires=new Date(Date.now()+12*60*60*1000).toISOString();
  await db.prepare("INSERT INTO staff_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await digest(token),user.id,expires).run();
  return json({user:{email:user.email,displayName:user.display_name,role:user.role}},200,{"Set-Cookie":sessionCookie(token,43200)});
}
async function logout(request,db) {
  const token=cookieToken(request);
  if(token)await db.prepare("DELETE FROM staff_sessions WHERE token_hash=?").bind(await digest(token)).run();
  return json({ok:true},200,{"Set-Cookie":sessionCookie("",0)});
}
function darajaIsConfigured(env) {
  return Boolean(env.MPESA_CONSUMER_KEY&&env.MPESA_CONSUMER_SECRET&&env.MPESA_SHORTCODE&&env.MPESA_PASSKEY&&env.MPESA_CALLBACK_SECRET&&["sandbox","production"].includes(env.MPESA_ENV));
}
async function darajaToken(env) {
  if(cachedDarajaToken&&cachedDarajaToken.expiry>Date.now()+60000)return cachedDarajaToken.value;
  const base=env.MPESA_ENV==="production"?"https://api.safaricom.co.ke":"https://sandbox.safaricom.co.ke";
  const credentials=btoa(env.MPESA_CONSUMER_KEY+":"+env.MPESA_CONSUMER_SECRET);
  const response=await fetch(base+"/oauth/v1/generate?grant_type=client_credentials",{headers:{Authorization:"Basic "+credentials}});
  const result=await response.json().catch(()=>({}));
  if(!response.ok||!result.access_token)throw new Error(result.errorMessage||"Safaricom authentication failed.");
  cachedDarajaToken={value:result.access_token,expiry:Date.now()+Number(result.expires_in||3600)*1000};
  return result.access_token;
}
function darajaTimestamp() {
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Nairobi",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const values=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return values.year+values.month+values.day+values.hour+values.minute+values.second;
}
async function initiateStkPush(request,env,db,order,phone) {
  const base=env.MPESA_ENV==="production"?"https://api.safaricom.co.ke":"https://sandbox.safaricom.co.ke";
  const token=await darajaToken(env),timestamp=darajaTimestamp();
  const password=btoa(env.MPESA_SHORTCODE+env.MPESA_PASSKEY+timestamp);
  const callbackUrl=new URL("/api/mpesa/callback/"+encodeURIComponent(env.MPESA_CALLBACK_SECRET),request.url).toString();
  const payload={
    BusinessShortCode:env.MPESA_SHORTCODE,Password:password,Timestamp:timestamp,
    TransactionType:env.MPESA_TRANSACTION_TYPE||"CustomerPayBillOnline",
    Amount:order.total,PartyA:phone,PartyB:env.MPESA_SHORTCODE,PhoneNumber:phone,
    CallBackURL:callbackUrl,AccountReference:order.reference.slice(0,12),TransactionDesc:"Huhus order "+order.reference
  };
  const response=await fetch(base+"/mpesa/stkpush/v1/processrequest",{
    method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify(payload)
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok||String(result.ResponseCode)!=="0"||!result.CheckoutRequestID)throw new Error(result.errorMessage||result.ResponseDescription||"Safaricom did not accept the payment request.");
  await db.prepare("INSERT INTO mpesa_payments(id,order_id,merchant_request_id,checkout_request_id,phone_number,amount_kes,status) VALUES(?,?,?,?,?,?,'pending')")
    .bind(makeId(),order.id,result.MerchantRequestID||"",result.CheckoutRequestID,phone,order.total).run();
  return result;
}
async function validateCart(db,items) {
  if(!Array.isArray(items)||!items.length||items.length>30)throw new Error("Your cart is empty or invalid.");
  const validated=[];let subtotal=0;
  for(const entry of items) {
    const itemId=String(entry?.itemId||""),quantity=Number(entry?.quantity);
    if(!itemId||!Number.isInteger(quantity)||quantity<1||quantity>20)throw new Error("An item quantity is invalid.");
    const item=await db.prepare("SELECT id,name,price_kes,variants_json,available FROM menu_items WHERE id=?").bind(itemId).first();
    if(!item||!item.available)throw new Error("An item in your order is no longer available.");
    const variants=parseJson(item.variants_json,[]);let variant="",price=Number(item.price_kes||0);
    if(variants.length) {
      const selected=variants.find(x=>x.label===String(entry.variant||""));
      if(!selected)throw new Error("Choose a valid option for "+item.name+".");
      variant=selected.label;price=Number(selected.price);
    } else if(entry.variant)throw new Error("The selected option is not valid for "+item.name+".");
    if(!Number.isInteger(price)||price<1)throw new Error("A price is not configured for "+item.name+".");
    subtotal+=price*quantity;
    validated.push({id:item.id,name:item.name,variant,price,quantity,lineTotal:price*quantity});
  }
  return {items:validated,subtotal};
}
async function createOrder(request,env,db) {
  await seedCatalog(db);
  const input=await readBody(request);
  const name=String(input?.customerName||"").trim().slice(0,100),phone=normalizePhone(input?.phone);
  const fulfilment=String(input?.fulfilment||"").toLowerCase(),address=String(input?.deliveryAddress||"").trim().slice(0,300);
  const notes=String(input?.notes||"").trim().slice(0,500),paymentMethod=String(input?.paymentMethod||"cash").toLowerCase();
  if(name.length<2||!phone)return json({error:"Enter your name and a valid Kenyan mobile number."},400);
  if(!["delivery","collection"].includes(fulfilment))return json({error:"Choose delivery or collection."},400);
  if(fulfilment==="delivery"&&address.length<4)return json({error:"Enter a delivery location."},400);
  if(!["cash","mpesa"].includes(paymentMethod))return json({error:"Choose a supported payment method."},400);
  const config=await getSettings(db);
  if(!config.storeOpen)return json({error:"Online ordering is currently paused."},409);
  if(fulfilment==="delivery"&&!config.deliveryEnabled)return json({error:"Delivery is currently unavailable."},409);
  if(fulfilment==="collection"&&!config.collectionEnabled)return json({error:"Collection is currently unavailable."},409);
  const cart=await validateCart(db,input.items);
  if(cart.subtotal<config.minimumOrderKes)return json({error:"The minimum order is KES "+config.minimumOrderKes+"."},409);
  const deliveryFee=fulfilment==="delivery"?config.deliveryFeeKes:0,total=cart.subtotal+deliveryFee;
  if(paymentMethod==="mpesa"&&(config.demoMode||!darajaIsConfigured(env)))return json({error:"M-Pesa is disabled until Huhu’s Daraja account is connected and the ordering system is approved for live payments."},409);
  const orderId=makeId(),reference=makeReference(),status=paymentMethod==="mpesa"?"awaiting_payment":"pending";
  await db.prepare("INSERT INTO orders(id,reference,customer_name,customer_phone,fulfilment,delivery_address,notes,status,subtotal_kes,delivery_fee_kes,total_kes,payment_method,payment_status,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(orderId,reference,name,phone,fulfilment,address,notes,status,cart.subtotal,deliveryFee,total,paymentMethod,paymentMethod==="mpesa"?"pending":"due",config.demoMode?1:0).run();
  const operations=cart.items.map(x=>db.prepare("INSERT INTO order_items(id,order_id,menu_item_id,item_name,variant,unit_price_kes,quantity,line_total_kes) VALUES(?,?,?,?,?,?,?,?)")
    .bind(makeId(),orderId,x.id,x.name,x.variant,x.price,x.quantity,x.lineTotal));
  operations.push(db.prepare("INSERT INTO order_events(id,order_id,actor_name,from_status,to_status,note) VALUES(?,?,?,'',?,?)")
    .bind(makeId(),orderId,"Customer",status,"Order submitted"));
  await db.batch(operations);
  if(paymentMethod==="mpesa") {
    try { await initiateStkPush(request,env,db,{id:orderId,reference,total},phone); }
    catch(error) {
      await db.prepare("UPDATE orders SET status='payment_failed',payment_status='failed',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run();
      return json({error:error.message,reference},502);
    }
    return json({reference,status:"awaiting_payment",paymentStatus:"pending",totalKes:total},201);
  }
  return json({reference,status,paymentStatus:"due",totalKes:total,demoMode:config.demoMode},201);
}
async function handleMpesaCallback(request,env,db,secret) {
  if(!env.MPESA_CALLBACK_SECRET||secret!==env.MPESA_CALLBACK_SECRET)return json({error:"Not found."},404);
  const payload=await readBody(request),callback=payload?.Body?.stkCallback;
  if(!callback?.CheckoutRequestID)return json({ResultCode:0,ResultDesc:"Accepted"});
  const payment=await db.prepare("SELECT id,order_id FROM mpesa_payments WHERE checkout_request_id=?").bind(callback.CheckoutRequestID).first();
  if(!payment)return json({ResultCode:0,ResultDesc:"Accepted"});
  const success=Number(callback.ResultCode)===0,metadata=callback.CallbackMetadata?.Item||[];
  const value=(name)=>metadata.find(x=>x.Name===name)?.Value;
  const receipt=success?String(value("MpesaReceiptNumber")||""):"";
  await db.prepare("UPDATE mpesa_payments SET status=?,mpesa_receipt_number=?,result_code=?,result_description=?,callback_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
    .bind(success?"paid":"failed",receipt,String(callback.ResultCode??""),String(callback.ResultDesc||""),JSON.stringify(payload),payment.id).run();
  const nextStatus=success?"pending":"payment_failed";
  await db.prepare("UPDATE orders SET payment_status=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
    .bind(success?"paid":"failed",nextStatus,payment.order_id).run();
  await db.prepare("INSERT INTO order_events(id,order_id,actor_name,from_status,to_status,note) VALUES(?,?,?,?,?,?)")
    .bind(makeId(),payment.order_id,"M-Pesa","awaiting_payment",nextStatus,success?"Payment verified. Receipt "+receipt:String(callback.ResultDesc||"Payment failed")).run();
  return json({ResultCode:0,ResultDesc:"Accepted"});
}
async function dashboardOverview(db) {
  const [counts,today,paid,menuCount]=await Promise.all([
    db.prepare("SELECT status,COUNT(*) AS count FROM orders GROUP BY status").all(),
    db.prepare("SELECT COUNT(*) AS count,COALESCE(SUM(total_kes),0) AS value FROM orders WHERE date(created_at)=date('now')").first(),
    db.prepare("SELECT COALESCE(SUM(total_kes),0) AS value FROM orders WHERE payment_status='paid' OR (payment_method='cash' AND status='completed')").first(),
    db.prepare("SELECT COUNT(*) AS count FROM menu_items").first()
  ]);
  return {
    counts:Object.fromEntries((counts.results||[]).map(x=>[x.status,x.count])),
    today:{orders:Number(today?.count||0),valueKes:Number(today?.value||0)},
    paidSalesKes:Number(paid?.value||0),menuItems:Number(menuCount?.count||0)
  };
}
async function handleAdmin(request,db,user,route,method) {
  if(route==="admin/overview"&&method==="GET")return json(await dashboardOverview(db));
  if(route==="admin/orders"&&method==="GET") {
    const status=new URL(request.url).searchParams.get("status")||"all";
    const result=status==="all"
      ?await db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200").all()
      :await db.prepare("SELECT * FROM orders WHERE status=? ORDER BY created_at DESC LIMIT 200").bind(status).all();
    return json({orders:result.results||[]});
  }
  const orderMatch=route.match(/^admin\/orders\/([^/]+)$/);
  if(orderMatch&&method==="GET") {
    const order=await db.prepare("SELECT * FROM orders WHERE id=?").bind(orderMatch[1]).first();
    if(!order)return json({error:"Order not found."},404);
    const [items,events]=await Promise.all([
      db.prepare("SELECT * FROM order_items WHERE order_id=?").bind(order.id).all(),
      db.prepare("SELECT * FROM order_events WHERE order_id=? ORDER BY created_at DESC").bind(order.id).all()
    ]);
    return json({order,items:items.results||[],events:events.results||[]});
  }
  if(orderMatch&&method==="PATCH") {
    const input=await readBody(request),current=await db.prepare("SELECT * FROM orders WHERE id=?").bind(orderMatch[1]).first();
    if(!current)return json({error:"Order not found."},404);
    const transitions={
      pending:["accepted","rejected","cancelled"],accepted:["preparing","cancelled"],
      preparing:["ready","cancelled"],ready:["out_for_delivery","completed","cancelled"],
      out_for_delivery:["completed"],awaiting_payment:[],payment_failed:["cancelled"],
      completed:[],rejected:[],cancelled:[]
    };
    const next=String(input?.status||current.status);
    if(next!==current.status&&!(transitions[current.status]||[]).includes(next))return json({error:"That order status change is not allowed."},409);
    const reason=String(input?.rejectionReason||"").trim().slice(0,300);
    if(next==="rejected"&&!reason)return json({error:"Enter a reason for rejecting this order."},400);
    await db.prepare("UPDATE orders SET status=?,rejection_reason=?,accepted_by=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
      .bind(next,reason||current.rejection_reason,next==="accepted"?user.display_name:current.accepted_by,current.id).run();
    if(next!==current.status)await db.prepare("INSERT INTO order_events(id,order_id,actor_name,from_status,to_status,note) VALUES(?,?,?,?,?,?)")
      .bind(makeId(),current.id,user.display_name,current.status,next,reason||String(input?.note||"")).run();
    return json({ok:true});
  }
  if(route==="admin/menu"&&method==="GET")return json(await getCatalog(db));
  if(route==="admin/menu/items"&&method==="POST") {
    const input=await readBody(request),category=String(input?.category||"").trim(),name=String(input?.name||"").trim().slice(0,100);
    const description=String(input?.description||"").trim().slice(0,300);
    const variants=Array.isArray(input?.variants)?input.variants.filter(v=>v&&String(v.label||"").trim()&&Number.isInteger(Number(v.price))&&Number(v.price)>0).map(v=>({label:String(v.label).trim().slice(0,50),price:Number(v.price)})):[];
    const price=Number(input?.price||0),cat=await db.prepare("SELECT id FROM menu_categories WHERE id=? AND is_active=1").bind(category).first();
    if(!cat||!name||(!variants.length&&(!Number.isInteger(price)||price<1)))return json({error:"Enter a product name, category and valid price or options."},400);
    const itemId=String(input?.id||("item-"+crypto.randomUUID().slice(0,8))).slice(0,80);
    const basePrice=variants.length?Math.min(...variants.map(v=>v.price)):price;
    await db.prepare("INSERT INTO menu_items(id,category_id,name,description,price_kes,variants_json,image_url,badge,available,sort_order) VALUES(?,?,?,?,?,?,?,?,?,999) ON CONFLICT(id) DO UPDATE SET category_id=excluded.category_id,name=excluded.name,description=excluded.description,price_kes=excluded.price_kes,variants_json=excluded.variants_json,image_url=excluded.image_url,badge=excluded.badge,available=excluded.available,updated_at=CURRENT_TIMESTAMP")
      .bind(itemId,category,name,description,basePrice,JSON.stringify(variants),String(input?.imageUrl||"").slice(0,500),String(input?.badge||"").slice(0,50),input?.available===false?0:1).run();
    return json({ok:true,id:itemId});
  }
  const itemMatch=route.match(/^admin\/menu\/items\/([^/]+)$/);
  if(itemMatch&&method==="PATCH") {
    const input=await readBody(request);
    await db.prepare("UPDATE menu_items SET available=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input?.available?1:0,itemMatch[1]).run();
    return json({ok:true});
  }
  if(route==="admin/menu/categories"&&method==="POST") {
    const input=await readBody(request),label=String(input?.label||"").trim().slice(0,60);
    const categoryId=String(input?.id||label.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")).slice(0,60);
    if(!label||!categoryId)return json({error:"Enter a category name."},400);
    await db.prepare("INSERT INTO menu_categories(id,label,intro,sort_order,is_active) VALUES(?,?,?,999,1) ON CONFLICT(id) DO UPDATE SET label=excluded.label,intro=excluded.intro,is_active=1,updated_at=CURRENT_TIMESTAMP")
      .bind(categoryId,label,String(input?.intro||"").slice(0,160)).run();
    return json({ok:true,id:categoryId});
  }
  if(route==="admin/settings"&&method==="GET")return json(await getSettings(db));
  if(route==="admin/settings"&&method==="PATCH") {
    if(!["owner","manager"].includes(user.role))return json({error:"Only an owner or manager can update store settings."},403);
    const input=await readBody(request);
    if(input?.demoMode!==undefined) {
      if(user.role!=="owner")return json({error:"Only the owner can switch between preview and live ordering."},403);
      await db.prepare("INSERT INTO app_settings(setting_key,setting_value) VALUES('demo_mode',?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_at=CURRENT_TIMESTAMP")
        .bind(input.demoMode?"true":"false").run();
    }
    const values=[
      ["delivery_enabled","deliveryEnabled"],["collection_enabled","collectionEnabled"],["store_open","storeOpen"],
      ["delivery_fee_kes","deliveryFeeKes"],["minimum_order_kes","minimumOrderKes"]
    ];
    for(const [key,property] of values) {
      if(input?.[property]===undefined)continue;
      let value;
      if(property==="deliveryEnabled"||property==="collectionEnabled"||property==="storeOpen")value=input[property]?"true":"false";
      else {const number=Number(input[property]);if(!Number.isInteger(number)||number<0||number>100000)return json({error:"Enter a valid amount."},400);value=String(number);}
      await db.prepare("INSERT INTO app_settings(setting_key,setting_value) VALUES(?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_at=CURRENT_TIMESTAMP").bind(key,value).run();
    }
    return json(await getSettings(db));
  }
  if(route==="admin/staff"&&method==="GET") {
    if(user.role!=="owner")return json({error:"Only the owner can manage staff accounts."},403);
    const result=await db.prepare("SELECT id,email,display_name,role,is_active,created_at FROM staff_users ORDER BY created_at").all();
    return json({staff:result.results||[]});
  }
  if(route==="admin/staff"&&method==="POST") {
    if(user.role!=="owner")return json({error:"Only the owner can create staff accounts."},403);
    const input=await readBody(request),email=String(input?.email||"").trim().toLowerCase(),name=String(input?.displayName||"").trim().slice(0,100);
    const password=String(input?.password||""),role=["manager","staff","kitchen"].includes(input?.role)?input.role:"staff";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||name.length<2||password.length<12)return json({error:"Enter a valid email, name and password of at least 12 characters."},400);
    const salt=randomBytes(16);
    try {
      await db.prepare("INSERT INTO staff_users(id,email,display_name,password_hash,password_salt,role,is_active) VALUES(?,?,?,?,?,?,1)")
        .bind(makeId(),email,name,await derivePassword(password,salt),toBase64Url(salt),role).run();
    } catch { return json({error:"That email already has a staff account."},409); }
    return json({ok:true});
  }
  const staffMatch=route.match(/^admin\/staff\/([^/]+)$/);
  if(staffMatch&&method==="PATCH") {
    if(user.role!=="owner")return json({error:"Only the owner can update staff accounts."},403);
    const input=await readBody(request),staff=await db.prepare("SELECT id,role FROM staff_users WHERE id=?").bind(staffMatch[1]).first();
    if(!staff||staff.role==="owner")return json({error:"Staff account not found."},404);
    await db.prepare("UPDATE staff_users SET is_active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input?.isActive?1:0,staff.id).run();
    return json({ok:true});
  }
  return json({error:"Not found."},404);
}

export async function onRequest(context) {
  const request=context.request,env=context.env||{},url=new URL(request.url);
  const route=url.pathname.replace(/^\/api\/?/,""),method=request.method.toUpperCase(),db=env.DB;
  if(!db)return json({error:"The ordering database is not connected to this deployment."},503);
  try {
    if(route==="health"&&method==="GET") {
      const s=await getSettings(db);
      return json({ok:true,database:"connected",demoMode:s.demoMode,mpesaEnabled:!s.demoMode&&darajaIsConfigured(env)});
    }
    if(route==="menu"&&method==="GET")return json(await getCatalog(db));
    if(route==="orders"&&method==="POST")return await createOrder(request,env,db);
    if(route.startsWith("mpesa/callback/")&&method==="POST") {
      const secret=decodeURIComponent(route.slice("mpesa/callback/".length));
      return await handleMpesaCallback(request,env,db,secret);
    }
    if(route==="admin/login"&&method==="POST")return await login(request,env,db);
    if(route==="admin/logout"&&method==="POST")return await logout(request,db);
    if(route==="admin/session"&&method==="GET") {
      const user=await authenticate(request,db);
      return user?json({user:{email:user.email,displayName:user.display_name,role:user.role}}):json({error:"Not signed in."},401);
    }
    const user=await authenticate(request,db);
    if(!user)return json({error:"Please sign in to continue."},401);
    if(route.startsWith("admin/"))return await handleAdmin(request,db,user,route,method);
    return json({error:"Not found."},404);
  } catch(error) {
    console.error("Huhu’s API error",error);
    return json({error:error?.message||"The request could not be completed."},500);
  }
}
