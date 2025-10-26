import { ensureElement } from "../../../utils/utils";
import { Form, IFormData } from "./Form";
import { IEvents } from "../../base/Events";

export interface IContactsForm extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
  protected phoneInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;
  //protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container)!;
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container)!;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)!;

    const changeInputsEmit = () => {
      this.events.emit('buyer:changed-field', {
        formData: {
          email: this.emailInput.value,
          phone: this.phoneInput.value,
        },
      });
    };

    this.emailInput.addEventListener('input', changeInputsEmit);
    this.phoneInput.addEventListener('input', changeInputsEmit);

    this.submitButton.disabled = true;
  }

  // Функция для отображения ошибок и обновления состояния формы
  setErrors(errors: Record<string, string>) {
        if (errors.email)  {this.setError(errors.email);
        } else if (errors.phone) {this.setError(errors.phone);
        } else this.clearError();

        const hasErrors = Boolean(errors.email || errors.phone);
        this.valid = !hasErrors;
        this.submitButton.disabled = hasErrors;
      }

  onSubmit() {
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData: IContactsForm = {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      };

      this.events.emit('contacts:submit', {formData});
    });
  }
}
