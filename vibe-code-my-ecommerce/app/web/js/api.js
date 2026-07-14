const API_BASE = window.location.port === "3000" ? "http://localhost:3000/api" : "/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  window.location.href = "/pages/login.html";
}

function getCart() {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);
  const currentQty = existing ? existing.quantity : 0;
  const newQty = currentQty + quantity;
  const stock = product.inventory;

  if (newQty > stock) {
    showToast(`Only ${stock} in stock${currentQty > 0 ? ` (${currentQty} in cart)` : ""}`);
    return;
  }

  if (existing) {
    existing.quantity = newQty;
  } else {
    cart.push({
      _id: product._id,
      product_name: product.product_name,
      price: product.price,
      pics_urls: product.pics_urls,
      inventory: product.inventory,
      quantity,
    });
  }
  saveCart(cart);
  showToast("Added to cart");
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
  }
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }
  return data;
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "/pages/login.html";
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== "admin") {
    window.location.href = "/pages/login.html";
    return false;
  }
  return true;
}
