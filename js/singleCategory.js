// ------- تنظیمات پایه -------
const API_BASE = "http://localhost:3000";

const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get("categoryName"); // مثل coat-shomiz

let allProducts = []; // لیست محصولات لودشده‌ی همین دسته
const productsWrapper = document.querySelector(".category");
const basketBadge = document.querySelector(".basket-number"); // عنصر نمایش تعداد سبد

// ------- کمکـی: به‌روزرسانی عدد سبد -------
async function updateBasketBadge() {
  if (!basketBadge) return;
  try {
    const res = await fetch(`${API_BASE}/cart`);
    const cart = await res.json();
    const totalCount = cart.reduce((sum, item) => sum + (item.count || 1), 0);
    basketBadge.textContent = String(totalCount);
  } catch (e) {
    console.error("خطا در دریافت سبد:", e);
  }
}

// ------- دریافت محصولات دسته -------
fetch(`${API_BASE}/${categoryName}`)
  .then(res => {
    if (!res.ok) throw new Error("خطا در دریافت محصولات");
    return res.json();
  })
  .then(products => {    
    allProducts = products;
    renderProducts(products);
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    // در بارگذاری اولیه، عدد سبد را آپدیت کن
    updateBasketBadge();
  });

// ------- رندر محصولات -------
function renderProducts(products) {
  if (!productsWrapper) return;
  productsWrapper.innerHTML = "";

  products.forEach(product => {
    productsWrapper.insertAdjacentHTML(
      "beforeend",
      `
      <div class="rounded-lg shadow-xl p-4">
        <img
          class="rounded-lg w-4/5 mx-auto"
          src="${product.img}"
          alt="${product.title}"
        />
        <p class="font-semibold text-xl py-4 pr-5">
          ${product.title}
        </p>
        <p class="pb-1 pr-5">
          ${product.description}
        </p>
        <p class="text-left text-gray-600 text-lg pl-3">${product.price} هزار تومان</p>
        <div class="flex justify-around items-center py-4">
          <button
            class="bg-green-400 p-3 rounded-lg cursor-pointer hover:bg-green-500 add-to-cart"
            data-id="${product.id}"
            data-category="${product.category}"
          >
            اضافه کردن به سبد خرید
          </button>
        </div>
      </div>
      `
    );
  });
}

// ------- افزودن به سبد خرید -------
async function addToCart(productId, category) {
  try {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
      console.warn("محصول پیدا نشد:", productId);
      return;
    }

    // بررسی وجود
    const checkRes = await fetch(`${API_BASE}/cart?productId=${encodeURIComponent(productId)}`);
    if (!checkRes.ok) throw new Error("خطا در بررسی سبد خرید");
    const existed = await checkRes.json();

    if (existed.length > 0) {
      // افزایش تعداد
      const item = existed[0];
      const newCount = (item.count || 1) + 1;

      const patchRes = await fetch(`${API_BASE}/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: newCount })
      });
      if (!patchRes.ok) throw new Error("خطا در بروزرسانی تعداد سبد خرید");
    } else {
      // ایجاد آیتم جدید
      const cartItem = {
        productId,
        category,
        title: product.title,
        price: product.price,
        img: product.img,
        count: 1
      };

      const postRes = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });
      if (!postRes.ok) throw new Error("خطا در افزودن به سبد خرید");
    }

    // بعد از موفقیت، عدد سبد را به‌روز کن
    updateBasketBadge();

  } catch (err) {
    console.error(err);
    alert("خطا در افزودن به سبد خرید");
  }
}

// ------- Event Delegation برای دکمه‌های "افزودن به سبد" -------
if (productsWrapper) {
  productsWrapper.addEventListener("click", e => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const productId = btn.dataset.id;
    const category = btn.dataset.category;
    addToCart(productId, category);
  });
}

// ------- عنوان و breadcrumb -------
const titleMap = {
  "coat-shomiz": "کت و شومیز",
  "shalvar": "شلوار",
  "bag": "کیف",
  "shoe": "کفش",
  "pirahan": "پیراهن",
  "tshirt": "تیشرت",
};

const label = titleMap[categoryName] || categoryName || "";
document.querySelectorAll(".crumb-category").forEach(el => {
  el.textContent = label;
});

// ------- فیلتر دکمه‌های جنسیت -------
const buttons = document.querySelectorAll(".gender-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("bg-sky-300"));
    btn.classList.add("bg-sky-300");

    const selectedGender = btn.dataset.gender; // all | male | female
    const filtered = selectedGender === "all"
      ? allProducts
      : allProducts.filter(p => p.gender === selectedGender);

    renderProducts(filtered);
    // Delegation داریم؛ نیازی به بایند دوباره نیست
  });
});
