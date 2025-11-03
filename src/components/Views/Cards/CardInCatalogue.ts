import { ICardActions, TCard } from "../../../types/index";
import { CardCatalogModal } from "./Card";

export class CardInCatalogue extends CardCatalogModal<TCard> {

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }
}


/*
type CategoryKey = keyof typeof categoryMap;

export class CardInCatalogue extends Card<TCardCatalogue> {
  protected imageElement: HTMLImageElement | null;
  protected categoryElement: HTMLSpanElement | null;
  protected _CDN_URL = CDN_URL;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLSpanElement>('.card__category', this.container);

    if(actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);

    }
  }

  set image(src: string) {
    this.setImage(this.imageElement, /*`${this._CDN_URL}/${src.replace(/\.[^/.]+$/, ".png")}`src, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}
*/
