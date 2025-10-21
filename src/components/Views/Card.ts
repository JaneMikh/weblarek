import { categoryMap } from "../../utils/constants";
import { IProduct } from "../../types/index";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from '../base/Events';

export interface ICardViewData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class Card extends Component<ICardViewData> {
  private image: HTMLImageElement | null;
  private title: HTMLElement;
  private category: HTMLElement;
  private price: HTMLElement;
  private id: string;

  constructor(container: HTMLElement, protected events: IEvents, protected data: IProduct){
    super(container);
    this.events = events;
    this.data = data;
    this.category = ensureElement<HTMLElement>('.card__category', this.container);
    this.title = ensureElement<HTMLElement>('.card__title', this.container);
    this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.price = ensureElement<HTMLElement>('.card__price', this.container);

    this.setSelectedCardEvents();
  }

  private findCategory(value: string): HTMLElement {
    this.category.textContent = value;
    this.toggleClass(this.category, categoryMap[value], true); 
    return this.category;
  }
  //Улавливаем событие клика по карточке и передаем потом его в обработчик
  setSelectedCardEvents() {
    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.data.id });
      console.log(this.data.id);
    });
  }

  render(data: IProduct): HTMLElement {
    this.title.textContent = data.title;
    this.image.src = CDN_URL + '' + data.image;
    this.image.alt = data.title;
    this.price.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;

    this.findCategory(data.category);

    return this.container;
  }

}












/*type TProductId = Pick<IProduct, 'id'>;

export class Card extends Component<IProduct> {
  image: HTMLImageElement | null;
  title: HTMLElement;
  category: HTMLElement;
  price: HTMLElement;
  events: IEvents;
  cardId: string;

  constructor(container: HTMLElement, events: IEvents){
    super(container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.image = ensureElement<HTMLImageElement>('.card__image', container);
    this.price = ensureElement<HTMLElement>('.card__price', container);

    this.events = events;

    this.attachEvents();
    */

    /*this.container.addEventListener('click', () => {
      this.events.emit<TProductId>('card:open', { id: this.cardId })
    });
  }*/
 // Новое
 /*   attachEvents() {
    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.cardId });
    });
  }

  render(data: IProduct): HTMLElement {
      this.title.textContent = data.title;
      this.image.src = CDN_URL + '' + data.image;
      this.image.alt = data.title;
      this.price.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;

      this.setCategory(data.category);

      return this.container;
  }

   setCategory(value: string) {
    this.category.textContent = value;
    this.toggleClass(this.category, categoryMap[value], true); 
  }

}*/

