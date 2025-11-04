import { TErrors, IOrderData } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private buyerData: IOrderData = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0
  };

  constructor(private events: IEvents) {}

  //Получение всех данных покупателя
  getBuyerData(): IOrderData {
    return this.buyerData;
  };

  //Сохранение данных о покупателе
  setBuyerData(data: Partial<IOrderData>): void {
    this.buyerData = {...this.buyerData, ...data};
    this.validateData();
  };

  private validateData(): TErrors {
    const errors: TErrors = {};

    if(!this.buyerData.payment) {
      errors.payment = "Укажите способ оплаты покупки"
    } else {
      delete errors.payment;
    };
    if(!this.buyerData.email) {
      errors.email = "Укажите адрес электронной почты"
    } else {
      delete errors.email;
    };
    if(!this.buyerData.phone) {
      errors.phone = "Укажите Ваш номер телефона"
    } else {
      delete errors.phone;
    };
    if(!this.buyerData.address) {
      errors.address = "Укажите адрес доставки"
    } else {
      delete errors.address;
    };
    this.events.emit('form-errors:change',  errors);
    return errors;
  }

  //Очистка даннных покупателя
  clearBuyerData(): void {
    this.buyerData = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    }
  }
}
