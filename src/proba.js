import HitsApiService from "./serviseApi";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from "./load-more-btn";



const searchForm = document.querySelector('#search-form')

const galleryContainer = document.querySelector('.gallery')

const hitsApiService = new HitsApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});






searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', fetchHits)

function onSubmit(evt) {
    evt.preventDefault();
    clearContainer();

    hitsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    if (hitsApiService.query === "") {
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    loadMoreBtn.show();

    fetchHits()
    //const lightbox = new SimpleLightbox('.gallery a');
    //lightbox.refresh();
}


function fetchHits() {
    loadMoreBtn.disabled();
    hitsApiService.fetchHits()
        .then(hits => {
            insertImages(hits);
            loadMoreBtn.enable();
        })
}


const createImages = (image) => `
<div class="photo-card">
    <a class="gallery-link" href="${image.largeImageURL}">
       <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="100" />
    </a>
</div>
`;
const generateImages = (array) => array?.reduce((acc, item) => acc + createImages(item), "");
const insertImages = (array) => {
    const result = generateImages(array);
    galleryContainer.insertAdjacentHTML("beforeend", result);
}

const clearContainer = () => {
    galleryContainer.innerHTML = '';
}


