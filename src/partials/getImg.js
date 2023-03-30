import ImageService from './fetchImg';
import Notiflix from 'notiflix';

class Gallery {
  #refs = {};
  #searchQuery = null;
  #response = [];

  init() {
    this.#initRefs();
    this.#initListeners();
  }

  #initRefs() {
    this.#refs.searchForm = document.querySelector('.search-form');
    this.#refs.gallery = document.querySelector('.gallery');
    this.#refs.loadMore = document.querySelector('.load-more');
  }

  #initListeners() {
    this.#refs.searchForm.addEventListener('submit', this.#onSearch.bind(this));
    this.#refs.loadMore.addEventListener(
      'click',
      this.#onClickLoadMoreBtn.bind(this)
    );
    this.#refs.loadMore.classList.add('btn_hidden');
  }

  #onSearch(e) {
    e.preventDefault();
    this.#searchQuery = e.currentTarget.elements.searchQuery.value;

    ImageService.resetPage();
    this.#resetGallery();
    this.#fetchImg()
      .then(response => {
        if (response.hits.length === 0) {
          return Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        this.#updateImg(response);
      })
      .finally(() => {
        e.target.reset();
      });
  }

  #resetGallery() {
    this.#response = [];
    this.#refs.gallery.innerHTML = '';
  }

  #fetchImg() {
    return ImageService.fetchData(this.#searchQuery)
      .then(response => response)
      .catch(error => {
        console.error(error);
        Notiflix.Notify.failure('Something went wrong. Please try later');
      });
  }

  #loadMore() {
    ImageService.incrementPage();

    if (ImageService.page > ImageService.quantityPages) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      this.#refs.loadMore.classList.add('btn_hidden');
    }

    return this.#fetchImg().then(response => {
      this.#response = {
        ...this.#response,
        hits: [...this.#response.hits, ...response.hits],
      };
      this.#render(this.#response.hits);
      this.#toggleMoreButton();
    });
  }

  #onClickLoadMoreBtn() {
    // this.#refs.loadMore.classList.add('load-more__btn_loading');
    this.#refs.loadMore.disabled = true;

    this.#loadMore().finally(() => {
      // this.#refs.loadMore.classList.remove('load-more__btn_loading');
      this.#refs.loadMore.disabled = false;
    });
  }

  #updateImg(response) {
    this.#response = response;
    let arrays = this.#response.hits;
    this.#render(arrays);
    this.#toggleMoreButton();
  }

  #render(arrays) {
    let markup = arrays
      .map(
        hits => `
        <div class="photo-card">
          <img src="${hits.webformatURL}" alt="${hits.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <b>${hits.likes}</b>
            </p>
            <p class="info-item">
              <b>Views</b>
              <b>${hits.views}</b>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <b>${hits.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <b>${hits.downloads}</b>
            </p>
          </div>
        </div>
      `
      )
      .join();
    this.#refs.gallery.insertAdjacentHTML('beforeend', markup);
  }

  #toggleMoreButton() {
    if (
      this.#response.hits.length > 0 &&
      ImageService.page < ImageService.quantityPages
    ) {
      this.#refs.loadMore.classList.remove('btn_hidden');
    } else {
      this.#refs.loadMore.classList.add('btn_hidden');
    }
  }
}

const newGallery = new Gallery();
newGallery.init();
