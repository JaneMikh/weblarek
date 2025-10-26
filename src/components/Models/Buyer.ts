import { IBuyer, TErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private buyerData: Partial<IBuyer> = {};

   constructor(private events: IEvents) {}

  //Получение всех данных покупателя
  getBuyerData(): Partial<IBuyer> {
    return this.buyerData;
  }

  //Сохранение данных о покупателе
  setBuyerData(data: Partial<IBuyer>): void {
    this.buyerData = {...this.buyerData, ...data};
    //изменение данных покупателя
    this.events.emit('buyer:update-data', {buyer: this.buyerData});
    this.validateData();
  }

  validateData(): Record<string, string> {
    //Объек для хранения ошибок
    const errors: Record<string, string> = {};
    
    //Обрабока ошибок для формы "Способ оплаты и адрес доставки"
    if ('payment' in this.buyerData && !this.buyerData.payment) errors.payment = 'Не выбран способ оплаты';
    if ('address' in this.buyerData && !this.buyerData.address) errors.address = 'Укажите адрес доставки';

    //Обрабока ошибок для формы "Адресс электронной почты и номер телефона"
    if ('email' in this.buyerData && !this.buyerData.email) errors.email = 'Укажите email';
    else if ('email' in this.buyerData && this.buyerData.email && !this.buyerData.email.includes("@"))
      errors.email = 'Неверно указан email';

    if ('phone' in this.buyerData && !this.buyerData.phone) errors.phone = 'Укажите телефон';
    else if ('phone' in this.buyerData && this.buyerData.phone && !this.buyerData.phone.match(/^\+?\d{10,15}$/))
      errors.phone = 'Неверно указан телефон';

    //Генерируется событие, для проверки валидации формы
    this.events.emit("buyer:validated-data", {errors});
    return errors;
  }

  //Очистка даннных покупателя
  clearBuyerData(): void {
    this.buyerData = {
      payment: '',
      email: '',
      phone: '',
      address: '',
    };
    this.events.emit('buyer:clear-data');
    this.validateData();
  }
}
