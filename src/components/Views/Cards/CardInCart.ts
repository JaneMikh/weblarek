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




/*
export class CardInCartView {
  private container: HTMLElement;
  private price: HTMLSpanElement;
  private title: HTMLElement;
  private indexItem: HTMLSpanElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    this.container = container;
    this.events = events;

    //Поиск элементов в DOM
    this.indexItem = ensureElement<HTMLSpanElement>('.basket__item-index', container);
    this.price = ensureElement<HTMLSpanElement>('.card__price', container);
    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.deleteButton.addEventListener('click', () => {
      const cardId = this.container.dataset.id;
      if (cardId) {
        this.events.emit('cart:remove', {id: cardId});
      }
    });
  }
  
  setData(card: IProduct, index: number) {
    this.container.dataset.id = card.id;
    this.title.textContent = card.title;
    this.price.textContent = `${card.price} синапсов`;
    this.indexItem.textContent = (index + 1).toString();
  }

  render(): HTMLElement {
    return this.container;
  }
}
*/