fetch("http://localhost:3000/categories")
  .then((res) => res.json())
  .then((data) => {
    const categoriesWrapper = document.querySelector(".category");

    data.map((category) => {
      categoriesWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div 
          class="relative w-full h-[250px] hover:scale-105 duration-200 cursor-pointer category-item" 
          data-category-name="${category.url}">
            <img class="w-full h-full object-cover rounded-lg" src="${category.img}" alt="${category.categotyTitle}">
            <p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl bg-sky-200 backdrop-opacity-5 w-1/4 text-center p-2 rounded-lg text-xl">
                ${category.categotyTitle}
            </p>
        </div>
        `
      );
    });

    document.querySelectorAll(".category-item").forEach(item => {
      item.addEventListener("click", () => {
        const categoryName = item.dataset.categoryName;
        window.location.href = `singleCategory.html?categoryName=${encodeURIComponent(categoryName)}`;
      });
    });
  });
