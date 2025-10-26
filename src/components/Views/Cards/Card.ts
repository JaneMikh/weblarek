import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types/index";
import { IEvents } from "../../base/Events";

export class Card<T extends IProduct> {
  protected _CDN_URL = CDN_URL;
  protected container: HTMLElement;
  protected events: IEvents;
  protected imageItem: HTMLImageElement | null;
  protected title: HTMLElement;
  protected category: HTMLSpanElement | null;
  protected price: HTMLSpanElement | null;
  protected cardIndex?: number;
  protected cardId?: string;

  constructor(container: HTMLElement, events: IEvents){
    this.container = container;
    this.events = events;

    //Поиск элементов в DOM
    this.category = ensureElement<HTMLSpanElement>('.card__category', container);
    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.imageItem = ensureElement<HTMLImageElement>('.card__image', container);
    this.price = ensureElement<HTMLSpanElement>('.card__price', container);
  }

  set image(src: string) {
    const srcProtocol = src.startsWith("http")
      ? src
      : `${this._CDN_URL}/${src.replace(/\.[^/.]+$/, ".png")}`;

    this.setImage(
      this.imageItem,
      srcProtocol,
      this.title.textContent || ''
    );
  }

  protected setImage(img: HTMLImageElement, src: string, alt: string) {
    img.src = src;
    img.alt = alt;
  }

  private setCategory(card: T): HTMLElement {
    const categoryItem = categoryMap[card.category];
    if (categoryItem) {
      this.category.className = `card__category ${categoryItem}`;
    }
    this.category.textContent = card.category;
    return this.category;
  }
    
  setData(card: T, index?: number) {
    this.title.textContent = card.title;
    this.price.textContent = card.price === null ? 'Бесценно' : `${card.price} синапсов`;
    this.cardId = card.id;
    this.image = card.image;
    this.cardIndex = index;

    //Или проще
    /*this.image.src = CDN_URL + '' + data.image;
    this.image.alt = data.title;*/
    
    this.setCategory(card);
  }

  render(): HTMLElement {
    return this.container;
  }
}
