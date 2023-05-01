import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "35870603-08ebb0a535266bd5a3f38c128";
const BASE_URL = 'https://pixabay.com/api/';

const formEl = document.querySelector('#search-form');
const inputEl = formEl.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const addBtn = document.querySelector(`.load-more`);

let acc = "";
let page = 2;
let per_page = 40;

formEl.addEventListener('submit', onSearch);

function createGalleryMarkup(images) {
    return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
          <a class="photo-ref" href="${largeImageURL}">
            <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${downloads}
            </p>
          </div>
        </div>
      `;
    })
        .join('');
}

async function onSearch(event) {
    event.preventDefault();
    const searchQuery = inputEl.value.trim();
    page = 2;
    if (searchQuery === '') {
        return;
    }
    acc = inputEl.value;
    inputEl.value = ""
    const params = new URLSearchParams({
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    });

    try {
        const response = await axios.get(`${BASE_URL}?${params}&page=1&per_page=40`);
        const hits = response.data.hits;

        if (hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            addBtn.style.display = "none";
            galleryEl.innerHTML = "";
            return
        }
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`)
        galleryEl.innerHTML = '';
        addBtn.style.display = "block";
        if (response.data.totalHits < 40) {
            addBtn.style.display = "none"
        }
        const markup = createGalleryMarkup(hits);
        galleryEl.innerHTML = markup;
        const lightbox = new SimpleLightbox('.gallery a');
    } catch (error) {
        console.log(error);
    }
    const lightbox = new SimpleLightbox('.gallery a');
}

async function loadMore() {
    addBtn.disabled = true;

    const params = new URLSearchParams({
        key: API_KEY,
        q: acc,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    });

    try {
        const response = await axios.get(`${BASE_URL}?${params}&page=${page}&per_page=${per_page}`);
        page += 1;
        const hits = response.data.hits;


        const markup = createGalleryMarkup(hits);
        galleryEl.innerHTML += markup;
        addBtn.disabled = false;
        // const lightbox = new SimpleLightbox('.gallery a');
        if (response.data.totalHits < (page - 1) * per_page) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            addBtn.style.display = "none";
            return
        }
    } catch (error) {
        console.log(error);
    }

    const lightbox = new SimpleLightbox('.gallery a');
}
addBtn.addEventListener("click", loadMore)
