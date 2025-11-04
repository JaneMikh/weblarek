import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { IContactsForm } from "../../../types/index";

export class ContactsForm extends Form<IContactsForm> {
  protected phoneInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
  
  set email(value: string) {
    this.emailInput.value = value;
  }
}
