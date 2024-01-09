import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js'
import { Ref, createRef, ref } from "lit/directives/ref.js";

import { keydownListener } from '../../src/listener.ts';
import { isStateValid } from "../../src/common.ts";

@customElement("hangul-textarea")
export class HandulTextareaElement extends LitElement {
  textareaRef: Ref<HTMLTextAreaElement> = createRef();

  @property({ type: Boolean }) enabled = true;

  render() {
    return html`
      <textarea autofocus @keydown=${this.keydown} ${ref(this.textareaRef)}></textarea>
    `;
  }

  keydown(e: KeyboardEvent) {
    if (e.altKey && e.code === "Space" && e.repeat === false) {
      e.preventDefault();

      // if disabling, unselect state
      if (this.enabled) {
        this.unselectState();
      }

      this.dispatchEvent(new CustomEvent("toggle-mode", { bubbles: true, composed: true }));
      return;
    }

    if (this.enabled) {
      keydownListener(e);
    }
  }

  unselectState() {
    if (isStateValid((this.textareaRef.value!.value.slice(this.textareaRef.value!.selectionStart, this.textareaRef.value!.selectionEnd)))) {
      this.textareaRef.value!.selectionStart = this.textareaRef.value!.selectionEnd;
    }
  }

  static styles = css`
    textarea {
      background-color: inherit;
      border: 0;
      box-sizing: border-box;
      color: inherit;
      font: inherit;
      outline: none;
      padding: 1em;
      resize: none;
      width: 100%;
      height: 100%;
    }
  `;
}
