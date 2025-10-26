import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class Modal extends Component<{}> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;
    this.content = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    // Событие клика по кнопке закрытия
    this.closeButton.addEventListener(('click'), this.close.bind(this));

    // Событие клика по кнопке Esc
    this.onEscHandler = this.onEscHandler.bind(this);

    // Закрытие при клике на оверлей
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) this.close();
    });
  }

  //Закрытие окна на кнопку "ESC" (опционально)
  protected onEscHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  //Функция открытия модального окна
  open(card?: HTMLElement) {
    document.addEventListener('keydown', this.onEscHandler);
    if (card) this.content.replaceChildren(card);
    this.toggleClass(this.container, 'modal_active', true);
  }

  //Функция закрытия модального окна
  close() {
    document.removeEventListener('keydown', this.onEscHandler); 
    this.toggleClass(this.container, 'modal_active', false);
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    return this.container;
  }
}
