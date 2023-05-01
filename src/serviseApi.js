const KEY = "35870603-08ebb0a535266bd5a3f38c128";
const BASE_URL = 'https://pixabay.com/api/';

export default class HitsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
        this.totalPages = 0;
    }

    fetchHits() {
        const URL = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=${this.per_page}&page=${this.page}`;
        return fetch(URL)
            .then(responce => responce.json())
            .then(({ hits }) => {
                this.incrementPage();
                return hits;
            })
    }
    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    hasMoreImages() {
        return this.page === Math.ceil(this.totalPages / this.per_page);
    }
    resetTotalPage() {
        return (this.totalPages = 0);
    }
}

