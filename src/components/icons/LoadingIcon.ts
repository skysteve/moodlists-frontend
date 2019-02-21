export class LoadingIcon extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById('loading-icon') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);
  }
}
