import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(private events: IEvents) {}

  // Получение массива товаров из модели
  getItemsList(): IProduct[] {
    return this.items;
  }

  //Сохранение массива товаров, полученного в параметрах метода
  setItemsList(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalogue:changed');
  }

  //Получение карточки товара по id
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  //Сохранение выбранной карточки товара для подробного отображения
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('card:select', { item });
  }

  //Получение информации о товаре для его подробного отображения в отдельном окне
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
