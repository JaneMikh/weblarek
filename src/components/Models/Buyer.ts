import { IBuyer, TErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private buyerData: Partial<IBuyer> = {};

  constructor(private events: IEvents) {}

  //Получение всех данных покупателя
  getBuyerData(): Partial<IBuyer> {
    return this.buyerData;
  };

  //Сохранение данных о покупателе
  setBuyerData(data: Partial<IBuyer>): void {
    this.buyerData = {...this.buyerData, ...data};
    this.events.emit('buyer:update-data', this.buyerData);
  }

  validateData(): TErrors {
    const errors: TErrors = {};

    if(!this.buyerData.payment) {errors.payment = "Выберете способ оплаты покупки"};
    if(!this.buyerData.email) {errors.email = "Укажите адрес электронной почты"};
    if(!this.buyerData.phone) {errors.phone = "Укажите Ваш номер телефона"};
    if(!this.buyerData.address) {errors.address = "Укажите адрес доставки"};
    this.events.emit('form-errors:change', errors);
   
    return errors;
  }

  //Очистка даннных покупателя
  clearBuyerData(): void {
    this.buyerData = {
      payment: '',
      email: '',
      phone: '',
      address: '',
    }

    this.events.emit('buyer:update-data', this.buyerData);
  }
}
