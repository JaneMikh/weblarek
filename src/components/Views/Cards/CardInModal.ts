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

  toggleButton(card: IProduct): void {
    if (!card.price) {
      this.buyButtonElement.disabled = true;
      this.buyButtonElement.textContent = 'Недоступно';
    } else {
      this.buyButtonElement.disabled = false;
    }
  }

  updateButtonState(inCart: boolean): void {
      this.buyButtonElement.textContent = inCart 
      ? 'Удалить из корзины' 
      : 'Купить';
  }
}
