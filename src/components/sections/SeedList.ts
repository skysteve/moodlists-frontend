export class SeedList extends HTMLElement {

  constructor() {
    super();

    this.classList.add('section');

    const template = document.getElementById('section-seed-list') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);
  }

}

customElements.define('seed-list', SeedList);
