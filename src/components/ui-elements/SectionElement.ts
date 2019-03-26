const template = document.createElement('template');
template.innerHTML = /*html*/`<header class="card-header">
<p class="card-header-title">
  <slot name="title"></slot>
</p>
<a href="#" class="card-header-icon" aria-label="more options">
  <span class="icon">
    <i class="icon-caret" aria-hidden="true"></i>
  </span>
</a>
</header>
<div class="card-content">
    <div class="content section-content">
      <slot name="content"></slot>
    </div>
</div>`;

export class SectionElement extends HTMLElement {
  constructor() {
    super();

    this.classList.add('card');
    const clone = document.importNode(template.content, true);

    const elTitle = (clone.querySelector('.card-header-title') as HTMLParagraphElement);
    elTitle.textContent = this.cardTitle;
    (clone.querySelector('.card-header') as HTMLDivElement).addEventListener('click', this.toggleCollapse.bind(this));
    (clone.querySelector('.section-content') as HTMLDivElement).appendChild(this.content);

    this.appendChild(clone);

    if (this.hasAttribute('collapsed')) {
      this.collapseSection();
    }
  }

  public collapseSection() {
    this.classList.add('collapsed');
  }

  public toggleCollapse() {
    if (this.canExpand) {
      this.classList.toggle('collapsed');
    }
  }

  protected get cardTitle(): string {
    return '';
  }

  protected get content(): DocumentFragment {
    return new DocumentFragment();
  }

  protected get canExpand(): boolean {
    // expandable if there are selected artists
    return !!document.querySelector('.selected-artist-list-item');
  }
}

customElements.define('section-element', SectionElement);
