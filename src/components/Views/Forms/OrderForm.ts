import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IOrderForm } from "../../../types/index";
import { IEvents } from "../../base/Events";
import { ensureAllElements } from "../../../utils/utils";

export class OrderForm extends Form<IOrderForm> {
  protected addressInput: HTMLInputElement;
  protected paymentType: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.paymentType = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    
    //Слушатели для кнопок выбора способа оплаты
    this.paymentType.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        this.changeInput('payment', button.name);
      });
    });
  }

  set payment(value: string) {
    this.paymentType.forEach((button) => {
      this.toggleClass(button, 'button_alt-active', button.name === value);
    })
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
