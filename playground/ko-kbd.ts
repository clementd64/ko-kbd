import { LitElement, html, css } from "lit";
import { customElement, state } from 'lit/decorators.js'

@customElement("ko-kbd")
export class KoKbdElement extends LitElement {
  @state() enabled = true;

  render() {
    return html`
      <header-bar ?enabled=${this.enabled}></header-bar>
      <hangul-textarea ?enabled=${this.enabled} @toggle-mode=${this.toogleMode}></hangul-textarea>
    `;
  }

  toogleMode() {
    this.enabled = !this.enabled;
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
    }
  `;
}
