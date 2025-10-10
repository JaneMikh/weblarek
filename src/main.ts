import './scss/styles.scss';
import { Products } from './components/Modals/Products';
import { Cart } from './components/Modals/Cart';
import { Buyer } from './components/Modals/Buyer';

import { apiProducts } from './utils/data';

import { ProductApi } from './components/base/ProductApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ PRODUCTS //
const productsModal = new Products();

productsModal.setItemsList(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModal.getItemsList());

const card = apiProducts.items[1];
productsModal.setSelectedItem(card);
console.log('Выбранный продукт: ', productsModal.getSelectedItem());

const productId = apiProducts.items[1].id;
console.log('Проверка наличия реального товара в корзине: ', productsModal.getItemById(productId));
console.log('Проверка корзины на НЕсуществующий id: ', productsModal.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e789'));


// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ CART //
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


// ТЕСТИРОВАНИЕ КЛАССА-МОДЕЛИ BUYER //
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
buyerModal.setPayment('cash');
buyerModal.setAddress('г. Новосибирск');
buyerModal.setPhone('+71111111111');
buyerModal.setEmail('matricaria@yandex.com');

console.log('Обновленные данные о покупателе: ', buyerModal.getBuyerData());

//Проверка валидации
//Условие 1: Все поля ввода заполнены:
console.log('Проверка заведомо валидной формы на валидность: ', buyerModal.validateData());

//Условие 2: Не заполнены некоторые поля ввода:
buyerModal.setAddress('');
buyerModal.setEmail('');
console.log('Проверка заведомо валидной формы на валидность: ', buyerModal.validateData());

//Условие 3: Пустая форма + проверка работы метода по очистке данных покупателя
buyerModal.clearBuyerData();
console.log('Проверка пустой формы на валидность заполненных полей: ', buyerModal.validateData());
console.log('Все данные о покупателе удалены!', buyerModal.getBuyerData());

//ТЕСТИРОВАНИЕ API
const api = new Api(API_URL);
const productApi = new ProductApi(api);


//Получение данных с сервера и их сохранение
async function getProducts() {
  try {
    const products = await productApi.getProductsData();
    productsModal.setItemsList(products);
    console.log('Каталог товаров, выгруженных с сервера: ', productsModal.getItemsList());
  } catch (error) {
    console.error(error)
  }
}

//Отправка заказа на сервер
async function postOrder() {
  try {
    const items = productsModal.getItemsList();
    //Допустим, в корзине есть 2 товара:
    cartModal.addItem(items[0]);
    cartModal.addItem(items[1]);
    //Проходим по массиву с товарами и создаем новый массив, состоящий из id каждого товара
    const itemsIdArray = cartModal.productsList.map((item) => item.id);
    //Считаем общую стоимость заказа
    const totalPrice = cartModal.getTotalPrice();
  
    const order = await productApi.postOrderData({
      payment: 'cash',
      email: 'test@mail.ru',
      phone: '+71111111111',
      address: 'г. Москва',
      items: itemsIdArray, //сюда передаем массив из id
      total: totalPrice, // сюда передаем сумму заказа
    });

    console.log('Ваш заказ: ', order);
  } catch (error) {
    console.error('Ошибка при отправке заказа: ', error);
  }
}

getProducts();
postOrder();
