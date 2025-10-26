import { ensureElement } from "../../../utils/utils";
import { Form, IFormData } from "./Form";

export interface IOrderForm extends IFormData {
  address: string;
  payment: 'card' | 'cash' | '';
}

export class OrderForm extends Form<IOrderForm> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected paymentType: 'card' | 'cash' | '' = '';

  constructor(container: HTMLFormElement) {
    super(container);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container)!;
    this.cashButton = ensureElement<HTMLButtonElement>('.button[name="cash"]', this.container)!;
    this.cardButton = ensureElement<HTMLButtonElement>('.button[name="card"]', this.container)!;
    

    this.addressInput.addEventListener('input', () => this.validate());

    this.cashButton.addEventListener("click", () => {
      this.selectPayment('cash');
      this.validate();
    });

    this.cardButton.addEventListener("click", () => {
      this.selectPayment('card');
      this.validate();
    });

    
  }

  selectPayment(method: 'card' | 'cash'): void {
    this.paymentType = method;
    if (method === 'card') {
      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else {
      this.cashButton.classList.add("button_alt-active");
      this.cardButton.classList.remove("button_alt-active");
    }
  }

  validate(): boolean {
    const paymentIsValid = this.paymentType !== "";
    const addressIsValid = this.getInputValue('address').trim().length > 0;
    
    const errorsList: string[] = [];
    if (!paymentIsValid) errorsList.push('Не выбран способ оплаты');
    if (!addressIsValid) errorsList.push('Укажите адрес доставки');
    

    if (errorsList.length > 0) {
      this.setError(errorsList.join(". "));
    } else {
      this.clearError();
    }

    this.valid = paymentIsValid && addressIsValid ;
    return this.isValid;
  }

  getInputValue(name: keyof IOrderForm): string {
    if (name === 'payment') return this.paymentType;
    return super.getInputValue(name);
  }

  setInputValue(name: keyof IOrderForm, value: string): void {
    if (name === 'payment') {
      this.paymentType = value as 'card' | 'cash';
    } else {
      super.setInputValue(name, value);
    }
  }
}
