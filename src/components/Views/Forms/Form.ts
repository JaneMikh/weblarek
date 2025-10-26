export interface IFormData {
    [key: string]: string;   
}

export class Form<T extends IFormData> {
  protected container: HTMLFormElement;
  protected formErrors: HTMLElement;
  protected isValid = false;
  protected inputs: Record<keyof T, HTMLInputElement>; // объект с ключами
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement) {
    this.container = container;

    this.formErrors = container.querySelector<HTMLElement>('.form__errors')!;
    this.submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input'))
      .reduce((acc, input) => {
        acc[input.name as keyof T] = input;
        return acc;
    }, {} as Record<keyof T, HTMLInputElement>);
  }

  // Сеттер ждя уравления состоянием кнопки отправки
  set valid(value: boolean) {
      this.isValid = value;
      if (this.submitButton) {
        this.submitButton.disabled = !value;
      }
  }

   // Функция для добавления значений в поля ввода
  setInputValue(name: keyof T, value: string): void { // передаем имя поля и его значение
    const input = this.inputs[name];
    if (input) {
      input.value = value;
    }
  }

  // Функция для получения текущего состояния поля по его имени
  getInputValue(name: keyof T): string {
    return this.inputs[name]?.value ?? '';
  }

  // Функция для удаления сообщения об ошибке
  clearError(): void {
    this.formErrors.textContent = '';
  }

  // Функция для отображения ошибки при заполнении полей формы
  setError(error: string): void {
    this.formErrors.textContent = error; 
  }

  // Функция, описывающая логику отправки формы
  onSubmit(handler: (formData: T) => void): void {
    this.container.addEventListener('submit', (event) => {
      //отменяем отправку формы по умолчанию
      event.preventDefault();

      // Собираем данные всех полей в объект
      const formData = {} as T;   
      for (const key in this.inputs) {
        formData[key as keyof T] = this.inputs[key as keyof T].value as T[keyof T];
      }

      handler(formData);
    });
  }
}