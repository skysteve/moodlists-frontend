
export class AbstractModal extends HTMLElement {
  constructor() {
    super();

    this.classList.add('modal', 'is-active');
    const elBackground = this.renderBackground();
    const elHeader = this.renderHeader();

    const elContentWrapper = document.createElement('div');
    elContentWrapper.classList.add('modal-card');

    const elModalBody = document.createElement('section');
    elModalBody.classList.add('modal-card-body');
    elModalBody.appendChild(this.renderContent());

    elContentWrapper.appendChild(elHeader);
    elContentWrapper.appendChild(elModalBody);

    this.appendChild(elBackground);
    this.appendChild(elContentWrapper);
  }

  public closeModal(): void {
    (this.parentElement as HTMLElement).removeChild(this);
  }

  protected renderContent(): DocumentFragment {
    return document.createDocumentFragment();
  }

  protected get title(): string {
    return '';
  }

  private renderHeader(): HTMLElement {
    const elHeader = document.createElement('header');
    elHeader.classList.add('modal-card-head');

    const elTitle = document.createElement('p');
    elTitle.classList.add('modal-card-title');
    elTitle.textContent = this.title;

    const elBtn = this.renderCloseBtn();

    elHeader.appendChild(elTitle);
    elHeader.appendChild(elBtn);

    return elHeader;
  }

  private renderBackground(): HTMLElement {
    const elDiv = document.createElement('div');
    elDiv.classList.add('modal-background');
    return elDiv;
  }

  private renderCloseBtn(): HTMLElement {
    const elBtn = document.createElement('button');
    elBtn.classList.add('delete');
    elBtn.setAttribute('aria-label', 'close');
    elBtn.textContent = 'x';
    elBtn.addEventListener('click', this.closeModal.bind(this));
    return elBtn;
  }
}
