import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types/index";
import { ensureElement } from "../../../utils/utils";

export class CardInModal extends Card <IProduct> {
  private description: HTMLElement;
  private buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.events = events;
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
  }

  // Функция для изменения состояния кнопки в зависимости от условий
  private updateButtonState(card: IProduct & {inCart?: boolean}) {
    if (!card.price) {
      this.buyButton.disabled = true;
      this.buyButton.textContent = 'Недоступно';
    } else if (card.inCart) {
      this.buyButton.disabled = false;
      this.buyButton.textContent = card.inCart ? 'Удалить из корзины' : 'Купить';
    } else {
      this.buyButton.disabled = false;
      this.buyButton.textContent = 'Купить';
    }
  }

  setData(card: IProduct & {inCart?: boolean}, index?: number) {
    super.setData(card, index);
    this.description.textContent = card.description;

    this.updateButtonState(card);

    this.buyButton.onclick = () => {
      //Если товар нельзя купить
      if (!card.price) return;

      this.events.emit('card:toggle', {id: card.id});
      this.events.emit('modal:close');
    };

    // Обновление состояния кнопки при изменении корзины
    this.events.on('cart:changed', ({items}: {items: IProduct[]}) => {
      card.inCart = items.some((item) => item.id === card.id);
      this.updateButtonState(card);
    });
  }
}
