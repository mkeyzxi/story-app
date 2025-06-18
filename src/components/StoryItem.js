class StoryItem extends HTMLElement {
  constructor() {
    super();
    this._story = null;
    this._onSaveCallback = null;
  }

  setStory(story, onSaveCallback) {
    this._story = story;
    this._onSaveCallback = onSaveCallback;
    this.render();
    this._addEventListeners();
  }

  render() {
    if (!this._story) {
      this.innerHTML = "<p>Story data is missing.</p>";
      return;
    }

    this.innerHTML = `
      <article class="story-card-container border rounded-lg overflow-hidden shadow bg-white p-4 cursor-pointer">
        <img src="${this._story.photoUrl}" alt="Story by ${this._story.name}" class="w-full h-48 object-cover rounded-md mb-3" />
        <div class="story-info">
        <p class="text-sm text-gray-600 mb-3">${this._story.description}</p>
        <h2 class="font-semibold text-lg text-gray-800 mb-1">${this._story.name}</h2>
          <button class="save-story-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Simpan Story
          </button>
        </div>
      </article>
    `;
    this._updateButtonState();
  }

  _addEventListeners() {
    const saveButton = this.querySelector(".save-story-btn");
    const cardContainer = this.querySelector(".story-card-container");

    if (saveButton) {
      saveButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        if (this._onSaveCallback) {
          await this._onSaveCallback(this._story);
          alert(`Story "${this._story.name}" berhasil disimpan!`);
          this._updateButtonState();
        }
      });
    }

    if (cardContainer) {
      cardContainer.addEventListener("click", () => {
        window.location.hash = `#/detail/${this._story.id}`;
      });

      cardContainer.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          window.location.hash = `#/detail/${this._story.id}`;
        }
      });
    }
  }

  async _updateButtonState() {
    const IndexedDBService = (await import("../services/IndexedDBService.js"))
      .default;
    const savedStory = await IndexedDBService.getStoryById(this._story.id);
    const saveButton = this.querySelector(".save-story-btn");

    if (saveButton) {
      if (savedStory) {
        saveButton.textContent = "Tersimpan";
        saveButton.disabled = true;
        saveButton.classList.remove("bg-blue-500", "hover:bg-blue-600");
        saveButton.classList.add("bg-gray-400", "cursor-not-allowed");
      } else {
        saveButton.textContent = "Simpan Story";
        saveButton.disabled = false;
        saveButton.classList.add("bg-blue-500", "hover:bg-blue-600");
        saveButton.classList.remove("bg-gray-400", "cursor-not-allowed");
      }
    }
  }
}

customElements.define("story-item", StoryItem);
