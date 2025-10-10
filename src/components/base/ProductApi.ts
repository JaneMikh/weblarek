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
    const response = await this.api.get<IProductData>('/product/');
    return response.items;
  }

  //Отправка данных заказа на сервер
  async postOrderData(orderData: IOrderData): Promise<IOrderResponse> {
    const response = await this.api.post<IOrderResponse>('/order/', orderData);
    return response;
  }
}
