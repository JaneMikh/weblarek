import { IProduct } from "../../types";

export class Cart {
  private productsList: IProduct[];

  constructor(items: IProduct[] = []) {
    this.productsList = items;
  }

  //Проверка наличия товара в корзине по его id
  hasItem(productId: string) : boolean {
    if(this.productsList.find(item => item.id === productId)) {
      return true;
    } else return false;
  }

  //Добавление товара в корзину
  addItem(item: IProduct) : void {
    if(!this.hasItem(item.id)) {
      this.productsList.push(item);
    }
  }

  //Получение массива товаров, перемещенных в корзину
  getProductsList(): IProduct[] {
   return this.productsList;
  }

  //Удаление товара из корзины
  removeItem(product: IProduct) : void {
    this.productsList = this.productsList.filter(item => item.id !== product.id);
  }

  //Удаление всех товаров из корзины
  clearCart() : void {
   this.productsList = [];
  }

  //Подсчет количества товаров в корзине
  getItemNumber(): number {
    return this.productsList.length;
  }

  //Подсчет стоимости всех товаров в корзине
  getTotalPrice() : number {
    let total = 0;
    this.productsList.forEach((item) => {
      if(item.price) {
        total = total + item.price;
      }
    });
    return total;
  }
}