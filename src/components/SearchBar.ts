export class SearchBar extends HTMLInputElement {
  constructor() {
    super();
    console.log('hi');
    this.addEventListener('keypress', this.onKeypress.bind(this));
  }

  private onKeypress(event) {
    console.log(event);
  }
}
