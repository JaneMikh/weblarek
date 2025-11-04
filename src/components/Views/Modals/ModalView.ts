import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IModal } from "../../../types/index";

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected pageWrapper: HTMLElement;
  
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

    // Событие клика по кнопке закрытия
    this.closeButton.addEventListener('click', this.close.bind(this));

    // Событие клика по кнопке Esc
    this.onEscHandler = this.onEscHandler.bind(this);

    // Закрытие при клике на оверлей
    this.container.addEventListener('click', (event: Event) => {
      if (event.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  // Закрытие окна на кнопку "ESC" (опционально)
  protected onEscHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  // Открыть модальное окно
  protected open(): void {
    document.addEventListener('keydown', this.onEscHandler);
    this.toggleClass(this.container, 'modal_active', true);
    this.toggleClass(this.pageWrapper, 'page__wrapper_locked', true);
    this.events.emit('modal:open');
  }

  // Закрыть модальное окно
  close(): void {
    document.removeEventListener('keydown', this.onEscHandler); 
    this.toggleClass(this.container, 'modal_active', false);
    this.toggleClass(this.pageWrapper, 'page__wrapper_locked');
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    this.open();
    super.render(data);
    return this.container;
  }
}
