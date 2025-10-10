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
}

//Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

//Валидация ошибок полей ввода
export interface IErrors {
  payment: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  address: string | undefined;
}

//Слой коммуникации
// Ответ сервера в случае GET-запроса
export interface IProductData {
    items: IProduct[]; //общий список товаров
    total: number; //количество товаров в заказе
}

//Формат данных заказа при отправке на сервер (POST-запрос)
export interface IOrderData {
    payment: IBuyer['payment'];
    email: string;
    phone: string;
    address: string;
    items: string[];  //массив из id каждого товара
    total: number;  //общая сумма заказа
}

//Формат данных ответа сервера после успешного POST-запроса
export interface IOrderResponse {
    id: string; //id заказа, присваемый сервером
    total: number; // общая сумма заказа
}
