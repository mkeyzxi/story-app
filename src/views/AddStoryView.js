import AddStoryPresenter from "../presenters/AddStoryPresenter.js";

export default class AddStoryView {
  constructor(container) {
    this.container = container;
    this.presenter = new AddStoryPresenter(this);
    this.stream = null;

    window.addEventListener("hashchange", () => this.stopCamera());
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <form id="storyForm" class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-5" aria-labelledby="formTitle" novalidate>
        <h2 id="formTitle" class="sr-only">Form Tambah Cerita</h2>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea id="description" required rows="4" class="w-full border border-gray-300 rounded-md p-2" aria-required="true" aria-describedby="descHelp"></textarea>
          <div id="descHelp" class="sr-only">Masukkan deskripsi cerita minimal 10 kata.</div>
        </div>

        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
          <input 
            type="file" 
            id="photo" 
            accept="image/*" 
            capture="environment" 
            class="mb-2 bg-gray-500 text-white px-3 py-1 w-full" 
            aria-describedby="photoHelp"
            aria-label="Upload atau ambil gambar cerita" 
          />
          <div id="photoHelp" class="sr-only">Anda dapat memilih file gambar atau menggunakan kamera untuk mengambil foto.</div>

          <div class="flex gap-2">
            <button 
              type="button" 
              id="openCameraBtn" 
              class="bg-blue-500 text-white px-4 py-1 rounded" 
              aria-controls="cameraContainer" 
              aria-expanded="false"
              aria-label="Buka kamera untuk mengambil gambar"
            >Buka Kamera</button>

            <button 
              type="button" 
              id="closeCameraBtn" 
              class="bg-gray-500 text-white px-4 py-1 rounded hidden" 
              aria-controls="cameraContainer"
              aria-expanded="true"
              aria-label="Tutup kamera"
            >Tutup Kamera</button>
          </div>

          <div 
            class="mt-2 hidden" 
            id="cameraContainer" 
            role="region" 
            aria-live="polite" 
            aria-label="Pratinjau kamera dan kontrol pengambilan gambar"
          >
            <video id="cameraPreview" autoplay playsinline class="w-full rounded object-contain" aria-label="Tampilan kamera"></video>
            <button 
              type="button" 
              id="captureBtn" 
              class="mt-2 bg-green-600 text-white px-4 py-1 rounded" 
              aria-label="Ambil gambar dari kamera"
            >Ambil Gambar</button>
            <canvas id="cameraCanvas" class="hidden mt-2 w-full" aria-hidden="true"></canvas>
          </div>
        </div>

        <div>
          <label for="map" class="block text-sm font-medium text-gray-700 mb-1">Pilih Lokasi (klik peta)</label>
          <div id="map" class="w-full h-64 rounded border border-gray-300" role="application" aria-label="Peta digital untuk memilih lokasi"></div>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 rounded"
          aria-label="Kirim cerita"
        >Kirim</button>
      </form>
    `;

    const openBtn = document.getElementById("openCameraBtn");
    const closeBtn = document.getElementById("closeCameraBtn");
    const cameraContainer = document.getElementById("cameraContainer");

    openBtn.addEventListener("click", () => this.openCamera());
    closeBtn.addEventListener("click", () => this.stopCamera());

    document.querySelector("#storyForm").addEventListener("submit", (e) =>
      this.presenter.handleFormSubmit(e),
    );
    document.querySelector("#captureBtn").addEventListener("click", () =>
      this.presenter.capturePhoto(),
    );

    this.presenter.initMap();
  }

  async openCamera() {
    try {
      if (this.stream) return;
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.setVideoStream(this.stream);
      this.showCameraUI();
    } catch (err) {
      this.showAlert("Gagal membuka kamera: " + err.message);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.hideCameraUI();
  }

  async getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err),
      );
    });
  }

  getFormData() {
    return {
      description: document.getElementById("description").value,
      photo: document.getElementById("photo").files[0],
    };
  }

  showAlert(msg) {
    alert(msg);
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  redirectToHome() {
    window.location.hash = "#/";
  }

  showCameraUI() {
    document.getElementById("cameraContainer").classList.remove("hidden");
    document.getElementById("closeCameraBtn").classList.remove("hidden");
    document.getElementById("openCameraBtn").setAttribute("aria-expanded", "true");
  }

  hideCameraUI() {
    document.getElementById("cameraContainer").classList.add("hidden");
    document.getElementById("closeCameraBtn").classList.add("hidden");
    document.getElementById("openCameraBtn").setAttribute("aria-expanded", "false");
  }

  setVideoStream(stream) {
    document.getElementById("cameraPreview").srcObject = stream;
  }

  captureToCanvas() {
    const video = document.getElementById("cameraPreview");
    const canvas = document.getElementById("cameraCanvas");
    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);
    canvas.classList.remove("hidden");
  }

  canvasToBlob() {
    return new Promise((resolve) => {
      const canvas = document.getElementById("cameraCanvas");
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }
}
