
const template = document.createElement('template');

template.innerHTML = /*html*/`
  <div class="thumb-wrapper">
    <div class="inverse-left"></div>
    <div class="inverse-right"></div>
    <div class="range"></div>
    <span class="thumb thumb-min"></span>
    <span class="thumb thumb-max"></span>
  </div>
  <input class="range-min range-input" type="range"  max="100" min="0" step="1"/>
  <input class="range-max range-input" type="range" max="100" min="0" step="1"/>
  `;


export class RangeSliderElement extends HTMLElement {
  private min: number;
  private max: number;

  constructor() {
    super();

    const elTemplate = template.content.cloneNode(true);
    this.appendChild(elTemplate);

    this.min = Number(this.getAttribute('min')) || 0;
    this.max = Number(this.getAttribute('max')) || 100;

    this.elRange.style.left = `${this.min}%`;
    this.elRange.style.right = `${100 - this.max}%`;

    this.elThumbMin.style.left = `${this.min}%`;
    this.elThumbMax.style.left = `${this.max}%`;

    this.elRangeMin.value = this.min.toString();
    this.elRangeMax.value = this.max.toString();

    this.elRangeMin.addEventListener('input', this.onMinChange.bind(this));
    this.elRangeMax.addEventListener('input', this.onMaxChange.bind(this));
  }

  public get name(): string | null {
    return this.getAttribute('name');
  }

  public get range() {
    return {
      min: this.min,
      max: this.max
    };
  }

  private onMinChange(): boolean {
    this.min = Number(this.elRangeMin.value);

    if (this.min < 0 || this.min >= this.max) {
      return false;
    }

    this.elRange.style.left = `${this.min}%`;
    this.elThumbMin.style.left = `${this.min}%`;

    return true;
  }

  private onMaxChange(): boolean {
    this.max = Number(this.elRangeMax.value);

    if (this.max > 100 || this.max <= this.min) {
      return false;
    }

    this.elRange.style.right = `${100 - this.max}%`;
    this.elThumbMax.style.left = `${this.max}%`;

    return true;
  }

  private get elRange(): HTMLDivElement {
    return this.querySelector('.range') as HTMLDivElement;
  }

  private get elThumbMax(): HTMLSpanElement {
    return this.querySelector('.thumb-max') as HTMLSpanElement;
  }

  private get elThumbMin(): HTMLSpanElement {
    return this.querySelector('.thumb-min') as HTMLSpanElement;
  }

  private get elRangeMin(): HTMLInputElement {
    return this.querySelector('.range-min') as HTMLInputElement;
  }

  private get elRangeMax(): HTMLInputElement {
    return this.querySelector('.range-max') as HTMLInputElement;
  }
}

customElements.define('range-slider', RangeSliderElement);
