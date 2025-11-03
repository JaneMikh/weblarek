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


/*import { Card } from "./Card";
import { ICardActions, TCardModal } from "../../../types/index";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types/index";

export class CardInModal extends Card<TCardModal>{
  protected descriptionElement: HTMLElement;
  protected buyButtonElement: HTMLButtonElement;

  // Знаю, что не рукомендуется использовать эти поля,
  // но в моей реализации кода CardInModal вообще не знает о существовании CardInCatalogue,
  // поэтому доступа к его полям у CardInModal нет.
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLSpanElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
  
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buyButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);

    if(actions?.onClick) {
      this.buyButtonElement.addEventListener('click', actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set image(value: string) {
    this.imageElement.src = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
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

}*/


/*export class CardInModal extends Card <IProduct> {
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
      this.events.emit('modal:close'); Вот это тут не нужно
    };

    // Обновление состояния кнопки при изменении корзины
    this.events.on('cart:changed', ({items}: {items: IProduct[]}) => {
      card.inCart = items.some((item) => item.id === card.id);
      this.updateButtonState(card);
    });
  }
}*/
