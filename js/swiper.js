fetch("http://localhost:3000/popular")
  .then((response) => response.json())
  .then((data) => {
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    data.map((product) => {
      swiperWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div class="swiper-slide rounded-lg shadow-xl p-4">
          <img
            class="rounded-lg w-4/5 mx-auto"
            src=${product.img}
            alt="bag"
          />
          <p class="font-semibold text-xl py-4 pr-5">
            ${product.productTitle}
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

let swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
