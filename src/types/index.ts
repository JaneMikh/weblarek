export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Способ оплаты
export type TPayment = 'card' | 'cash' | '';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  inCart?: boolean;
}

//Покупатель
export interface IBuyer {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера в случае GET-запроса
export interface IProductData {
  items: IProduct[]; //общий список товаров
  total: number; //количество товаров в заказе
}

//Формат данных заказа при отправке на сервер (POST-запрос)
export interface IOrderData extends IBuyer {
  items: string[];  //массив из id каждого товара
  total: number;  //общая сумма заказа
}

//Формат данных ответа сервера после успешного POST-запроса
export interface IOrderResponse {
  id: string; //id заказа, присваемый сервером
  total: number; // общая сумма заказа
}

// Интерфейс для обработки событий карточки товара
export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

// Интерфейс для обработки события успешного завершения заказа
export interface ISuccessModalActions {
  onClick?: (event: MouseEvent) => void;
}

// Тип базовой карточки товара
export type TCard = Pick<IProduct, 'title' | 'price'>;

// Тип карточки товара в каталоге
export type TCardCatalogue = Pick<IProduct, |'image' | 'category'>;

// Тип карточки товара в отдельном окне просмотра
export type TCardModal = TCardCatalogue & Pick<IProduct, 'description'>;

// Тип карточки товара в корзине
export type TCardInCart = TCard & Pick<IProduct, 'id'>;

// Интерфейс для каталога
export interface ICatalogue {
  gallery: HTMLElement[];
}

// Интерфейс для модального окна
export interface IModal {
  content: HTMLElement;
}

// Интерфейс для иконки корзины
export interface ICartIcon {
  counter: number;
}

// Валидация ошибок полей ввода
export type TErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс для формы (соновной)
export interface IFormData {
  errors: string[];
  valid: boolean;
}

// Интерфейс для формы с email и телефоном
export interface IContactsForm extends IFormData {
  email: string;
  phone: string;
}

// Интерфейс для формы с адресом доставки и способом оплаты
export interface IOrderForm extends IFormData {
  address: string;
  payment: TPayment;
}

// Интерфейс для модального окна в случае успешного оформления заказа
export interface ISuccessModal {
  text: number;
}
