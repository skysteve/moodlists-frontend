
const template = document.createElement('template');
template.innerHTML = `
<figure class="image is-48x48">
  <img class="is-rounded"/>
</figure>
`;

export class ArtistImageElement extends HTMLElement {
  constructor(srcUrl: string) {
    super();
    this.classList.add('artist-image');
    const elTemplate = template.content.cloneNode(true) as HTMLElement;
    this.appendChild(elTemplate);

    if (!srcUrl) {
      srcUrl = this.getAttribute('src') as string;
    }

    if (srcUrl && srcUrl !== 'undefined') {
      (this.querySelector('img') as HTMLImageElement).setAttribute('src', srcUrl);
    }
  }
}

customElements.define('artist-image', ArtistImageElement);
