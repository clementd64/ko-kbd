import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js'
import { Ref, createRef, ref } from "lit/directives/ref.js";

@customElement("x-modal")
export class ModalElement extends LitElement {
  dialogRef: Ref<HTMLDialogElement> = createRef();

  @property() header = "";

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} @click=${this.clickModal}>
        <div class="container">
          <div class="header">
            <h2>${this.header}</h2>
            <icon-button icon="close" ?rounded=${true} @click=${this.close}></icon-button>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </dialog>
    `;
  }

  public open() {
    this.dialogRef.value?.showModal();
  }

  public close() {
    this.dialogRef.value?.close();
  }

  private clickModal(e: MouseEvent) {
    if (e.target === this.dialogRef.value) {
      this.close();
    }
  }

  static styles = css`
    dialog {
      border: none;
      border-radius: 5px;
      outline: none;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
      min-width: 30%;
      max-width: 75%;
    }

    @media (max-width:480px) {
      dialog {
        max-width: 95%;
      }
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, .50);
    }

    .container {
      padding: 1em;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: start;
    }

    .header h2 {
      flex-grow: 1;
    }

    .content {
      overflow: auto;
    }

    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.3rem;
      margin-top: 0.6rem;
    }
  `;
}
