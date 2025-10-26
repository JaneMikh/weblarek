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
    paragraph.style.opacity = '0.3';
    paragraph.style.fontSize = '30px';

    this.productsList.append(paragraph);
    this.addCartButton.disabled = true;
  }

  updateState(items: HTMLElement[], price: number) {
    this.productsList.innerHTML = '';
    this.totalPrice.textContent = `${price} синапсов`;
    this.addCartButton.disabled = false;

     if (!items || items.length === 0) {
      this.setEmptyCartState();
      return;
    }
    
    items.forEach((item) => {
      this.productsList.append(item);
    });
  }
}
