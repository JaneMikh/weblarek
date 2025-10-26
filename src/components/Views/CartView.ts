import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class CartView  {
  private productsList: HTMLElement;
  private totalPrice: HTMLSpanElement;
  private addCartButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    this.events = events;

    this.productsList = ensureElement<HTMLElement>('.basket__list', container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
    this.addCartButton = ensureElement<HTMLButtonElement>('.basket__button', container);

    this.setEmptyCartState();
  }

  private setEmptyCartState() {
    let paragraph = document.createElement('p');
    paragraph.className = 'basket__empty';
    paragraph.textContent = 'Корзина пуста';

    this.productsList.append(paragraph);
    if(this.totalPrice === null) {
      this.addCartButton.disabled = true;
    }
  }

  updateState(items: HTMLElement[], price: number) {
    this.productsList.innerHTML = '';
    
    this.addCartButton.disabled = false;
    items.forEach((item) => {
      this.productsList.append(item);
    });

    this.totalPrice.textContent = `${price} синапсов`;

    if (!items || items.length === 0) {
      this.setEmptyCartState();
      return;
    }
  }
}

