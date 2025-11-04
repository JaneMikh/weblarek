import { ICardActions, TCardModal, TCard, IProduct } from "../../../types/index";
import { ensureElement } from "../../../utils/utils";
import { CardCatalogModal } from "./Card";

export class CardInModal extends CardCatalogModal<TCardModal & TCard>{
  protected descriptionElement: HTMLElement;
  protected buyButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
  
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buyButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if(actions?.onClick) {
      this.buyButtonElement.addEventListener('click', actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  checkPrice(item: IProduct) {
    if (!item.price) {
      this.buyButtonElement.disabled = true;
      this.buyButtonElement.textContent = 'Недоступно';
    } else {
      this.buyButtonElement.disabled = false;
    }
  }

  toggleButton(card: IProduct) {
    if (!card.price) {
      this.buyButtonElement.disabled = true;
      this.buyButtonElement.textContent = 'Недоступно';
    } else {
      this.buyButtonElement.disabled = false;
    }
  }
  // Функция для изменения состояния кнопки в зависимости от условий
  updateButtonState(inCart: boolean) {
      this.buyButtonElement.textContent = inCart 
      ? 'Удалить из корзины' 
      : 'Купить';
  }
}
