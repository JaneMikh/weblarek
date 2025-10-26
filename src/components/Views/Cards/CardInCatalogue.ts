import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types/index";

export class CardInCatalogue extends Card<IProduct> {
  private cardsData!: IProduct;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
    this.events = events;
    
    //Обработчик события клика по карточке для его дальнейшего открытия 
    //в модальном окне и генерация события "card:select"
     this.container.addEventListener('click', () => {
      if (!this.cardsData) return;

      this.events.emit('card:select', {
        product: this.cardsData,
        image: this.imageItem.src,
      });
    });
  }

  setData(product: IProduct, index?: number) {
    super.setData(product, index);
    this.cardsData = product;
  }
}
