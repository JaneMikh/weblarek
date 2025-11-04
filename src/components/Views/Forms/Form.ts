import { IFormData, TErrors } from "../../../types/index";
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class Form<T> extends Component<IFormData> {
  protected formErrors: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    //Слушатель для отслеживания изменений в каждом инпуте
    this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target && target.name)
				this.changeInput(target.name as keyof TErrors, target.value);
		});

    //Универсальный сабмит для двух разных форм
    this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
  }

  set valid(value: boolean) {
    if (value === true) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
    }
  }

  set errors(value: string) {
    this.formErrors.textContent = value; 
  }

  // Функция для генерации событий изменения инпутов
  protected changeInput(input: keyof TErrors, value: string): void {
		this.events.emit(`order-${input}:change`, { value });
	}
  
  render(data: Partial<T> & IFormData): HTMLFormElement {
		const { valid, errors, ...inputs } = data;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
