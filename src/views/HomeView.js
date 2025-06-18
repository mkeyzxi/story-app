import HomePresenter from "../presenters/HomePresenter.js";
import IndexedDBService from "../services/IndexedDBService.js";
import "../components/StoryItem.js";

export default class HomeView {
  constructor(container) {
    this.container = container;
    this.presenter = new HomePresenter(this);
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <main id="main-content" class="container mx-auto py-8">
        <h1 class="text-3xl font-bold text-center mb-6">Cerita Terbaru</h1>
        <section aria-label="Daftar cerita" id="storyList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4"></section>
      </main>
    `;
    this.presenter.init();
  }

  renderStories(stories) {
    const storyList = this.container.querySelector("#storyList");
    storyList.innerHTML = "";

    if (stories.length === 0) {
      storyList.innerHTML =
        '<p class="text-center text-gray-500 col-span-full">Tidak ada cerita untuk ditampilkan.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyItemElement = document.createElement("story-item");

      storyItemElement.setStory(story, async (storyToSave) => {
        try {
          await IndexedDBService.addStory(storyToSave);
        } catch (error) {
          console.error("Gagal menyimpan story ke IndexedDB:", error);
          this.showAlert("Gagal menyimpan cerita: " + error.message);
        }
      });
      storyList.appendChild(storyItemElement);
    });
  }

  showAlert(message) {
    alert(message);
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }
}
