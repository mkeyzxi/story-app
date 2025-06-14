export class HeaderView {
  constructor(rootElement) {
    this.root = rootElement;
  }

  render(isAuthenticated) {
    this.root.innerHTML = `
      <header class="bg-blue-600 text-white p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <a 
            href="#main-content"
            class="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-white focus:text-blue-600 focus:p-2 focus:rounded focus:shadow-lg focus:z-50"
          >
            Skip to content
          </a>
          <h1 class="text-lg font-bold">
            <a href="#/">Dicoding Story</a>
          </h1>
          <nav class="space-x-4">
            <button id="toggleNotifBtn" class="hover:bg-blue-500 p-2 rounded-md">Aktifkan Notifikasi</button>
            ${
              isAuthenticated
                ? `
                <a href="#/" class="hover:bg-blue-500 p-2 rounded-md">Cerita</a>
                <a href="#/add" class="hover:bg-blue-500 p-2 rounded-md">Tambah Cerita</a>
                <button id="logoutBtn" class="hover:bg-blue-500 p-2 rounded-md">Logout</button>
              `
                : `
                <a href="#/login" class="hover:bg-blue-500 p-2 rounded-md">Login</a>
                <a href="#/register" class="hover:bg-blue-500 p-2 rounded-md">Register</a>
              `
            }
          </nav>
        </div>
      </header>
    `;
  }

  bindLogout(handler) {
    const logoutBtn = this.root.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handler();
      });
    }
  }

  bindSkipLink() {
    const skipLink = this.root.querySelector(".skip-link");
    const mainContent = document.querySelector("#main-content");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        skipLink.blur();
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  notifyAuthChanged() {
    window.dispatchEvent(new Event("authChanged"));
  }

  bindNotificationToggle(handler) {
    const toggleBtn = this.root.querySelector("#toggleNotifBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        handler();
      });
    }
  }

  updateNotifButtonState(isEnabled) {
    const btn = this.root.querySelector("#toggleNotifBtn");
    if (btn) {
      btn.textContent = isEnabled ? "Nonaktifkan Notifikasi" : "Aktifkan Notifikasi";
    }
  }
}

export default HeaderView;
