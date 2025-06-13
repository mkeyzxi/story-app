import StoryModel from "../models/StoryModel.js";
import {
  getAllStoriesOffline,
  saveStoryOffline,
} from "../services/IndexedDBService.js";

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

      // Simpan ke IndexedDB satu per satu
      for (const story of listStory) {
        await saveStoryOffline(story);
      }

    } catch (error) {
      console.error("Gagal mengambil cerita dari API, coba load dari IndexedDB:", error);
      const offlineStories = await getAllStoriesOffline();
      this.view.renderStories(offlineStories);
    }
  }
}
