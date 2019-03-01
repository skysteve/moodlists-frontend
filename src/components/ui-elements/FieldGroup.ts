
const template = document.createElement('template');
template.innerHTML = `
<label class="label"></label>
<div class="control is-expanded">
  <slot name="input"></slot>
</div>
`;

export class FieldGroup extends HTMLElement {

  constructor() {
    super();
    this.classList.add('field');

    // TODO - I don't like this, but for now it works
    const elTemplate = template.content.cloneNode(true) as HTMLElement;
    (elTemplate.querySelector('.control') as HTMLDivElement).innerHTML = this.innerHTML;
    this.innerHTML = '';
    // const shadowRoot = this.attachShadow({mode: 'open'});
    this.appendChild(elTemplate);
    (this.querySelector('.label') as HTMLLabelElement).textContent = this.getAttribute('label');
  }

}

customElements.define('field-group', FieldGroup);
