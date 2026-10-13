const MENU = [
  { id: 1, name: 'Chicken Biryani', cat: 'Meals', veg: false, price: 220, e: '🍛', d: 'Basmati rice, tender chicken, house masala.' },
  { id: 2, name: 'Paneer Butter Masala', cat: 'Meals', veg: true, price: 190, e: '🧀', d: 'Creamy tomato gravy with soft paneer.' },
  { id: 3, name: 'South Indian Meals', cat: 'Meals', veg: true, price: 150, e: '🍱', d: 'Rice, sambar, rasam, poriyal and curd.' },
  { id: 4, name: 'Margherita Pizza', cat: 'Fast Food', veg: true, price: 249, e: '🍕', d: 'Thin crust, tomato sauce and mozzarella.' },
  { id: 5, name: 'Chicken Burger', cat: 'Fast Food', veg: false, price: 169, e: '🍔', d: 'Crispy chicken patty with fresh lettuce.' },
  { id: 6, name: 'Veg Wrap', cat: 'Fast Food', veg: true, price: 129, e: '🌯', d: 'Grilled vegetables and mint mayo.' },
  { id: 7, name: 'Samosa (2 pcs)', cat: 'Snacks', veg: true, price: 40, e: '🥟', d: 'Crisp pastry with spiced potato filling.' },
  { id: 8, name: 'French Fries', cat: 'Snacks', veg: true, price: 89, e: '🍟', d: 'Golden fries with peri peri seasoning.' },
  { id: 9, name: 'Chicken 65', cat: 'Snacks', veg: false, price: 179, e: '🍗', d: 'Spicy fried chicken bites.' },
  { id: 10, name: 'Gulab Jamun', cat: 'Desserts', veg: true, price: 79, e: '🍮', d: 'Warm milk dumplings in sugar syrup.' },
  { id: 11, name: 'Chocolate Brownie', cat: 'Desserts', veg: true, price: 99, e: '🍫', d: 'Fudgy brownie with chocolate chunks.' },
  { id: 12, name: 'Cold Coffee', cat: 'Drinks', veg: true, price: 89, e: '☕', d: 'Chilled coffee blended with ice cream.' },
  { id: 13, name: 'Fresh Lime Soda', cat: 'Drinks', veg: true, price: 59, e: '🥤', d: 'Sweet or salted, served chilled.' }
];
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = n => '₹' + n.toLocaleString('en-IN');
const load = () => { try { return JSON.parse(localStorage.getItem('foodie_cart')) || {}; } catch (e) { return {}; } };
let cart = load(), cat = 'All', q = '', placed = false;
const persist = () => { try { localStorage.setItem('foodie_cart', JSON.stringify(cart)); } catch (e) {} };
const byId = id => MENU.find(m => m.id === +id);

function ctrl(id) {
  const n = cart[id] || 0;
  return n
    ? `<span class="qty"><button class="btn btn-outline-danger" data-dec="${id}" aria-label="Remove one">−</button><b>${n}</b><button class="btn btn-danger" data-inc="${id}" aria-label="Add one">+</button></span>`
    : `<button class="btn btn-sm btn-danger" data-inc="${id}"><i class="bi bi-plus-lg"></i> Add</button>`;
}
function renderCats() {
  const cats = ['All', ...new Set(MENU.map(m => m.cat))];
  $('#cats').innerHTML = cats.map(c => `<button class="btn btn-sm btn-outline-secondary pill ${c === cat ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
}
function renderMenu() {
  const list = MENU.filter(m => (cat === 'All' || m.cat === cat) && (m.name + m.d).toLowerCase().includes(q));
  $('#noItems').classList.toggle('d-none', list.length > 0);
  $('#menuGrid').innerHTML = list.map(m => `
    <div class="col-sm-6 col-lg-4 col-xl-3"><div class="card dish">
      <div class="emoji" aria-hidden="true">${m.e}</div>
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start"><h3 class="h6 fw-bold mb-1">${m.name}</h3><span class="vd ${m.veg ? 'veg' : 'nonveg'}" title="${m.veg ? 'Veg' : 'Non-veg'}"></span></div>
        <p class="small text-secondary flex-grow-1">${m.d}</p>
        <div class="d-flex justify-content-between align-items-center"><b>${inr(m.price)}</b><span id="c${m.id}">${ctrl(m.id)}</span></div>
      </div></div></div>`).join('');
}
function totals() {
  const sub = Object.entries(cart).reduce((s, [id, n]) => s + byId(id).price * n, 0);
  const gst = Math.round(sub * 0.05), delivery = sub === 0 ? 0 : sub >= 499 ? 0 : 30;
  return { sub, gst, delivery, total: sub + gst + delivery };
}
function renderCart() {
  const ids = Object.keys(cart), count = ids.reduce((s, id) => s + cart[id], 0), t = totals();
  $('#cartCount').textContent = count;
  $('#checkoutBtn').disabled = !count;
  $('#clearBtn').classList.toggle('d-none', !count);
  $('#cartItems').innerHTML = count ? ids.map(id => { const m = byId(id); return `
    <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div><div class="fw-semibold">${m.e} ${m.name}</div><small class="text-secondary">${inr(m.price)} each</small></div>
      <div class="text-end">${ctrl(id)}<div class="small fw-semibold mt-1">${inr(m.price * cart[id])}</div></div></div>`; }).join('')
    : '<p class="text-secondary text-center mt-4">Your cart is empty. Add something tasty from the menu.</p>';
  $('#cartTotals').innerHTML = count ? `
    <div class="d-flex justify-content-between"><span>Subtotal</span><span>${inr(t.sub)}</span></div>
    <div class="d-flex justify-content-between"><span>GST (5%)</span><span>${inr(t.gst)}</span></div>
    <div class="d-flex justify-content-between"><span>Delivery</span><span>${t.delivery ? inr(t.delivery) : 'Free'}</span></div>
    <div class="d-flex justify-content-between fw-bold fs-5 mt-2"><span>Total</span><span>${inr(t.total)}</span></div>` : '';
  MENU.forEach(x => { const el = $('#c' + x.id); if (el) el.innerHTML = ctrl(x.id); });
}
function change(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  persist(); renderCart();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-inc],[data-dec],[data-cat]');
  if (!b) return;
  if (b.dataset.inc) change(b.dataset.inc, 1);
  else if (b.dataset.dec) change(b.dataset.dec, -1);
  else { cat = b.dataset.cat; renderCats(); renderMenu(); }
});
$('#search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); renderMenu(); });
$('#clearBtn').addEventListener('click', () => { cart = {}; persist(); renderCart(); });

document.querySelectorAll('.needs-validation').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault(); f.classList.add('was-validated');
  if (!f.checkValidity()) return;
  if (f.id === 'contactForm') {
    $('#contactMsg').innerHTML = '<div class="alert alert-success mb-0">Thanks, we received your message and will reply soon.</div>';
    f.reset(); f.classList.remove('was-validated');
  } else {
    placed = true; const t = totals(), id = 'FD' + Date.now().toString().slice(-6);
    $('#coBody').innerHTML = `<div class="text-center py-3"><div class="display-4">🎉</div><h5 class="mt-2">Order placed</h5>
      <p class="mb-1">Order <b>${id}</b> for <b>${esc($('#on').value)}</b></p><p class="text-secondary">Total ${inr(t.total)}. Your food is on its way.</p>
      <button class="btn btn-danger" data-bs-dismiss="modal">Done</button></div>`;
    cart = {}; persist(); renderCart();
  }
}));
$('#checkout').addEventListener('hidden.bs.modal', () => { if (placed) location.reload(); });

renderCats(); renderMenu(); renderCart();
