import AuthPresenter from "../presenters/AuthPresenter.js";
import AuthModel from "../models/AuthModel.js";

export default class RegisterView {
  constructor(container) {
    this.container = container;
    const model = new AuthModel();
    this.presenter = new AuthPresenter(this, model);
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="p-4 max-w-md mx-auto flex justify-center items-center flex-col h-screen" role="main" aria-labelledby="registerTitle">
        <h2 class="text-2xl font-bold mb-4">Register</h2>
        <form id="registerForm" class="space-y-4 flex flex-col min-w-full" aria-describedby="errorMsg">
          <label for="name">Nama</label>
            
            <input type="text" id="name" name="name"  class="border p-2 w-full" required />
          
          <label for="email">
            Email
            </label>
            <input type="email" id="email" name="email"  class="border p-2 w-full" required />
          <label for="password">
            Password
            </label>
            <input type="password" name="password" id="password" class="border p-2 w-full" required />
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-4">Daftar</button>
          <p id="errorMsg" class="text-red-500 mt-2"></p>
        </form>
      </section>
    `;
    document.querySelector("#name").focus();
    document.querySelector("#registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      this.presenter.register(name, email, password);
    });
  }

  onRegisterSuccess() {
    alert("Registrasi berhasil! Silakan login.");
    window.location.hash = "#/login";
  }

  showError(message) {
    document.getElementById("errorMsg").textContent = message;
  }
}
