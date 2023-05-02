import HitsApiService from './serviseApi';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.search-form button')
const delimiter = document.querySelector('.delimiter');
const spinner = document.querySelector('.spinner');

// const slider = new SimpleLightbox('.slide-wrapper', {
//     overlayOpacity: 0.9,
//     showCounter: false,
//     captionsData: 'alt',
//     captionDelay: 150,
// });
const slider = new SimpleLightbox('.gallery a')


const serviceApi = new HitsApiService;
let query = '';

const intersectionObserver = new IntersectionObserver(onEndOfScroll);
intersectionObserver.observe(delimiter);

form.addEventListener('submit', onSearch);

async function onSearch(evt) {
    evt.preventDefault();
    query = form.searchQuery.value.trim();
    if (query === '' || query === serviceApi.searchQuery) {
        return;
    }
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















// function createGalleryMarkup(images) {
//     return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//         return `
//         <div class="photo-card">
//           <a class="photo-ref" href="${largeImageURL}">
//             <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
//           </a>
//           <div class="info">
//             <p class="info-item">
//               <b>Likes:</b> ${likes}
//             </p>
//             <p class="info-item">
//               <b>Views:</b> ${views}
//             </p>
//             <p class="info-item">
//               <b>Comments:</b> ${comments}
//             </p>
//             <p class="info-item">
//               <b>Downloads:</b> ${downloads}
//             </p>
//           </div>
//         </div>
//       `;
//     })
//         .join('');
// }

// async function onSearch(event) {
//     event.preventDefault();
//     const searchQuery = inputEl.value.trim();
//     page = 2;
//     if (searchQuery === '') {
//         return;
//     }
//     acc = inputEl.value;
//     inputEl.value = ""
//     const params = new URLSearchParams({
//         key: API_KEY,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//     });

//     try {
//         const response = await axios.get(`${BASE_URL}?${params}&page=1&per_page=40`);
//         const hits = response.data.hits;

//         if (hits.length === 0) {
//             Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//             addBtn.style.display = "none";
//             galleryEl.innerHTML = "";
//             return
//         }
//         Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`)
//         galleryEl.innerHTML = '';
//         addBtn.style.display = "block";
//         if (response.data.totalHits < 40) {
//             addBtn.style.display = "none"
//         }
//         const markup = createGalleryMarkup(hits);
//         galleryEl.innerHTML = markup;
//         const lightbox = new SimpleLightbox('.gallery a');
//     } catch (error) {
//         console.log(error);
//     }
//     const lightbox = new SimpleLightbox('.gallery a');
// }

// async function loadMore() {
//     addBtn.disabled = true;

//     const params = new URLSearchParams({
//         key: API_KEY,
//         q: acc,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//     });

//     try {
//         const response = await axios.get(`${BASE_URL}?${params}&page=${page}&per_page=${per_page}`);
//         page += 1;
//         const hits = response.data.hits;


//         const markup = createGalleryMarkup(hits);
//         galleryEl.innerHTML += markup;
//         addBtn.disabled = false;
//         // const lightbox = new SimpleLightbox('.gallery a');
//         if (response.data.totalHits < (page - 1) * per_page) {
//             Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//             addBtn.style.display = "none";
//             return
//         }
//     } catch (error) {
//         console.log(error);
//     }

//     const lightbox = new SimpleLightbox('.gallery a');
// }
// addBtn.addEventListener("click", loadMore)
