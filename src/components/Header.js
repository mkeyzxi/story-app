import { HeaderView } from "../views/HeaderView.js";
import { HeaderPresenter } from "../presenters/HeaderPresenter.js";

export default class HeaderCustom extends HTMLElement {
  connectedCallback() {
    this.view = new HeaderView(this);
    this.presenter = new HeaderPresenter(this.view);
  }
}

customElements.define("header-custom", HeaderCustom);
