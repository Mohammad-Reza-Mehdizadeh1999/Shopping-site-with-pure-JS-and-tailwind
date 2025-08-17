fetch("http://localhost:3000/branches")
  .then((res) => res.json())
  .then((data) => {
    const branchesWrapper = document.querySelector(".branch-wrapper");
        
    data.map((branch) => {
      branchesWrapper.insertAdjacentHTML(
        "beforeend",
        `
          <div class="bg-sky-200 shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-15">
            <img src="${branch.img}" alt="شعبه " class="w-full md:w-1/4 rounded-lg shadow-sm">
            <div>
              <h3 class="text-2xl font-semibold text-gray-800 mb-2">${branch.title}</h3>
              <p class="text-gray-700 mb-2">آدرس: ${branch.address}</p>
              <p class="text-gray-700 mb-2">ساعات کاری: ${branch.workingHour}</p>
              <p class="text-gray-700"> تلفن: ${branch.phone}</p>
            </div>
          </div>
        `
      );
    });
  });

