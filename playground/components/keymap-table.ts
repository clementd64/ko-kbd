import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js'

const mapping = {
  "consonants": {
      hangul: ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],
      key:    ["g","G","n","d","D","r/l","m","b","B","s","S","-/ng","j","J","ch","k","t","p","h"],
  },
  "vowels": {
      hangul: ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"],
      key:    ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"],
  }
}

@customElement("keymap-table")
export class KeymapTableElement extends LitElement {
  @property() type: "consonants"|"vowels" = "consonants";

  render() {
    return html`
      <table>
        <tbody>
          <tr>
            <th scope="row">Hangul</th>
            ${mapping[this.type].hangul.map((hangul) => html`<td>${hangul}</td>`)}
          </tr>

          <tr>
            <th scope="row">Key(s)</th>
            ${mapping[this.type].key.map((hangul) => html`<td>${hangul}</td>`)}
          </tr>
        </tbody>
      </table>
    `;
  }

  static styles = css`
    table {
      border-collapse: collapse;
      text-align: center;
      width: 100%;
    }
    
    td, th {
      padding: .2em .4em;
      border: 1px solid var(--text-color);
    }

    th {
      background-color: var(--header-color);
    }
  `;
}
