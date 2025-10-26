import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

interface ISuccessModal {
  text: string;
}

export class SuccessModal extends Component<ISuccessModal> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.events = events;
    this.description = ensureElement<HTMLElement>(".order-success__description", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
  }

  set text(value: string) {
    this.description.textContent = value;
  }

  closeHandler(handler: () => void) {
    this.closeButton.addEventListener("click", handler);
  }

  render(): HTMLElement {
    return this.container;
  }
}
