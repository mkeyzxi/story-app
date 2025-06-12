import AuthModel from "../models/AuthModel.js";

export class HeaderPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthModel();

    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindSkipLink();

    window.addEventListener("authChanged", () => {
      this.render();
    });

    this.render();
  }

  handleLogout() {
    this.model.removeToken();
    this.view.notifyAuthChanged();
    this.view.redirectToLogin();
  }

  render() {
    const isAuthenticated = this.model.isAuthenticated();
    this.view.render(isAuthenticated);
    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindSkipLink();
  }
}

