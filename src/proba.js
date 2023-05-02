import HitsApiService from './serviseApi';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.search-form button')
const delimiter = document.querySelector('.delimiter');
const spinner = document.querySelector('.spinner');


const slider = new SimpleLightbox('.gallery a')



const serviceApi = new HitsApiService;
let query = '';

const intersectionObserver = new IntersectionObserver(onEndOfScroll);
intersectionObserver.observe(delimiter);

form.addEventListener('submit', onSearch);

async function onSearch(evt) {
    evt.preventDefault();
    query = form.searchQuery.value.trim();
    if (query === '' || query === serviceApi.searchQuery) return;

    button.disabled = true;
    clearContainer();
    await renderPage();
    button.disabled = false;
}
const clearContainer = () => {
    gallery.innerHTML = '';
}
async function renderPage() {
    try {
        spinner.classList.remove('hidden');
        const srcData = await serviceApi.getData(query);
        const srcElement = srcData.data.hits;

        if (srcElement.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        if (serviceApi.isNewSearch) {
            Notiflix.Notify.info(`Hooray! We found ${srcData.data.totalHits} images.`);
        }

        insertImages(srcElement)

        slider.refresh()
    }
    catch (error) {
        Notiflix.Notify.failure('error')
    }
    finally {
        spinner.classList.add('hidden')
    }
}

const createImages = (image) => `
      <a class="slide-wrapper" href="${image.largeImageURL}">
        <div class="photo-card">
          <div class="image">
            <img src="${image.webformatURL}" alt="Tags: ${image.tags}" loading="lazy"/>
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${image.downloads}
            </p>
          </div>
        </div>
      </a>   
`;
const generateImages = (array) => array?.reduce((acc, item) => acc + createImages(item), "");
const insertImages = (array) => {
    const result = generateImages(array);
    gallery.insertAdjacentHTML("beforeend", result);
}

function onEndOfScroll(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && query !== '' && query === serviceApi.lastSearch) {
            if (!serviceApi.isEndOfPages) renderPage();

            else Notify.warning("We're sorry, but you've reached the end of search results.");
        }
    });
}

