import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";


export class CartIcon{
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;


  constructor(protected events: IEvents) {
    this.cartButton = ensureElement<HTMLButtonElement>('.header__container');
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter');
  
    this.cartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }

  // Возможно, это должен быть сеттер
  counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
