import { IEvents } from "../base/Events";
import { IProduct } from "../../types/index";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

export type TProductId = Pick<IProduct, 'id'>;

export class CardView extends Card {
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;
  

  constructor(container: HTMLElement, protected events: IEvents, data: IProduct) {
    super(container, events, data);
    this.data = data;
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
  }

  disableButton(status: boolean = false) {
    this.buttonElement.disabled = status;
  }

  updateButton(data: IProduct, inCart: boolean) {
    if(data.price === null) {
      this.disableButton(true);
      this.buttonElement.onclick = null;
    }
    if(inCart) {
      this.buttonElement.textContent = 'Удалить из корзины';
      this.buttonElement.onclick = () => {
        this.events.emit('cart:remove-card', { id: data.id });
      }
    } else {
      this.buttonElement.textContent = 'Купить';
      this.buttonElement.onclick = () => {
        this.events.emit('cart:add-card', data);
      }
    }
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    console.log(data);
    
   this.updateButton(data, false); //"Это пример"
    return this.container;
  }
}
