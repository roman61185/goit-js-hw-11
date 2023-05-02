export default class LoadMoreBtn {
    constructor({ selector, hidden = false }) {
        this.refs = this.getRefs(selector);
        hidden && this.hide();
    }

    getRefs(selector) {
        const refs = {}
        refs.button = document.querySelector(selector);
        refs.label = refs.button.querySelector('.label');
        refs.spinner = refs.button.querySelector('.spinner');

        return refs;
    }

    enable() {
        this.refs.button.disabled = false;
        this.refs.label.textContent = 'показать еще';
        this.refs.spinner.classList.add('is-hidden');
    }
    disabled() {
        this.refs.button.disabled = true;
        this.refs.label.textContent = 'загружаем...';
        this.refs.spinner.classList.remove('is-hidden');
    }

    show() {
        this.refs.button.classList.remove('is-hidden');
    }

    hide() {
        this.refs.button.classList.add('is-hidden');
    }
}