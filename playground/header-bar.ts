import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, Ref } from "lit/directives/ref.js";

import { ModalElement } from "./components/modal.ts";

@customElement("header-bar")
export class HeaderBarElement extends LitElement {
  helpModalRef: Ref<ModalElement> = createRef();
  keymapModalRef: Ref<ModalElement> = createRef();

  @property({ type: Boolean }) enabled = true;

  render() {
    return html`
      <header>
        <div class="status ${classMap({ enabled: this.enabled })}">한</div>
        <div></div>
        <icon-button icon="keyboard" @click=${this.clickKeymap}></icon-button>
        <icon-button icon="help" @click=${this.clickHelp}></icon-button>
      </header>

      <x-modal header="Help" ${ref(this.helpModalRef)}>
        <p>Write hangul using transcription rules from the Revised Romanization.</p>
        <p>No distinction between initial and final are made. <code>ㄱ</code> is always <code>g</code></p>
        <p>Tense consonants are writed with uppercase. <code>ㄲ</code> is <code>G</code></p>

        <h3>Usage</h3>
        <p>Press <kbd>Alt</kbd>+<kbd>Space</kbd> to switch between hangul mode and normal mode (your standard keyboard)</p>
        <p>When hangul mode is enabled, <code>한</code> in the header is showed <span class="blue">blue</span></p>
      </x-modal>

      <x-modal header="Keymap" ${ref(this.keymapModalRef)}>
        <h4>Consonants</h4>
        <keymap-table type="consonants"></keymap-table>

        <h4>Vowels</h4>
        <keymap-table type="vowels"></keymap-table>
      </x-modal>
    `;
  }

  private clickHelp() {
    this.helpModalRef.value?.open();
  }

  private clickKeymap() {
    this.keymapModalRef.value?.open();
  }

  static styles = css`
    header {
      background-color: var(--header-color);
      display: grid;
      grid-template-columns: auto 1fr auto auto;
    }

    .status {
      font-size: 1.2em;
      font-weight: bold;
      padding: 0.5em;
    }

    .status.enabled {
      background-color: var(--enabled-color);
      color: var(--enabled-text-color);
    }

    icon-button {
      margin: 0.5em;
      --background: var(--header-color);
      --background-hover: var(--background-color);
    }

    kbd, code {
      background-color: var(--header-color);
      padding: .2em .4em;
      border-radius: var(--rounded-radius);
    }

    .blue {
      background-color: var(--enabled-color);
      color: var(--enabled-text-color);
      padding: .2em .4em;
      border-radius: var(--rounded-radius);
    }
  `;
}
