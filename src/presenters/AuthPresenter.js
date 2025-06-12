export default class AuthPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async login(email, password) {
    try {
      const result = await this.model.login(email, password);
      if (result.error) throw new Error(result.message);

      this.view.onLoginSuccess(result.loginResult.token);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async register(name, email, password) {
    try {
      const result = await this.model.register(name, email, password);
      if (result.error) throw new Error(result.message);

      this.view.onRegisterSuccess();
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
