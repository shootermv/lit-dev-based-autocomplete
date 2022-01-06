import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('results-list')
export class ResultsList extends LitElement {
  static override styles = css`
   .highlighted{ 
      color: red;
   }
   li:active{ 
      background-color: red;
      color: white;
   }     
  `;
 
  @property()
  listItems: any[] = [];

  @property()
  term: string = '';

  override render() {
    return html`
        <ul>
        ${this.listItems.map((item, idx) =>
          html`
            <li class=${item.highlighted ? 'highlighted' : ''} @click=${() => {
                if (!item.highlighted){
                  this.listItems = this.listItems.map((itm, _idx) => {
                     return  {...itm, highlighted: idx === _idx }
                  })
                }
                console.log('--you selected--', item.text);
                this.dispatchEvent(new CustomEvent('result', {
                    bubbles: true,
                    composed: true
                }))
            }}>
            ${item.text.split(this.term)[0]}<b>${this.term}</b> ${item.text.split(this.term)[1]}
            </li>`
        )}
      </ul>`;
  }
}
