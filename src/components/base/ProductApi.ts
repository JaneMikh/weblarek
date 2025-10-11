import { 
  IApi,
  IProduct,
  IProductData,
  IOrderData,
  IOrderResponse
} from "../../types";

export class ProductApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  //Получение списка товаров с сервера
  async getProductsData(): Promise<IProduct[]> {
    try{
      const response = await this.api.get<IProductData>('/product/');
      return response.items;
    } catch(error) {
      console.error('Ошибка при загрузке товаров: ', error);
      throw error;
    } 
  };

  //Отправка данных заказа на сервер
  async postOrderData(orderData: IOrderData): Promise<IOrderResponse> {
    try {
      const response = await this.api.post<IOrderResponse>('/order/', orderData);
      return response;
    }
    catch(error) {
      console.error('Ошибка при загрузке товаров: ', error);
      throw error;
    } 
  };
};
