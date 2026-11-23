import "./admin.css";

const root=document.querySelector("#app");
const money=n=>"KES "+new Intl.NumberFormat("en-KE",{maximumFractionDigits:0}).format(Number(n||0));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let user=null,section="overview",menuData={categories:[],items:[]},filter="all",dashboardTimer=null;

async function api(path,options={}) {
  const response=await fetch("/api/"+path,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||"Request failed.");
  return result;
}
function loginScreen(error="") {
  root.innerHTML='<main class="login-wrap"><form id="login-form" class="login-card"><div class="admin-mark">H</div><p class="admin-kicker">HUHU’S PIZZA & GRILL</p><h1>Management</h1><p class="muted">Sign in to manage online orders and the menu.</p>'+(error?'<div class="alert">'+esc(error)+'</div>':'')+'<label>Email address<input name="email" type="email" required autocomplete="username"></label><label>Password<input name="password" type="password" required autocomplete="current-password"></label><button class="primary-btn" type="submit">Sign in <span>→</span></button><a class="back-link" href="/">← Back to ordering</a></form></main>';
  document.querySelector("#login-form").addEventListener("submit",async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget),button=event.currentTarget.querySelector("button");
    button.disabled=true;
    try{const result=await api("admin/login",{method:"POST",body:JSON.stringify({email:form.get("email"),password:form.get("password")})});user=result.user;await renderShell();}
    catch(error){loginScreen(error.message);}
  });
}
async function boot(){try{const result=await api("admin/session");user=result.user;await renderShell();}catch{loginScreen();}}
async function renderShell() {
  root.innerHTML='<div class="admin-app"><aside class="admin-sidebar"><a class="admin-brand" href="/"><span class="admin-mark">H</span><span>HUHU’S<small>MANAGEMENT</small></span></a><div class="sidebar-label">WORKSPACE</div><nav id="admin-nav"><button data-section="overview" class="active"><i>▦</i> Overview</button><button data-section="orders"><i>▤</i> Orders</button><button data-section="menu"><i>☷</i> Menu</button><button data-section="settings"><i>⚙</i> Store settings</button><button data-section="staff" data-owner-only><i>♙</i> Staff accounts</button></nav><div class="sidebar-bottom"><span class="user-avatar">'+esc((user.displayName||"H").slice(0,1).toUpperCase())+'</span><div><b>'+esc(user.displayName)+'</b><small>'+esc(user.role)+'</small></div><button id="logout-btn" title="Sign out">↗</button></div></aside><main class="admin-main"><header class="admin-topbar"><div><div class="admin-kicker">HUHU’S DIGITAL OPERATIONS</div><h1 id="page-title">Overview</h1></div><div class="top-actions"><span class="preview-pill">PREVIEW MODE</span><button class="icon-action" id="refresh-btn" title="Refresh">↻</button><a class="view-store" href="/" target="_blank">View store ↗</a></div></header><div class="admin-content" id="admin-content"></div></main></div>';
  if(user.role!=="owner")document.querySelectorAll("[data-owner-only]").forEach(x=>x.hidden=true);
  document.querySelector("#admin-nav").addEventListener("click",event=>{const button=event.target.closest("[data-section]");if(button)navigate(button.dataset.section);});
  document.querySelector("#logout-btn").onclick=async()=>{try{await api("admin/logout",{method:"POST"});}finally{user=null;loginScreen();}};
  document.querySelector("#refresh-btn").onclick=renderSection;
  await navigate("overview");
  if(dashboardTimer)window.clearInterval(dashboardTimer);
  dashboardTimer=window.setInterval(()=>{
    if(["overview","orders"].includes(section)&&!document.querySelector("#order-modal"))renderSection();
  },12000);
}
async function navigate(name) {
  section=name;
  document.querySelectorAll("#admin-nav [data-section]").forEach(b=>b.classList.toggle("active",b.dataset.section===name));
  document.querySelector("#page-title").textContent=({overview:"Overview",orders:"Orders",menu:"Menu management",settings:"Store settings",staff:"Staff accounts"})[name]||"Overview";
  await renderSection();
}
function statusName(value){return String(value||"").replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());}
function statusBadge(value){return '<span class="status status-'+String(value||"").replace(/_/g,"-")+'">'+statusName(value)+'</span>';}
function dateLabel(value){return value?new Date(value.replace(" ","T")+"Z").toLocaleString("en-KE",{dateStyle:"medium",timeStyle:"short"}):"—";}
async function renderSection() {
  const host=document.querySelector("#admin-content");if(!host)return;
  host.innerHTML='<div class="loading-state">Loading…</div>';
  try{
    if(section==="overview")await showOverview(host);
    if(section==="orders")await showOrders(host);
    if(section==="menu")await showMenu(host);
    if(section==="settings")await showSettings(host);
    if(section==="staff")await showStaff(host);
  }catch(error){host.innerHTML='<div class="alert">'+esc(error.message)+'</div>';}
}
function orderTable(rows) {
  if(!rows.length)return '<div class="empty-state">No orders yet. Submit a test order from the customer PWA to see it here.</div>';
  return '<table><thead><tr><th>Order</th><th>Customer</th><th>Fulfilment</th><th>Total</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>'+rows.map(o=>'<tr><td><b>'+esc(o.reference)+'</b><small>'+esc(o.payment_method)+'</small></td><td>'+esc(o.customer_name)+'<small>'+esc(o.customer_phone)+'</small></td><td>'+esc(o.fulfilment)+'</td><td>'+money(o.total_kes)+'</td><td>'+statusBadge(o.status)+'</td><td>'+dateLabel(o.created_at)+'</td><td><button class="text-btn" data-order="'+esc(o.id)+'">Open →</button></td></tr>').join("")+'</tbody></table>';
}
async function showOverview(host) {
  const data=await api("admin/overview"),counts=data.counts||{};
  const cards=[["New orders",counts.pending||0,"Waiting for acceptance"],["Preparing",counts.preparing||0,"In the kitchen"],["Ready",counts.ready||0,"Awaiting collection or dispatch"],["Orders today",data.today.orders||0,money(data.today.valueKes||0)+" order value"]];
  const recent=await api("admin/orders");
  host.innerHTML='<div class="mode-notice"><b>Preview environment</b><span>Customer test orders are saved here. They are not being sent to Huhu’s live restaurant team for fulfilment.</span></div><div class="metric-grid">'+cards.map(c=>'<article class="metric-card"><span>'+c[0]+'</span><strong>'+c[1]+'</strong><small>'+c[2]+'</small></article>').join("")+'</div><div class="section-head"><div><h2>Recent orders</h2><p>Latest activity from the customer ordering PWA.</p></div><button class="outline-btn" id="all-orders">View all orders →</button></div><div id="recent-orders" class="table-wrap">'+orderTable((recent.orders||[]).slice(0,7))+'</div><div class="overview-foot"><span>Menu items <b>'+data.menuItems+'</b></span><span>Recorded paid sales <b>'+money(data.paidSalesKes)+'</b></span></div>';
  document.querySelector("#all-orders").onclick=()=>navigate("orders");
  host.querySelector("#recent-orders").addEventListener("click",event=>{const button=event.target.closest("[data-order]");if(button)openOrder(button.dataset.order);});
}
async function showOrders(host) {
  const result=await api("admin/orders?status="+encodeURIComponent(filter));
  host.innerHTML='<div class="section-head"><div><h2>Order inbox</h2><p>Review orders and move them through fulfilment.</p></div><select id="order-filter"><option value="all">All orders</option>'+["pending","accepted","preparing","ready","out_for_delivery","completed","rejected","cancelled","awaiting_payment","payment_failed"].map(s=>'<option value="'+s+'">'+statusName(s)+'</option>').join("")+'</select></div><div class="table-wrap" id="orders-table">'+orderTable(result.orders||[])+'</div>';
  const select=document.querySelector("#order-filter");select.value=filter;select.onchange=()=>{filter=select.value;renderSection();};
  host.querySelector("#orders-table").addEventListener("click",event=>{const button=event.target.closest("[data-order]");if(button)openOrder(button.dataset.order);});
}
async function openOrder(orderId) {
  try{
    const data=await api("admin/orders/"+encodeURIComponent(orderId)),o=data.order;
    const allowed={pending:["accepted","rejected","cancelled"],accepted:["preparing","cancelled"],preparing:["ready","cancelled"],ready:["out_for_delivery","completed","cancelled"],out_for_delivery:["completed"],awaiting_payment:[],payment_failed:["cancelled"],completed:[],rejected:[],cancelled:[]};
    const buttons=(allowed[o.status]||[]).map(s=>'<button class="'+(s==="rejected"||s==="cancelled"?"danger-btn":"primary-btn")+'" data-next-status="'+s+'">'+statusName(s)+'</button>').join("");
    const modal='<div class="modal-backdrop" id="order-modal"><section class="detail-modal"><div class="modal-head"><div><span class="admin-kicker">ORDER DETAILS</span><h2>'+esc(o.reference)+'</h2></div><button class="icon-action" id="order-close">×</button></div><div class="order-detail-grid"><div><small>CUSTOMER</small><b>'+esc(o.customer_name)+'</b><span>'+esc(o.customer_phone)+'</span></div><div><small>FULFILMENT</small><b>'+esc(o.fulfilment)+'</b><span>'+esc(o.delivery_address||"Collection")+'</span></div><div><small>PAYMENT</small><b>'+esc(o.payment_method)+' · '+esc(o.payment_status)+'</b><span>Total '+money(o.total_kes)+'</span></div><div><small>STATUS</small><b>'+statusBadge(o.status)+'</b><span>'+dateLabel(o.created_at)+'</span></div></div><h3>Items</h3><div class="detail-lines">'+(data.items||[]).map(i=>'<div><span>'+i.quantity+' × '+esc(i.item_name)+(i.variant?" · "+esc(i.variant):"")+'</span><b>'+money(i.line_total_kes)+'</b></div>').join("")+'</div><div class="detail-total"><span>Subtotal</span><b>'+money(o.subtotal_kes)+'</b></div><div class="detail-total"><span>Delivery</span><b>'+money(o.delivery_fee_kes)+'</b></div><div class="detail-total grand"><span>Total</span><b>'+money(o.total_kes)+'</b></div><h3>Update order status</h3><div class="action-row">'+(buttons||'<span class="muted">No further status changes available.</span>')+'</div><div class="event-list"><h3>Order history</h3>'+(data.events||[]).map(ev=>'<div><b>'+statusName(ev.to_status)+'</b><span>'+esc(ev.actor_name)+' · '+dateLabel(ev.created_at)+'</span><small>'+esc(ev.note)+'</small></div>').join("")+'</div></section></div>';
    document.body.insertAdjacentHTML("beforeend",modal);
    document.querySelector("#order-close").onclick=()=>document.querySelector("#order-modal").remove();
    document.querySelector("#order-modal").addEventListener("click",event=>{if(event.target.id==="order-modal")event.currentTarget.remove();});
    document.querySelectorAll("[data-next-status]").forEach(button=>button.onclick=async()=>{
      let reason="";if(button.dataset.nextStatus==="rejected"){reason=prompt("Reason for rejecting this order:")||"";if(!reason.trim())return;}
      try{await api("admin/orders/"+encodeURIComponent(orderId),{method:"PATCH",body:JSON.stringify({status:button.dataset.nextStatus,rejectionReason:reason})});document.querySelector("#order-modal").remove();await renderSection();}
      catch(error){alert(error.message);}
    });
  }catch(error){alert(error.message);}
}
async function showMenu(host) {
  menuData=await api("admin/menu");const items=menuData.items||[];
  host.innerHTML='<div class="section-head"><div><h2>Menu catalogue</h2><p>Edits here update the customer ordering app.</p></div><button class="primary-btn" id="add-menu-item">+ Add item</button></div><div class="toolbar"><span>'+items.length+' products and options</span><button class="outline-btn" id="add-menu-category">+ Add category</button></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Availability</th><th>Action</th></tr></thead><tbody>'+items.map(i=>'<tr><td><b>'+esc(i.name)+'</b><small>'+esc(i.description)+'</small></td><td>'+esc(i.category)+'</td><td>'+(i.variants?.length?"From "+money(Math.min(...i.variants.map(v=>v.price))):money(i.price))+'</td><td>'+statusBadge(i.available?"active":"off")+'</td><td><button class="text-btn" data-edit="'+esc(i.id)+'">Edit</button><button class="text-btn" data-toggle="'+esc(i.id)+'" data-available="'+(!i.available)+'">'+(i.available?"Disable":"Enable")+'</button></td></tr>').join("")+'</tbody></table></div>';
  document.querySelector("#add-menu-item").onclick=()=>editItem(null);
  document.querySelector("#add-menu-category").onclick=addCategory;
  host.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editItem(items.find(i=>i.id===b.dataset.edit)));
  host.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=async()=>{await api("admin/menu/items/"+encodeURIComponent(b.dataset.toggle),{method:"PATCH",body:JSON.stringify({available:b.dataset.available==="true"})});await renderSection();});
}
function editItem(item) {
  const categories=menuData.categories||[],variants=item?.variants||[];
  const html='<div class="modal-backdrop" id="item-modal"><form class="detail-modal form-modal" id="item-form"><div class="modal-head"><div><span class="admin-kicker">MENU CATALOGUE</span><h2>'+(item?"Edit item":"Add menu item")+'</h2></div><button type="button" class="icon-action" id="item-close">×</button></div><label>Product name<input name="name" required value="'+esc(item?.name||"")+'"></label><label>Category<select name="category">'+categories.map(c=>'<option value="'+esc(c.id)+'" '+(item?.category===c.id?"selected":"")+'>'+esc(c.label)+'</option>').join("")+'</select></label><label>Description<textarea name="description" rows="2">'+esc(item?.description||"")+'</textarea></label><label>Price (KES)<input name="price" type="number" min="1" value="'+esc(item?.price||"")+'"></label><label>Sizes/options, one per line (e.g. Small:750)<textarea name="variants" rows="3" placeholder="Small:750&#10;Medium:1000&#10;Large:1250">'+variants.map(v=>esc(v.label+":"+v.price)).join("\n")+'</textarea></label><label>Image URL<input name="imageUrl" type="url" value="'+esc(item?.image_url||"")+'"></label><label>Badge<input name="badge" value="'+esc(item?.badge||"")+'"></label><label class="check-label"><input type="checkbox" name="available" '+(item?.available===false?"":"checked")+'> Available to order</label><button class="primary-btn" type="submit">Save item</button></form></div>';
  document.body.insertAdjacentHTML("beforeend",html);
  document.querySelector("#item-close").onclick=()=>document.querySelector("#item-modal").remove();
  document.querySelector("#item-form").onsubmit=async event=>{
    event.preventDefault();const form=new FormData(event.currentTarget);
    const options=String(form.get("variants")||"").split("\n").map(x=>x.trim()).filter(Boolean).map(x=>{const colon=x.lastIndexOf(":");return colon>0?{label:x.slice(0,colon).trim(),price:Number(x.slice(colon+1))}:null;}).filter(Boolean);
    try{await api("admin/menu/items",{method:"POST",body:JSON.stringify({id:item?.id,name:form.get("name"),category:form.get("category"),description:form.get("description"),price:Number(form.get("price")),variants:options,imageUrl:form.get("imageUrl"),badge:form.get("badge"),available:form.get("available")==="on"})});document.querySelector("#item-modal").remove();await renderSection();}
    catch(error){alert(error.message);}
  };
}
async function addCategory() {
  const label=prompt("New menu category name:");if(!label?.trim())return;
  try{await api("admin/menu/categories",{method:"POST",body:JSON.stringify({label})});await renderSection();}catch(error){alert(error.message);}
}
async function showSettings(host) {
  const s=await api("admin/settings");
  host.innerHTML='<div class="section-head"><div><h2>Store settings</h2><p>Control when the customer app can accept orders.</p></div></div><div class="settings-card"><div class="setting-row"><div><b>Preview mode</b><small>Keep this ON during demonstrations. Preview orders are stored but are not treated as live restaurant orders.</small></div><input type="checkbox" id="demo-mode" '+(s.demoMode?"checked":"")+'></div><div class="mode-notice" id="mode-notice"><b>'+(s.demoMode?"Preview mode is ON":"Live ordering is ON")+'</b><span>'+(s.demoMode?"Test orders are marked as previews. Switch this off only after Huhu’s menu, delivery rules and staff workflow are approved.":"Customer orders will enter the operational order inbox. Confirm staff are ready to receive and fulfil them.")+'</span></div><div class="setting-row"><div><b>Accept online orders</b><small>Pause checkout when the store cannot accept orders.</small></div><input type="checkbox" id="store-open" '+(s.storeOpen?"checked":"")+'></div><div class="setting-row"><div><b>Delivery</b><small>Allow delivery as a fulfilment option.</small></div><input type="checkbox" id="delivery-enabled" '+(s.deliveryEnabled?"checked":"")+'></div><div class="setting-row"><div><b>Collection</b><small>Allow customers to collect orders.</small></div><input type="checkbox" id="collection-enabled" '+(s.collectionEnabled?"checked":"")+'></div><label>Delivery fee (KES)<input id="delivery-fee" type="number" min="0" value="'+s.deliveryFeeKes+'"></label><label>Minimum order (KES)<input id="minimum-order" type="number" min="0" value="'+s.minimumOrderKes+'"></label><button class="primary-btn" id="save-settings">Save settings</button></div>';
  document.querySelector("#save-settings").onclick=async()=>{
    const values={demoMode:document.querySelector("#demo-mode").checked,storeOpen:document.querySelector("#store-open").checked,deliveryEnabled:document.querySelector("#delivery-enabled").checked,collectionEnabled:document.querySelector("#collection-enabled").checked,deliveryFeeKes:Number(document.querySelector("#delivery-fee").value),minimumOrderKes:Number(document.querySelector("#minimum-order").value)};
    try{await api("admin/settings",{method:"PATCH",body:JSON.stringify(values)});alert("Store settings saved.");}catch(error){alert(error.message);}
  };
}
async function showStaff(host) {
  if(user.role!=="owner"){host.innerHTML='<div class="alert">Only the owner can manage staff accounts.</div>';return;}
  const result=await api("admin/staff");
  host.innerHTML='<div class="section-head"><div><h2>Staff accounts</h2><p>Give each team member an individual login.</p></div><button class="primary-btn" id="add-staff">+ Add staff member</button></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th><th></th></tr></thead><tbody>'+(result.staff||[]).map(s=>'<tr><td><b>'+esc(s.display_name)+'</b></td><td>'+esc(s.email)+'</td><td>'+esc(s.role)+'</td><td>'+(s.is_active?"Active":"Disabled")+'</td><td>'+(s.role==="owner"?"":'<button class="text-btn" data-staff="'+esc(s.id)+'" data-active="'+(!s.is_active)+'">'+(s.is_active?"Disable":"Enable")+'</button>')+'</td></tr>').join("")+'</tbody></table></div>';
  document.querySelector("#add-staff").onclick=async()=>{
    const displayName=prompt("Staff member name:"),email=prompt("Staff email:");
    if(!displayName||!email)return;
    const role=prompt("Role: manager, staff or kitchen","staff")||"staff";
    const password=prompt("Temporary password (minimum 12 characters):");
    if(!password)return;
    try{await api("admin/staff",{method:"POST",body:JSON.stringify({displayName,email,role,password})});await renderSection();}catch(error){alert(error.message);}
  };
  host.querySelectorAll("[data-staff]").forEach(b=>b.onclick=async()=>{await api("admin/staff/"+encodeURIComponent(b.dataset.staff),{method:"PATCH",body:JSON.stringify({isActive:b.dataset.active==="true"})});await renderSection();});
}
boot();
