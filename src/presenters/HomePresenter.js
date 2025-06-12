import StoryModel from "../models/StoryModel.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async init() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token tidak ditemukan. Redirect ke login...");
      window.location.hash = "#/login";
      return;
    }

    try {
      const { listStory } = await this.model.getAllStories(token);
      this.view.renderStories(listStory);
    } catch (error) {
      console.error("Gagal mengambil cerita:", error);
      this.view.renderStories([]);
    }
  }
}
