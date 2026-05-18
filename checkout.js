const PROMO_CODES = { SAVE10: 0.1, SAVE20: 0.2, WELCOME: 0.15 };
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let step = 1;
let appliedPromo = null;
let shippingData = {};

function init() {
  if (cart.length === 0) {
    document.querySelector(".checkout-grid").style.display = "none";
    document.getElementById("steps").style.display = "none";
    document.getElementById("emptyState").style.display = "block";
    return;
  }
  renderStep();
  renderSummary();
}

function renderStep() {
  const area = document.getElementById("formArea");
  const steps = document.querySelectorAll(".step");
  steps[0].classList.toggle("active", step >= 1);
  steps[1].classList.toggle("active", step >= 2);

  if (step === 1) {
    area.innerHTML = `
      <h2 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:1.5rem;">Shipping Information</h2>
      <form id="shippingForm" onsubmit="submitShipping(event)">
        <div class="form-row">
          <div><label>First name</label><input class="search-input" required id="firstName" /></div>
          <div><label>Last name</label><input class="search-input" required id="lastName" /></div>
        </div>
        <label>Email</label><input type="email" class="search-input" required id="email" />
        <label>Phone</label><input type="tel" class="search-input" required id="phone" />
        <label>Address</label><input class="search-input" required id="address" />
        <div class="form-row">
          <div><label>City</label><input class="search-input" required id="city" /></div>
          <div><label>State</label><input class="search-input" required id="state" /></div>
        </div>
        <div class="form-row">
          <div><label>ZIP Code</label><input class="search-input" required id="zip" /></div>
          <div><label>Country</label><input class="search-input" value="United States" id="country" /></div>
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:1.5rem;">Continue to Payment</button>
      </form>`;
  } else {
    area.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h2 style="font-family:var(--font-display);font-size:1.5rem;">Payment Details</h2>
        <button onclick="step=1;renderStep();" style="background:none;border:none;color:var(--primary);cursor:pointer;font-size:0.875rem;">Edit shipping</button>
      </div>
      <form id="paymentForm" onsubmit="submitPayment(event)">
        <label>Card number</label><input class="search-input" required placeholder="1234 5678 9012 3456" id="cardNum" />
        <label>Name on card</label><input class="search-input" required id="cardName" />
        <div class="form-row">
          <div><label>Expiry date</label><input class="search-input" required placeholder="MM/YY" id="expiry" /></div>
          <div><label>CVV</label><input class="search-input" required placeholder="123" id="cvv" /></div>
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:1.5rem;" id="payBtn">Pay $${getTotal().toFixed(2)}</button>
      </form>`;
  }
}

function renderSummary() {
  const el = document.getElementById("orderSummary");
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0;
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  el.innerHTML = `
    <h3>Order Summary</h3>
    ${cart.map(i => `
      <div class="summary-item">
        <img src="${i.image}" alt="${i.name}" />
        <div style="flex:1;">
          <p class="summary-item-brand">${i.brand}</p>
          <p style="font-weight:500;">${i.name}</p>
          <p style="font-size:0.875rem;color:var(--muted);">Qty: ${i.quantity}</p>
        </div>
        <p style="font-weight:600;">$${(i.price * i.quantity).toFixed(2)}</p>
      </div>
    `).join("")}
    ${appliedPromo ? `
      <div class="promo-applied">
        <span>🏷 ${appliedPromo}</span>
        <button onclick="appliedPromo=null;renderSummary();renderStep();">Remove</button>
      </div>
    ` : `
      <div class="promo-row">
        <input class="search-input" placeholder="Promo code" id="promoInput" style="margin:0;" />
        <button class="btn-secondary" style="padding:0.625rem 1rem;white-space:nowrap;" onclick="applyPromo()">Apply</button>
      </div>
      <p id="promoError" style="color:var(--destructive);font-size:0.8rem;margin-bottom:0.5rem;"></p>
      <p style="font-size:0.75rem;color:var(--muted);margin-bottom:1rem;">Try: SAVE10, SAVE20, WELCOME</p>
    `}
    <div class="summary-totals">
      <div class="summary-line"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      ${discount > 0 ? `<div class="summary-line discount"><span>Discount (${Math.round(PROMO_CODES[appliedPromo]*100)}%)</span><span>-$${discount.toFixed(2)}</span></div>` : ""}
      <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span></div>
      <div class="summary-line"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>
      <div class="summary-line total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>`;
}

function getTotal() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0;
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  return subtotal - discount + shipping + tax;
}

function applyPromo() {
  const code = document.getElementById("promoInput").value.trim().toUpperCase();
  if (PROMO_CODES[code]) { appliedPromo = code; renderSummary(); renderStep(); }
  else { document.getElementById("promoError").textContent = "Invalid promo code"; }
}

function submitShipping(e) {
  e.preventDefault();
  step = 2;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function submitPayment(e) {
  e.preventDefault();
  const btn = document.getElementById("payBtn");
  btn.textContent = "Processing...";
  btn.disabled = true;
  setTimeout(() => {
    localStorage.removeItem("cart");
    document.querySelector(".checkout-grid").style.display = "none";
    document.getElementById("steps").style.display = "none";
    document.getElementById("completeState").style.display = "block";
  }, 2000);
}

init();