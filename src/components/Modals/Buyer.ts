import { IBuyer, TPayment, IErrors } from "../../types";

export class Buyer {
  private buyerData: Partial<IBuyer> = {};

  //Получение всех данных покупателя
  getBuyerData(): Partial<IBuyer> {
    return this.buyerData;
  }

  //Сохранение данных о покупателе
  setBuyerData(data: Partial<IBuyer>): void {
    this.buyerData = {...this.buyerData, ...data};
  }

  setPayment(payment: TPayment): void {
    this.buyerData.payment = payment;
  }

  setAddress(address: string): void {
    this.buyerData.address = address;
  }

  setPhone(phone: string): void {
    this.buyerData.phone = phone;
  }

  setEmail(email: string): void {
    this.buyerData.email = email;
  }

  //Валидация введенных данных
  validateData(): IErrors {
    const errors: IErrors = {
      payment: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
    }

    if(!this.buyerData.payment) {errors.payment = "Выберете способ оплаты покупки"};
    if(!this.buyerData.email) {errors.email = "Укажите адрес электронной почты"};
    if(!this.buyerData.phone) {errors.phone = "Укажите Ваш номер телефона"};
    if(!this.buyerData.address) {errors.address = "Укажите адрес доставки"};

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
  }
};
