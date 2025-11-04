import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { ISuccessModal, ISuccessModalActions } from "../../../types/index";

export class SuccessModal extends Component<ISuccessModal> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;
  
  constructor(container: HTMLElement, protected actions?: ISuccessModalActions) {
    super(container);

    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    if(actions?.onClick) {
      this.closeButton.addEventListener('click',actions.onClick);
    }
  }

  set text(value: string) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
