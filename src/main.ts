import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ProductApi } from './components/base/ProductApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

import { CartIcon } from './components/Views/CartIcon';
import { EventEmitter } from './components/base/Events';
import { Card } from './components/Views/Cards/Card';
import { IProduct } from './types/index';
import { Modal } from './components/Views/Modals/ModalView';
import { CartView } from './components/Views/CartView';
import { Catalogue } from './components/Views/Catalogue';
import { ensureElement } from './utils/utils';
import { CardInCatalogue } from './components/Views/Cards/CardInCatalogue';
import { IGalleryCard } from './types/index';
import { CardInModal } from './components/Views/Cards/CardInModal';
import { CardInCartView } from './components/Views/Cards/CardInCart';

// СОБЫТИЯ
const events = new EventEmitter();

// API
const api = new Api(API_URL);
const productApi = new ProductApi(api);

//ТЕМПЛЕЙТЫ
const cardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cartTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cartContent = cartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

// МОДЕЛИ (данные)
const catalogueModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

//ОТОБРАЖЕНИЕ (VIEW)
const catalogueView = new Catalogue(ensureElement<HTMLElement>('.gallery'), events);
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cartIconView = new CartIcon(ensureElement<HTMLElement>('.header'), events);
const cartView = new CartView(cartContent, events);

/////////////////////////////////////////////////////////////////////////////

//Получение данных о товарах с сервера
async function loadProducts() {
  try {
    const cardList = await productApi.getProductsData();
    catalogueModel.setItemsList(cardList);
  } catch (error) {
    console.error('Ошибка при загрузке каталога: ', error);
  }
}

//ПОДПИСКА НА СОБЫТИЯ

// Отрисовка каталога товаров
events.on('catalogue:changed', () => {
  const itemsCards = catalogueModel.getItemsList().map((item, index) => {
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardInCatalogue(cardElement, events);
    card.setData(item, index);
    return card.render(); // отрисовка карточки
  });

  catalogueView.render({gallery: itemsCards}); //отрисовка всех карточек в классе каталог
});

//Обрабока события "Открыть карточку в модальном окне"
events.on('card:select', ({ product, image }: IGalleryCard) => {
  const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
  const content = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const cardPreview = new CardInModal(content, events);

  const inCart = cartModel.hasItem(product.id);
  cardPreview.setData({ ...product, image: image, inCart });

  modalView.open(content);
});

//Обработка события "Добавить в корзину/удалить из корзины"
events.on('card:toggle', ({ id }: { id: string }) => {
  if (cartModel.hasItem(id)) cartModel.removeItem(id);
  else {
    const product = catalogueModel.getItemsList().find((item) => item.id === id);
    if (product) cartModel.addItem(product); // при этом запускается измерение состояния корзины "cart:change"
  }
});

// Обновление состояния корзины
events.on('cart:changed', ({ items }: { items?: IProduct[] } = {}) => {
	//Получение массива товаров, перемещенных в корзину
  const cartItems = items || cartModel.getProductsList();

	//Проходимся по массиву товаров и создаем новые копии карточек
  const cards = cartItems.map((item, index) => {

		//новый темплейт
    const cardInCartTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
    const newCardTemplate = cardInCartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardInCartView(newCardTemplate, events);
		//отрисовка карточки
    card.setData(item, index);
    return card.render();
  });

	//обновляем состояние корзины и добавляем общую сумму заказа
  cartView.updateState(cards, cartModel.getTotalPrice());
	//Подсчитываем число товаров в корзине
  cartIconView.counter = cartModel.getItemNumber();
});

// Открытие корзины
events.on('cart:open', () => {
  const basketButton = cartContent.querySelector<HTMLButtonElement>(".basket__button")!;

	//При нажатии на кнопку "Оформить" сработает событие 'order:open'
  basketButton.onclick = () => events.emit('order:open');

  modalView.open(cartContent);
});

// Удаление товара из корзины
events.on('cart:remove', ({ id }: { id: string }) => {
	//удаляем данные карточки из модели Cart по id
  cartModel.removeItem(id);

	//удаление карточки товара приводит к возникновению события "корзина изменилась"
	//с получением новой информации о списке товаров
  events.emit('cart:changed', {items: cartModel.getProductsList()});
});


loadProducts();