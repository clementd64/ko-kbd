import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js'
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { classMap } from 'lit/directives/class-map.js';

import { icons } from "../icons";

@customElement("icon-button")
export class IconButtonElement extends LitElement {
  @property() icon = "";
  @property({ type: Boolean }) rounded = false;

  render() {
    return html`
      <button class=${classMap({ rounded: this.rounded })}>
        ${unsafeSVG(icons[this.icon])}
      </button>
    `;
  }

  static styles = css`
    button {
      background-color: var(--background, var(--background-color));
      border: 0;
      outline: none;
      border-radius: var(--rounded-radius);
      line-height: 0;
      padding: 0.3rem;
      fill: var(--text-color);
    }

    button:hover {
      background-color: var(--background-hover, var(--header-color));
    }

    .rounded {
      border-radius: 50%;
    }
  `;
}
