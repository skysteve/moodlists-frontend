
const template = document.createElement('template');
// TODO - I don't like the stylesheet here, it's messy
template.innerHTML = `
<link rel="stylesheet" href="/css/index.css" />
<label class="label"></label>
<div class="control is-expanded">
  <slot name="input"></slot>
</div>
`;

export class FieldGroup extends HTMLElement {

  constructor() {
    super();
    this.classList.add('field');
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    (shadowRoot.querySelector('.label') as HTMLLabelElement).textContent = this.getAttribute('label');
  }

}

customElements.define('field-group', FieldGroup);
