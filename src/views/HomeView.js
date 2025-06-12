import HomePresenter from "../presenters/HomePresenter.js";

export default class HomeView {
  constructor(container) {
    this.container = container;
    this.presenter = new HomePresenter(this);
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section aria-label="Daftar cerita" id="storyList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"></section>
    `;
    this.presenter.init();
  }

  renderStories(stories) {
    const storyList = this.container.querySelector("#storyList");
    storyList.innerHTML = "";

    stories.forEach((story) => {
      const card = this.createStoryCard(story);
      storyList.appendChild(card);
    });
  }

  createStoryCard(story) {
    const article = document.createElement("article");
    article.className =
      "bg-white p-4 rounded shadow hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400";
    article.setAttribute("tabindex", "0");
    article.setAttribute("role", "link");
    article.setAttribute("aria-label", `Lihat detail cerita oleh ${story.name}`);

    // gambar dengan alt dan figure semantik
    const figure = document.createElement("figure");
    figure.className = "mb-2";

    const image = document.createElement("img");
    image.src = story.photoUrl;
    image.alt = `Foto dari cerita oleh ${story.name}`;
    image.className = "w-full h-48 object-cover rounded";

    const caption = document.createElement("figcaption");
    caption.className = "sr-only";
    caption.textContent = `Foto cerita oleh ${story.name}`;

    figure.appendChild(image);
    figure.appendChild(caption);

    // judul deskripsi cerita (aksesibel dengan keyboard)
    const description = document.createElement("h2");
    description.className = "text-gray-800 font-semibold text-lg mb-1";
    description.textContent = story.description;
    description.setAttribute("tabindex", "0");

    // penulis
    const author = document.createElement("p");
    author.className = "text-sm text-gray-500";
    author.textContent = `Oleh: ${story.name}`;

    article.appendChild(figure);
    article.appendChild(description);
    article.appendChild(author);

    // aksesibilitas navigasi keyboard (tekan enter)
    article.addEventListener("click", () => {
      window.location.hash = `#/detail/${story.id}`;
    });

    article.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.location.hash = `#/detail/${story.id}`;
      }
    });

    return article;
  }

  showAlert(message) {
    alert(message);
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }
}
