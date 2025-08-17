// js/cart.js

// ===== تنظیمات پایه =====
const API_BASE = "http://localhost:3000";
const cartWrapper = document.querySelector(".branch-wrapper");
// در این صفحه span مربوط به آیکون سبد کلاس خاصی ندارد؛ این انتخاب‌گر کار می‌کند:
const basketBadge = document.querySelector('nav a[href="cart.html"] span');

// ===== ابزارها =====
const rials = n => Number(n || 0);
const fmt = n => rials(n).toLocaleString("fa-IR"); // جدا‌کننده هزارگان

async function updateBasketBadge() {
  if (!basketBadge) return;
  try {
    const res = await fetch(`${API_BASE}/cart`);
    const cart = await res.json();
    const totalCount = cart.reduce((s, it) => s + (it.count || 1), 0);
    basketBadge.textContent = String(totalCount);
  } catch (e) {
    console.error("Badge error:", e);
  }
}

// ===== دریافت و رندر سبد =====
async function fetchCart() {
  try {
    cartWrapper.innerHTML = `
      <div class="flex items-center justify-center py-10">
        <div class="animate-pulse text-gray-500">در حال بارگذاری سبد…</div>
      </div>
    `;
    const res = await fetch(`${API_BASE}/cart`);
    if (!res.ok) throw new Error("Cart fetch failed");
    const cart = await res.json();
    renderCart(cart);
    updateBasketBadge();
  } catch (e) {
    console.error(e);
    cartWrapper.innerHTML = `
      <div class="text-center text-red-600 py-10">خطا در دریافت سبد خرید</div>
    `;
  }
}

function renderCart(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    cartWrapper.innerHTML = `
      <div class="text-center py-12">
        <p class="text-xl font-semibold text-gray-700 mb-2">سبد خرید خالی است</p>
        <a href="our-products.html" class="inline-block mt-3 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
          شروع خرید
        </a>
      </div>
    `;
    return;
  }

  const cards = cart
    .map(
      item => `
      <div class="rounded-xl bg-white shadow p-4 flex items-center gap-4" data-cart-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" class="w-24 h-24 object-cover rounded-lg" />
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-800">${item.title}</h3>
          <p class="text-gray-600 mt-1">قیمت واحد: ${fmt(item.price)} <span class="text-sm text-gray-500">هزار تومان</span></p>
          <div class="flex items-center gap-3 mt-3">
            <button class="btn-dec rounded-lg px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
            <span class="min-w-8 text-center font-medium">${item.count || 1}</span>
            <button class="btn-inc rounded-lg px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>

            <button class="btn-remove ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">
              حذف
            </button>
          </div>
        </div>
        <div class="text-left">
          <div class="text-sm text-gray-500 mb-1">قیمت کل آیتم</div>
          <div class="font-bold">${fmt(rials(item.price) * rials(item.count || 1))} <span class="text-sm font-normal">هزار تومان</span></div>
        </div>
      </div>
    `
    )
    .join("");

  const totalItems = cart.reduce((s, it) => s + (it.count || 1), 0);
  const totalPrice = cart.reduce((s, it) => s + rials(it.price) * rials(it.count || 1), 0);

  const summary = `
    <div class="rounded-xl bg-white shadow p-5 flex items-center justify-between">
      <div class="text-gray-700">
        <div>تعداد اقلام: <span class="font-semibold">${fmt(totalItems)}</span></div>
      </div>
      <div class="text-gray-800 text-lg">
        جمع نهایی: <span class="font-bold">${fmt(totalPrice)}</span> <span class="text-sm font-normal">هزار تومان</span>
      </div>
      <button class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
        ادامه خرید / تسویه
      </button>
    </div>
  `;

  cartWrapper.innerHTML = `
    <div class="space-y-4">${cards}</div>
    <div class="mt-6">${summary}</div>
  `;
}

// ===== اعمال تغییرات روی سرور =====
async function patchCount(cartId, newCount) {
  if (newCount < 1) {
    // اگر صفر شد، حذف کن
    return removeItem(cartId);
  }
  const res = await fetch(`${API_BASE}/cart/${cartId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: newCount })
  });
  if (!res.ok) throw new Error("PATCH failed");
}

async function removeItem(cartId) {
  const res = await fetch(`${API_BASE}/cart/${cartId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE failed");
}

// ===== رویدادها (Delegation) =====
cartWrapper.addEventListener("click", async (e) => {
  const card = e.target.closest("[data-cart-id]");
  if (!card) return;
  const cartId = card.getAttribute("data-cart-id");
  const countEl = card.querySelector("span.font-medium");
  const currentCount = Number(countEl?.textContent || 1);

  try {
    if (e.target.closest(".btn-inc")) {
      await patchCount(cartId, currentCount + 1);
      await fetchCart();
    } else if (e.target.closest(".btn-dec")) {
      await patchCount(cartId, currentCount - 1);
      await fetchCart();
    } else if (e.target.closest(".btn-remove")) {
      await removeItem(cartId);
      await fetchCart();
    }
  } catch (err) {
    console.error(err);
    alert("خطا در به‌روزرسانی سبد خرید");
  }
});

// ===== شروع =====
fetchCart();
