import { IEvents } from "../base/Events";
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
}