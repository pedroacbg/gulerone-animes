const searchForm = document.querySelector(".search");
const resultList = document.querySelector(".container__content");
const resultContainer = document.querySelector(".container__search--selection");
const pagination = document.querySelector(".pagination");
const pageTitle = document.querySelector(".nav__content--title");
const animePageContainer = document.querySelector(".container__anime");
const errorContainer = document.querySelector(".error__box");
const menu = document.querySelector(".menu");
const navContentList = document.querySelector(".nav__content--list");
const loading = document.querySelector(".loading");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageNumber = document.querySelector(".page--number");

let allData;
let currentSearchInput;
let pageSize = 12;
let currentPage = 1;

menu.addEventListener("click", function () {
  menu.classList.toggle("active");
  searchForm.classList.toggle("active");
  navContentList.classList.toggle("active");
  loading.classList.toggle("active");
});

pageTitle.addEventListener("click", function () {
  pagination.classList.add("u-hidden");
  resultContainer.classList.add("u-hidden");
  animePageContainer.classList.add("u-hidden");
  loading.classList.remove("u-hidden");
});

const getInputValue = function (event) {
  event.preventDefault();
  const searchData = searchForm.search.value;
  const search = searchData.replaceAll(" ", "-").toLowerCase();
  fetchSearch(search);
  currentSearchInput = search;
  searchForm.search.value = "";
  menu.classList.remove("active");
  searchForm.classList.remove("active");
  navContentList.classList.remove("active");
  loading.classList.add("u-hidden");
  animePageContainer.classList.add("u-hidden");
  pagination.classList.add("u-hidden");
};

searchForm.addEventListener("submit", getInputValue);

const fetchSearch = async function (search) {
  const url = `https://api.jikan.moe/v4/anime?q=${search}&sfw`;
  try {
    const response = await fetch(url);
    allData = await response.json();
    if (!allData.data.length <= 0) {
      showSearchResults(allData.data);
      errorContainer.classList.add("u-hidden");
      animePageContainer.classList.add("u-hidden");
      return allData.data;
    }
    if (allData.data.length === 0) {
      showError();
      pagination.classList.add("u-hidden");
      resultContainer.classList.add("u-hidden");
    }
  } catch (error) {
    console.error(error);
  }
};

const showSearchResults = function (data, page = 1) {
  if (page == 1) {
    prevButton.style.visibility = "hidden";
  } else {
    prevButton.style.visibility = "visible";
  }

  if (page == numPages()) {
    nextButton.style.visibility = "hidden";
    prevButton.style.visibility = "visible";
  } else {
    nextButton.style.visibility = "visible";
  }

  resultList.innerHTML = "";

  data
    .filter((item, index) => {
      let start = (currentPage - 1) * pageSize;
      let finish = currentPage * pageSize;

      if (index >= start && index < finish) return true;
    })
    .forEach((item) => {
      const element = `
            <div class="container__content--box" >
              <div class="container__content--item" data-id="${item.mal_id}">
                <h3 class="content__container--title" >${item.title}</h3>
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
  resultContainer.classList.remove("u-hidden");
};

const previousPage = function () {
  if (currentPage > 1) {
    currentPage--;
    pageNumber.textContent = `Page ${currentPage}`;
    showSearchResults(allData.data, currentPage);
  }
};

const nextPage = function () {
  if (currentPage * pageSize < allData.data.length) {
    currentPage++;
    pageNumber.textContent = `Page ${currentPage}`;
    showSearchResults(allData.data, currentPage);
  }
};

function numPages() {
  return Math.ceil(allData.data.length / pageSize);
}

prevButton.addEventListener("click", previousPage, false);
nextButton.addEventListener("click", nextPage, false);

const showError = function () {
  errorContainer.classList.remove("u-hidden");
};

resultList.addEventListener("click", function (event) {
  const element = event.target;
  const closest = element.closest(".container__content--item");
  const searchId = closest.dataset.id;
  const data = allData.data.find((x) => x.mal_id === +searchId);
  showAnimeDetails(data);
});

const showAnimeDetails = function (data) {
  animePageContainer.classList.remove("u-hidden");
  animePageContainer.innerHTML = "";
  const element = `
            <button class="return--btn">
              <i class="fa-solid fa-rotate-left fa-4x"></i>
            </button>
            <div class="u-center-text">
              <h2 class="container__anime--name">${data.title}</h2>
            </div>
            <div class="container__anime--content">
              <div class="container__anime--left">
                <img
                  src="${data.images.jpg.large_image_url}"
                  alt="Anime poster"
                  class="container__anime--img"
                />
                <div class="container__anime--titles">
                  <h2 class="container__anime--titles-heading">
                    Alternative Titles
                  </h2>
                  <h3 class="container__anime--english">
                    English: <span> ${data.title_english} </span>
                  </h3>
                  <h3 class="container__anime--japanese">
                    Japanese: <span> ${data.title_japanese} </span>
                  </h3>
                </div>
                <div class="container__anime--information">
                  <h2 class="container__anime--information-heading">
                    Information
                  </h2>
                  <h3>Episodes: <span> ${data.episodes}</span></h3>
                  <h3>Source: <span> ${data.source}</span></h3>
                  <h3>Genre: <span> ${data.genres[0]?.name} </span></h3>
                  <h3>Aired: <span> ${data.aired.string} </span></h3>
                  <h3>Duration: <span> ${data.duration} </span></h3>
                  <h3>Year: <span> ${data.year} </span></h3>
                </div>
                <div class="container__anime--stats">
                  <h2 class="container__anime--stats-heading">Stats</h2>
                  <h3 class="container__anime--stats-rank">
                    Ranked: <span> #${data.rank}</span>
                  </h3>
                  <h3 class="container__anime--stats-popularity">
                    Popularity: <span> #${data.popularity} </span>
                  </h3>
                  <h3 class="container__anime--stats-favorites">
                    Favorites: <span> ${data.favorites} </span>
                  </h3>
                </div>
              </div>
              <div class="container__anime--right">
                <div class="container__anime--right-grid">
                  <div class="container__anime--right-primary">
                    <div class="content-box">
                      <h2 class="container__anime--synopsis-heading">Synopsis</h2>
                      <h3 class="container__anime--synopsis-text">
                        ${data.synopsis.slice(
                          0,
                          data.synopsis.lastIndexOf(".") + 1
                        )}
                      </h3>
                      <h2 class="container__anime--trailer-heading">${
                        data.trailer.images.image_url
                          ? "Trailer"
                          : "Anime Image & More Info"
                      }</h2>
                        <a
                          href="${
                            data.trailer.url ? data.trailer.url : data.url
                          }"
                          target="_blank"
                        >
                          <img 
                            src="../img/myanimelist.png" 
                            alt="MyAnimeList logo" class="${
                              data.trailer.url ? "u-hidden" : "u-myanimelist"
                            }"/>
                          <img
                            src="${
                              data.trailer.images.maximum_image_url
                                ? data.trailer.images.maximum_image_url
                                : data.images.jpg.large_image_url
                            }"
                            alt="Trailer Image"
                            class="${
                              data.trailer.url
                                ? "trailer--img"
                                : "u-trailer-img"
                            }"
                        />
                        </a>
                    </div>
                  </div>
                  <div class="container__anime--right-secondary">
                    <div class="rating">
                      <h2 class="rating--heading">Score</h2>
                      <i class="fa-solid fa-star fa-4x"></i>
                      <h3 class="rating--text">${data.score}</h3>
                    </div>
                    <div class="container__anime--more">
                      <h2 class="container__anime--more-heading">More Information</h2>
                      <h3 class="u-padding-top">Scored by: <span> ${
                        data.scored_by
                      } members</span></h3>
                      <h3>Members: <span> ${data.members} users</span></h3>
                      <h3>Season: <span> ${data.season} users</span></h3>
                      <h3>Broadcast: <span> ${data.broadcast.string}</span></h3>
                      <h3>Studio: <span> ${data.studios[0]?.name} </span></h3>
                      <h3>Rating: <span> ${data.rating} </span></h3>
                      <h3>Type: <span> ${data.type} </span></h3>
                      <h3>Theme: <span> ${data.themes[0]?.name} </span></h3>
                      <h3>Demographic: <span> ${
                        data.demographics[0]?.name
                      } </span></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  `;

  animePageContainer.insertAdjacentHTML("afterbegin", element);

  const returnButton = document.querySelector(".return--btn");
  returnButton.addEventListener("click", returnButtonHandler);

  pagination.classList.add("u-hidden");
  resultContainer.classList.add("u-hidden");
  loading.classList.add("u-hidden");
};

const returnButtonHandler = function () {
  fetchSearch(currentSearchInput);
};
