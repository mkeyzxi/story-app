import ApiService from "../services/ApiService.js";

export default class AuthModel {
  async login(email, password) {
    return ApiService.login({ email, password });
  }

  async register(name, email, password) {
    return ApiService.register({ name, email, password });
  }

  saveToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
} 
