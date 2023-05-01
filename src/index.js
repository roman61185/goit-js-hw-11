import HitsApiService from "./serviseApi";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from "./load-more-btn";


const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const hitsApiService = new HitsApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', fetchHits);

function onSubmit(evt) {
    evt.preventDefault();
    clearContainer();

    hitsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    if (hitsApiService.query === "") {
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
    const lightbox = new SimpleLightbox('.gallery a');

    loadMoreBtn.show();
    fetchHits()
}


function fetchHits() {
    loadMoreBtn.disabled();
    hitsApiService.fetchHits()
        .then(hits => {
            insertImages(hits);
            loadMoreBtn.enable();
        })
}

const clearContainer = () => {
    galleryContainer.innerHTML = '';
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
    galleryContainer.insertAdjacentHTML("beforeend", result);
}








// const form = document.querySelector('#search-form')
// const input = form.querySelector('input[name="searchQuery"]')
// const submit = form.querySelector('button[type="submit"]')
// const gallery = document.querySelector('.gallery')
// const btn = document.querySelector('.load-more')
// const counter = document.querySelector('.counter')
// const totalPages = document.querySelector('.total-pages')
// const KEY = "35870603-08ebb0a535266bd5a3f38c128";
// let currentPage = 1;

// const updateData = (data) => {
//     counter.textContent = `всего:${data?.totalHits}`;
//     gallery.innerHTML = "";
//     totalPages.textContent = `страниц:${Math.ceil(data?.totalHits / data.hits.length)}`;
// };
// const createUrl = () => {
//     const search = input.value;
//     const url = `https://pixabay.com/api/?key=${KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
//     return url
// };

// const handleSubmit = (evt) => {
//     evt.preventDefault();
//     const url = createUrl();

//     fetch(url)
//         .then((response) => response.json())
//         .then((data) => {
//             // if (url === "") {
//             //     btn.classList.add("hide");
//             // }
//             if (evt.type === "submit") {
//                 updateData(data);
//             }
//             insertImages(data.hits);
//             currentPage += 1;
//             if (currentPage > data?.totalHits) {
//                 btn.classList.add("hide");
//                 Notiflix.Notify.info('Cogito ergo sum');
//             }
//         })
//         .catch((error) => {
//             console.log(error)
//         })
//     // .finally(() => {
//     //     currentPage += 1;
//     // })
// };
// form.addEventListener("submit", handleSubmit);
// btn.addEventListener("click", handleSubmit);


// //если чтото приходит віводим если нет пустой рядок
// // <b>Likes${image.likes ? image.likes : ""}</b>
// // <b>Likes${image.likes ?? ""}</b> или так
// //с катинками
// //  ${image.webformatURL ? `<img src="${image.webformatURL}"
// //  alt = "${image.tags}" loading = "lazy" width = "200" />` : ""}
// const createImages = (image) => `
// <div class="photo-card">
//     <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="200" />
//     <div class="info">
//         <p class="info-item">
//             <b>Likes${image.likes}</b>
//         </p>
//         <p class="info-item">
//             <b>Views${image.views}</b>
//         </p>
//         <p class="info-item">
//             <b>Comments${image.comments}</b>
//         </p>
//         <p class="info-item">
//             <b>Downloads${image.downloads}</b>
//         </p>
//     </div>
// </div>
// `;
// //? если масив прийдет
// const generateImages = (array) => array?.reduce((acc, item) => acc + createImages(item), "");
// const insertImages = (array) => {
//     const result = generateImages(array);
//     gallery.insertAdjacentHTML("beforeend", result);
// }

// // const lightbox = new SimpleLightbox('.gallery a', {
// //     captionsData: "alt",
// //     captionPosition: 'bottom',
// //     captionDelay: 1000,
// // })






