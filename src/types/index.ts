export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Способ оплаты
export type TPayment = 'card' | 'cash' | '';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Товар
export interface IProduct {
  id: string;   // Уникальный идентификатор товара
  description: string; // Описание товара
  image: string; // Ссылка на изображение товара
  title: string;  // Название товара
  category: string; // Категория товара
  price: number | null; // Цена товара
}

//Покупатель
export interface IBuyer {
  payment: TPayment;  // Способ оплаты
  email: string; // Адрес электронной почты полкупателя
  phone: string; // Номер телефона покупателя
  address: string; // Адрес доставки
}
