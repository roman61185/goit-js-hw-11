const KEY = "35870603-08ebb0a535266bd5a3f38c128";
function fetchGallery(foto) {
    return fetch(`https://pixabay.com/api/?key=${KEY}q`)
        .then((response) => response.json())

}

export default { fetchGallery }