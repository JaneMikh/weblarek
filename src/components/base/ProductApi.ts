import { 
  IApi,
  IProduct,
  IProductData,
  IOrderData,
  IOrderResponse
} from "../../types/index";

export class ProductApi {
  private api: IApi;
  private cdn: string;

  constructor(api: IApi, cdn: string) {
    this.api = api;
    this.cdn = cdn;
  }

  //Получение списка товаров с сервера
  async getProductsData(): Promise<IProduct[]> {
    try{
      const response = await this.api.get<IProductData>('/product/');
      //return response.items;
      return response.items.map((item) => ({  //Получение изображений пришлось сделать так
        ...item,                              //Иначе у меня не получилось
        image: this.cdn + item.image
      }));
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
