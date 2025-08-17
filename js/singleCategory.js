const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get("categoryName");

fetch(`http://localhost:3000/${categoryName}`)
  .then(res => res.json())
  .then(products => {    

    const productsWrapper = document.querySelector(".category");


    products.forEach(product => {
      productsWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div class="rounded-lg shadow-xl p-4">
          <img
            class="rounded-lg w-4/5 mx-auto"
            src=${product.img}
            alt="bag"
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
              class="bg-green-400 p-3 rounded-lg cursor-pointer hover:bg-green-500"
            >
              اضافه کردن به سبد خرید
            </button>
            <button
              class="bg-sky-400 p-3 rounded-lg cursor-pointer hover:bg-sky-500"
            >
              مشاهده بیشتر...
            </button>
          </div>
        </div>
        `
      );
    });
  });

const titleMap = {
  "coat-shomiz": "کت و شومیز",
  "shalvar": "شلوار",
  "bag": "کیف",
  "shoe": "کفش",
  "pirahan": "پیراهن",
  "tshirt": "تیشرت",
};

const label = titleMap[categoryName];

document.querySelectorAll(".crumb-category").forEach(el => {
  el.textContent = label;
});