import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ICatalogue } from "../../types/index";

export class Catalogue extends Component<ICatalogue> {
  protected galleryElement: HTMLElement;

  constructor(galleryElement: HTMLElement, protected events: IEvents) {
    super(galleryElement);
    this.galleryElement = galleryElement;
    this.events = events;
  }

  setContent(items: HTMLElement[]) {
    this.galleryElement.replaceChildren(...items);
  }

  render(data?: Partial<ICatalogue> | undefined): HTMLElement {
     if (data?.gallery) {
        this.setContent(data.gallery);
    }
    return this.galleryElement;
  }
}
