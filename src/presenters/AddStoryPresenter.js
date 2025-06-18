import StoryModel from "../models/StoryModel.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.capturedFromCamera = false;
    this.selectedCoords = null;
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const token = this.model.getToken();
    if (!token) {
      this.view.showAlert("Anda belum login!");
      // view yang tangani kamera
      this.view.stopCamera();
      this.view.redirectToLogin();
      return;
    }

    const { description, photo } = this.view.getFormData();
    const formData = new FormData();
    formData.append("description", description);

    let imageBlob;

    if (this.capturedFromCamera) {
      imageBlob = await this.view.canvasToBlob();
      formData.append("photo", imageBlob, "captured.jpg");
    } else if (photo && photo.size > 0) {
      if (photo.size > 1000000) {
        this.view.showAlert("Ukuran gambar terlalu besar! Maksimal 1MB.");
        return;
      }
      formData.append("photo", photo);
    } else {
      this.view.showAlert("Silakan unggah atau ambil gambar terlebih dahulu!");
      return;
    }

    try {
      const coords = this.selectedCoords || (await this.view.getUserLocation());
      if (coords) {
        formData.append("lat", coords.lat);
        formData.append("lon", coords.lon);
      }
    } catch (error) {
      console.warn("Gagal mengambil lokasi:", error.message);
    }

    try {
      const result = await this.model.addNewStory(formData, token);
      if (!result.error) {
        this.view.showAlert("Cerita berhasil dikirim!");
        this.view.stopCamera();
        this.view.redirectToHome();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      this.view.showAlert(`Error: ${error.message}`);
    }
  }

  capturePhoto() {
    this.view.captureToCanvas();
    this.capturedFromCamera = true;
    this.view.stopCamera();
  }

  initMap() {
    const map = L.map("map").setView([-6.2, 106.816666], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.selectedCoords = { lat, lon: lng };

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  }
}
