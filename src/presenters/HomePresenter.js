
import StoryModel from "../models/StoryModel.js";

import IndexedDBService from "../services/IndexedDBService.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async init() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token tidak ditemukan. Redirect ke login...");
      this.view.redirectToLogin();
      return;
    }

    try {
      const { listStory } = await this.model.getAllStories(token);
      this.view.renderStories(listStory);

     
     
     

    } catch (error) {
      console.error("Gagal mengambil cerita dari API, coba load dari IndexedDB:", error);
     
      const offlineStories = await IndexedDBService.getAllStories();
      if (offlineStories.length > 0) {
        this.view.showAlert("Gagal terhubung ke server. Menampilkan cerita dari penyimpanan offline.");
        this.view.renderStories(offlineStories);
      } else {
        this.view.showAlert("Gagal memuat cerita. Periksa koneksi internet Anda atau coba lagi nanti.");
      }
    }
  }
}