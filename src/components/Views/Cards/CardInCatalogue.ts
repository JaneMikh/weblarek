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
