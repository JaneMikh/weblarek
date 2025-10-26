import { IEvents } from "../base/Events";
import { IProduct } from "../../types/index";

export class Cart {
  private productsList: IProduct[] = [];

  constructor(private events: IEvents) {}

  //Проверка наличия товара в корзине по его id
  hasItem(productId: string): boolean {
    return this.productsList.some(item => item.id === productId);
  }

  //Добавление товара в корзину
  addItem(item: IProduct): void {
    if(!this.hasItem(item.id)) {
      this.productsList.push(item);
      this.events.emit('cart:changed', {items: this.productsList});
    }
  }

  //Получение массива товаров, перемещенных в корзину
  getProductsList(): IProduct[] {
   return this.productsList;
  }

  //Удаление товара из корзины
  removeItem(id: string): void {
    this.productsList = this.productsList.filter(item => item.id !== id);
    this.events.emit('cart:changed', { items: this.productsList});
  }

  //Удаление всех товаров из корзины
  clearCart(): void {
   this.productsList = [];
   this.events.emit('cart:clear');
  }

  //Подсчет количества товаров в корзине
  getItemNumber(): number {
    return this.productsList.length;
  }

  //Подсчет стоимости всех товаров в корзине
  getTotalPrice(): number {
    return this.productsList.reduce((total, item) => total + (item.price || 0), 0);
  }
}
