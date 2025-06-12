import Router from "./router/Router.js";
import "./components/Header.js";
import "./components/Footer.js";
document.addEventListener("DOMContentLoaded", () => {
  new Router(document.querySelector("#app"));
});
