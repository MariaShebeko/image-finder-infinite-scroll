import refs from "./js/refs";
import photoCardTemplate from "./templates/photoCard.hbs";
import PhotoAPIService from "./js/apiService";
import { myNotice, myError } from "./js/pnotify";
const basicLightbox = require("basiclightbox");
import "./css/basicLightbox.min.css";
import "./css/styles.css";

const photosAPIService = new PhotoAPIService();

refs.searchForm.addEventListener("submit", onSearch);
refs.galleryContainer.addEventListener("click", onImageClick);

function onSearch(e) {
  e.preventDefault();
  clearGalleryContainer();
  photosAPIService.query = e.currentTarget.elements.query.value;

  if (photosAPIService.query === "") {
    return myNotice();
  }
  photosAPIService.resetPage();
  fetchPhotos();
  clearInput(e);
}

function fetchPhotos() {
  photosAPIService.fetchPhotos().then(appendPhotosMarkup);
}

function appendPhotosMarkup(data) {
  if (data.length === 0) {
    return myError();
  }

  refs.galleryContainer.insertAdjacentHTML(
    "beforeend",
    photoCardTemplate(data)
  );
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = "";
}

function clearInput(e) {
  e.currentTarget.elements.query.value = "";
}

function onImageClick(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }
  const instance = basicLightbox.create(
    `<img src="${e.target.dataset.src}" width="800" height="600">`
  );
  instance.show();
}

const onEntry = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && photosAPIService.searchQuery !== "") {
      fetchPhotos();
    }
  });
};
const options = {
  rootMargin: "100px",
};
const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.sentinel);
