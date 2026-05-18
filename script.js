const products = [
  { id: 1, brand: "GUCCI", name: "Classic Blazer", price: 899, originalPrice: 1099, discount: 18, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
  { id: 2, brand: "NIKE", name: "Sport Hoodie", price: 159, originalPrice: 189, discount: 16, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80" },
  { id: 3, brand: "ADIDAS", name: "Track Jacket", price: 199, originalPrice: 249, discount: 20, image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80" },
  { id: 4, brand: "PRADA", name: "Leather Handbag", price: 1299, originalPrice: 1599, discount: 19, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  { id: 5, brand: "COMMON PROJECTS", name: "Minimalist Sneakers", price: 399, originalPrice: 499, discount: 20, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80" },
  { id: 6, brand: "LORO PIANA", name: "Cashmere Sweater", price: 799, originalPrice: 999, discount: 20, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80" },
  { id: 7, brand: "BALENCIAGA", name: "Oversized Hoodie", price: 750, originalPrice: 900, discount: 17, image: "https://images.unsplash.com/photo-1721111260492-afe3d9e5bd76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG92ZXJzaXplZCUyMGhvb2RpZXxlbnwwfHwwfHx8MA%3D%3D"},
  { id: 8, brand: "RALPH LAUREN", name: "Classic Polo", price: 129, originalPrice: 159, discount: 19, image: "https://images.unsplash.com/photo-1631034527645-9c3a92b73abd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNsYXNzaWMlMjBwb2xvfGVufDB8fDB8fHww"},
  { id: 9, brand: "ADIDAS", name: "Track  Jacket", price: 199, originalPrice: 249, discount: 20, image: "https://images.unsplash.com/photo-1654881710580-ac11d4c3ecba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fHRyYWNrJTIwamFja2V0fGVufDB8fDB8fHww"}
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.quantity++; }
  else { cart.push({ ...product, quantity: 1 }); }
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart!`);
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <span class="sale-badge">-${p.discount}%</span>
      <img src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <p class="product-brand">${p.brand}</p>
        <p class="product-name">${p.name}</p>
        <div class="product-prices">
          <span class="price-current">$${p.price}</span>
          <span class="price-original">$${p.originalPrice}</span>
        </div>
        <button class="btn-primary" style="width:100%;padding:0.625rem;" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
    footer.style.display = "none";
    return;
  }
  footer.style.display = "block";
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="cart-item-brand">${item.brand}</p>
        <p style="font-weight:500;">${item.name}</p>
        <p style="color:var(--primary);font-weight:600;">$${item.price}</p>
        <div class="cart-qty">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
          <button onclick="removeItem(${item.id})" style="margin-left:auto;color:var(--muted);">🗑</button>
        </div>
      </div>
    </div>
  `).join("");
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  item.quantity += delta;
  if (item.quantity <= 0) removeItem(id);
  else { saveCart(); renderCart(); }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

document.getElementById("cartToggle").onclick = () => {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartBackdrop").classList.add("open");
};
document.getElementById("cartClose").onclick = () => {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("open");
};
document.getElementById("cartBackdrop").onclick = () => {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartBackdrop").classList.remove("open");
};

document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

renderProducts(products);
renderCart();
updateCartCount();