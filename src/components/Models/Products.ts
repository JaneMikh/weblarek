import { IProduct } from "../../types/index";
type TProductId = Pick<IProduct, 'id'>;
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  // Получение массива товаров из модели
  getItemsList(): IProduct[] {
    return this.items;
  }

  //Сохранение массива товаров, полученного в параметрах метода
  setItemsList(items: IProduct[]): void {
    this.items = items;
  }

  //Получение карточки товара по id
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  //Сохранение выбранной карточки товара для подробного отображения
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  //Получение информации о товаре для его подробного отображения в отдельном окне
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
};
