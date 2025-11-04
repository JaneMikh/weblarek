import { ensureElement } from "../../../utils/utils";
import { ICardActions, TCardInCart } from "../../../types/index";
import { Card } from "./Card";

export class CardInCartView extends Card<TCardInCart> {
  protected indexItem: HTMLSpanElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.container = container;
    this.indexItem = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if(actions?.onClick){
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }
  
  set id(value: string) {
    this.container.dataset.id = value;
  }

  setCardIndex(index: number) {
    this.indexItem.textContent = (index + 1).toString();
  }
}
