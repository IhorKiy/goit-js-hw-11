import axios from 'axios';
import Notiflix from 'notiflix';

const KEY = '34669214-e080ea2af1c664bb939ebc002';
const BASE_URL = `https://pixabay.com/api/?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

class ImageService {
  imgQuantity = 40;
  page = 1;
  quantityPages = null;

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  async fetchData(searchQuery) {
    try {
      const response = await axios.get(
        `${BASE_URL}&page=${this.page}&q=${searchQuery}&per_page=${this.imgQuantity}`
      );

      this.quantityPages = response.data.totalHits / this.imgQuantity;

      return response.data;
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure('Something went wrong. Please try later.');
    }
  }
}

export default new ImageService();
