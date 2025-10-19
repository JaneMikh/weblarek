import { categoryMap } from "../../utils/constants";
import { IProduct } from "../../types/index";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";

type TProductId = Pick<IProduct, 'id'>;

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

    this.container.addEventListener('click', () => {
      this.events.emit<TProductId>('card:open', { id: this.cardId })
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

}

