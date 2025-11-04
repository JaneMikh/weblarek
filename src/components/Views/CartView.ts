import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IProductData } from "../../types/index";
import { Component } from "../base/Component";

export class CartView  extends Component<IProductData> {
  private productsList: HTMLElement;
  private totalPrice: HTMLSpanElement;
  private cartButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;

    this.productsList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.cartButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.setEmptyCartState();

    this.cartButton.addEventListener('click', () => {
      events.emit('order:open');
    });
  }

  set items(cards: HTMLElement[]) {
    if(cards.length) {
      this.cartButton.disabled = false;
      this.productsList.replaceChildren(...cards);
    } else { 
      this.setEmptyCartState();
   }
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }

  private createParagraph() {
    let paragraph = document.createElement('p');
    paragraph.className = 'basket__empty';
    paragraph.textContent = 'Корзина пуста';
    paragraph.style.opacity = '0.3';
    paragraph.style.fontSize = '30px';

    return paragraph;
  }

  private setEmptyCartState() {
    this.productsList.replaceChildren(this.createParagraph());
    this.cartButton.disabled = true;
  }

  clearCart() {
    this.items = [];
  }
}
