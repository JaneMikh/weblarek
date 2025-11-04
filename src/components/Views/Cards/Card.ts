import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { TCard } from "../../../types/index";
import { categoryMap } from "../../../utils/constants";

export class Card<T> extends Component<TCard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLSpanElement | null;

  constructor(container: HTMLElement){
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}

type CategoryKey = keyof typeof categoryMap;

export abstract class CardCatalogModal<T={}> extends Card<TCard & T> {
  protected imageElement: HTMLImageElement | null;
  protected categoryElement: HTMLSpanElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
  }
  
  get title() {
    return this.titleElement.textContent;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }
 
  set image(src: string) {
    this.setImage(this.imageElement, src, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}
