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
  };

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
   // this.clearContent();

    this.events.emit('modal:close');
  }

  // Очистить содержимое модального окна (при закрытии)
 /* protected clearContent() {
    this.container.innerHTML = '';
  }*/

  render(): HTMLElement {
    return this.container;
  }
}


/*import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IModal  {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  onEscClick: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;
    this.content = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    
    this.onEscClick = this.onEscHandler.bind(this);

    this.closeButton.addEventListener('click', () => {
      this.closeModal();
    });
  }

  onEscHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
      this.events.emit('modal:close');
    }
  }

  openModal() {
    document.addEventListener('keydown', this.onEscClick);
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit('modal:open');
  }

  closeModal() {
    this.toggleClass(this.container, 'modal_active', false);
    document.removeEventListener('keydown', this.onEscClick);
    this.events.emit('modal:close');
  }

  setContent(content: HTMLElement) {
		this.content.replaceChildren(content);
		return this;
	}
}*/