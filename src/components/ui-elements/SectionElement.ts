export class SectionElement extends HTMLElement {
  constructor() {
    super();

    this.classList.add('section');

    if (this.hasAttribute('collapsed')) {
      this.collapseSection();
    }
  }

  public connectedCallback() {
    const elTitle = this.querySelector('.subtitle') as HTMLElement;

    // if we have a title - expand the section when it's clicked
    // TODO - also need to collapse other
    if (elTitle) {
      elTitle.addEventListener('click', this.expandSection.bind(this));
    }
  }

  public collapseSection() {
    this.classList.add('collapsed');
  }

  public expandSection() {
    this.classList.remove('collapsed');
  }
}

customElements.define('section-element', SectionElement);
