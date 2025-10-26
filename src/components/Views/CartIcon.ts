import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";

interface ICartButton {
  counter: number;
}

export class CartIcon extends Component<ICartButton> {
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this.cartButton = ensureElement<HTMLButtonElement>('.header__container', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.cartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }
  
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
