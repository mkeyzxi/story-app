import HomeView from "../views/HomeView.js";
import AddStoryView from "../views/AddStoryView.js";
import LoginView from "../views/LoginView.js";
import RegisterView from "../views/RegisterView.js";

export default class Router {
  constructor(container) {
    this.container = container;
    window.addEventListener("hashchange", () => this.render());
    window.addEventListener("load", () => this.render());
  }

  async render() {
    const hash = window.location.hash;
    const container = this.container;

    const loadView = async () => {
      if (hash.startsWith("#/detail/")) {
        const id = hash.split("/")[2];
        const module = await import("../components/Detail.js");
        new module.default(container, id);
        return;
      }

      const routes = {
        "": HomeView,
        "#/": HomeView,
        "#/add": AddStoryView,
        "#/login": LoginView,
        "#/register": RegisterView,
      };

      const ViewClass = routes[hash] || HomeView;
      new ViewClass(container);
    };

    // 🌈 Gunakan View Transitions API jika tersedia
    if (document.startViewTransition) {
      document.startViewTransition(() => loadView());
    } else {
      // 🚪 Fallback biasa
      await loadView();
    }
  }
}
