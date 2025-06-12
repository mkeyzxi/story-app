import AuthPresenter from "../presenters/AuthPresenter.js";
import AuthModel from "../models/AuthModel.js";

export default class LoginView {
  constructor(container) {
    this.container = container;
    const model = new AuthModel();
    this.presenter = new AuthPresenter(this, model);
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="p-4 max-w-md mx-auto flex justify-center items-center flex-col h-screen" role="main" aria-labelledby="LoginTitle">
        <h2 id="loginTitle" class="text-2xl font-bold mb-4">Login</h2>
        <form id="loginForm" class="space-y-4 min-w-full flex flex-col" novalidate aria-describedby="errorMsg">
          <label for="email" class="block">
            Email
            </label>
            <input type="email" id="email" name="email" class="border p-2 w-full" required aria-required="true" aria-label="Masukkan email Anda" />
          <label for="password" class="block">
            Password
            </label>
            <input type="password" id="password" name="password" class="border p-2 w-full" required aria-required="true" aria-label="Masukkan kata sandi Anda" />
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" aria-label="Tombol login">Login</button>
          <p id="errorMsg" class="text-red-500 mt-2" role="alert" aria-live="assertive"></p>
        </form>
    `;

    document.querySelector("#email").focus();
    document.querySelector("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      this.presenter.login(email, password);
    });
  }

  onLoginSuccess(token) {
    const model = new AuthModel();
    model.saveToken(token);

    window.dispatchEvent(new Event("authChanged"));
    window.location.hash = "#/";
  }

  showError(message) {
    document.getElementById("errorMsg").textContent = message;
  }
}
