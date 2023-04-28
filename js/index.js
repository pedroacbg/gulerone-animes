const searchForm = document.querySelector(".search");
const resultList = document.querySelector(".container__content");
const pagination = document.querySelector(".pagination");

const getInputValue = function (event) {
  event.preventDefault();
  const searchData = searchForm.search.value;
  fetchSearch(searchData);
  searchForm.search.value = "";
};

searchForm.addEventListener("submit", getInputValue);

const fetchSearch = async function (searchData) {
  const search = searchData.replaceAll(" ", "-").toLowerCase();
  const url = `https://api.jikan.moe/v4/anime?q=${search}&sfw`;
  try {
    const response = await fetch(url);
    const allData = await response.json();
    if (!allData.data.length !== 0) {
      showSearchResults(allData.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const showSearchResults = function (data) {
  resultList.innerHTML = "";
  data.forEach((item) => {
    const element = `
            <div class="container__content--box">
              <div class="container__content--item">
                <h3 class="content__container--title" data-id="${
                  item.mal_id
                }">${item.title}</h3>
                <img
                  src="${
                    item.images.jpg.image_url ? item.images.jpg.image_url : ""
                  }"
                  alt="Anime image"
                  class="container__content--img"
                />
              </div>
            </div>
    `;
    resultList.insertAdjacentHTML("beforeend", element);
  });
  pagination.classList.remove("u-hidden");
};
