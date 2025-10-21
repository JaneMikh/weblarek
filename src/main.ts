import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { ProductApi } from './components/base/ProductApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

import { CartIcon } from './components/Views/CartIcon';
import { EventEmitter } from './components/base/Events';
import { Card } from './components/Views/Card';
import { IProduct } from './types/index';
import { Modal } from './components/Views/Modal';
import { CardView } from './components/Views/CardView';
//ТЕМПЛЕЙТЫ
const events = new EventEmitter();
const cartIconTemplate = new CartIcon(events);
const cardTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog').content;
const cardTemplatePreview = document.querySelector<HTMLTemplateElement>('#card-preview').content;
const modalElement = document.querySelector('.modal') as HTMLElement;
const gallery = document.querySelector<HTMLElement>('.gallery');

const catalogue = new Products();
const api = new Api(API_URL);
const productApi = new ProductApi(api);
const modal = new Modal(modalElement, events);
const buyer = new Buyer();

type TProductId = Pick<IProduct, 'id'>;



// Инициализация при загрузке страницы
function init() {
  //Список товаров
  loadProducts();

  //Список событий

  //Обнуление счетчика у корзины
}


// Получение карточек с сервера
async function loadProducts() {
  try {
    const cardList = await productApi.getProductsData();
     catalogue.setItemsList(cardList);
     gallery.replaceChildren(
		  ...cardList.map((item: IProduct) => {
			  const cardElement = cardTemplate.querySelector('.card').cloneNode(true) as HTMLElement;
			  const productCardView = new Card(cardElement, events, item);
			  const renderedCatalogue = productCardView.render(item);
			  return renderedCatalogue;
		  })
    )
  } catch (error) {
    console.error('Ошибка при загрузке каталога: ', error);
  }
}

init();

/*const product = apiProducts.items[1].id;
console.log(product);
/*const cardElement = cardTemplatePreview.querySelector('.card').cloneNode(true) as HTMLElement;
const cardPreview = new CardView(cardElement, events);

const res = cardPreview.render(product);
console.log(res);
modal.setContent(res).openModal();

modal.closeModal();*/


events.on<{ id: string }>('card:select', ({id}) => {
	const productData = catalogue.getItemById(id);
  console.log(productData);
  if(!productData) return;

  const cardElement = cardTemplatePreview.querySelector('.card').cloneNode(true) as HTMLElement;
	const cardPreview = new CardView(cardElement, events, productData);

  modal.setContent(cardPreview.render(productData)).openModal();
});





/*
////// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ PRODUCTS //////
const productsModal = new Products();

productsModal.setItemsList(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModal.getItemsList());

const card = apiProducts.items[1];
productsModal.setSelectedItem(card);
console.log('Выбранный продукт: ', productsModal.getSelectedItem());

const productId = apiProducts.items[1].id;
console.log('Проверка наличия реального товара в корзине: ', productsModal.getItemById(productId));
console.log('Проверка корзины на НЕсуществующий id: ', productsModal.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e789'));


////// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ CART //////
const cartModal = new Cart();

cartModal.addItem(apiProducts.items[1]);
cartModal.addItem(apiProducts.items[2]);
cartModal.addItem(apiProducts.items[3]);
console.log('В корзину добавили 3 товара: ', cartModal.getProductsList());
console.log('Проверка наличия товара в корзине (true):', cartModal.hasItem(apiProducts.items[1].id));

//Количество товара в корзине
console.log('Количество товаров в корзине: ', cartModal.getItemNumber());

//Подсчет стоимости заказа
console.log('Стоимость заказа: ', cartModal.getTotalPrice());

//Удаление определенного товара из корзины
cartModal.removeItem(apiProducts.items[1]);
console.log('Корзина после удаления одного товара из корзины: ', cartModal.getProductsList());

//Очиска корзины
cartModal.clearCart();
console.log('Корзина после удаления всех товаров: ', cartModal.getProductsList());


////// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ BUYER //////
const buyerModal = new Buyer();

//Задаем данные пользователя
buyerModal.setBuyerData({
  payment: 'card',
  email: 'jmatricaria@yandex.ru',
  phone: '+79999999999',
  address: 'г. Москва',
});

console.log('Текушие данные о покупателе: ', buyerModal.getBuyerData());

//Изменяем отдельные поля ввода и вновь запрашиванием данные пользователя
buyerModal.setBuyerData({payment: 'cash'});
console.log('Обновленные данные о покупателе: ', buyerModal.getBuyerData());

//Проверка валидации
//Условие 1: Все поля ввода заполнены:
console.log('Нет ошибок в валидации (true): ', buyerModal.validateData());

//Условие 2: Не заполнены некоторые поля ввода:
buyerModal.setBuyerData({payment: '', email: ''});
console.log('Есть ошибки в валидации (false): ', buyerModal.validateData());

//Проверка работы метода по очистке данных покупателя
buyerModal.clearBuyerData();
console.log('Все данные о покупателе удалены!', buyerModal.getBuyerData());

////// ТЕСТИРОВАНИЕ API //////

const api = new Api(API_URL);
const productApi = new ProductApi(api);

//Получение данных с сервера и их сохранение
async function getProducts() {
  try {
    const products = await productApi.getProductsData();
    productsModal.setItemsList(products);
    console.log('Каталог товаров, полученных с сервера: ', productsModal.getItemsList());
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}
getProducts();

*/