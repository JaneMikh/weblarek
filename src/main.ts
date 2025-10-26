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
import { ContactsForm, IContactsForm } from './components/Views/Forms/ContactsForm';
import { OrderForm, IOrderForm } from './components/Views/Forms/OrderForm';
import { SuccessModal } from './components/Views/Modals/ModalSuccess';

// СОБЫТИЯ
const events = new EventEmitter();

// API
const api = new Api(API_URL);
const productApi = new ProductApi(api);

//ТЕМПЛЕЙТЫ
const cardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cartTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cartContent = cartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const orderContent = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const contactsContent = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const successContent = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const content = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

// МОДЕЛИ (данные)
const catalogueModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

//ОТОБРАЖЕНИЕ (VIEW)
const catalogueView = new Catalogue(ensureElement<HTMLElement>('.gallery'), events);
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cartIconView = new CartIcon(ensureElement<HTMLElement>('.header'), events);
const cartView = new CartView(cartContent, events);
const orderForm = new OrderForm(orderContent);
const contactsForm = new ContactsForm(contactsContent, events);
const successModal = new SuccessModal(successContent, events);
const cardPreview = new CardInModal(content, events);

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
    const cardInCatalogue = new CardInCatalogue(cardElement, events);
    cardInCatalogue.setData(item, index);
    return cardInCatalogue.render();
  });

  catalogueView.render({gallery: itemsCards}); //отрисовка всех карточек в классе каталог
});

//Обрабока события "Открыть карточку в модальном окне"
events.on('card:select', ({ product, image }: IGalleryCard) => {
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

// Форма "Способ оплаты и адрес доставки"
events.on('order:open', () => {
  orderForm.onSubmit((formData: IOrderForm) => {
    modalView.close();
    events.emit('order:success', { orderData: formData });
    events.emit('contacts:open');
  });

  modalView.open(orderContent);
});

// Форма "Аресс электронной почты и телефон"
events.on('contacts:open', () => {
  contactsForm.onSubmit();

  events.on('buyer:validated-data', ({ errors }: { errors: Record<string, string> }) => {
    contactsForm.setErrors(errors);
    }
  );
  modalView.open(contactsContent);
});

// Валидация по изменению полей. Передаем данные полей в модель "Buyer"
events.on('buyer:changed-field', ({ formData }: { formData: { email: string; phone: string } }) => {
    buyerModel.setBuyerData(formData);
  }
);

// Сабмит формы контактов
events.on('contacts:submit', ({ formData }: { formData: IContactsForm }) => {
    const errors: Record<string, string> = {};
    if (!formData.email.includes("@")) errors.email = 'Неверно указан email';
    if (!formData.phone.match(/^\+?\d{10,15}$/)) {
      errors.phone = 'Неверно указан телефон';
		}
    events.emit('buyer:validated-data', { errors });

		//Если ошибок нет, то:
    if (Object.keys(errors).length === 0) {
			//а) получаем общую сумму покупки
      const totalPrice = cartModel.getTotalPrice();
			//б) выводим сумму в DOM
      successModal.text = `Списано ${totalPrice} синапсов`;
			//в) Очищаем корзину
      cartModel.clearCart();
			//г) Генерируем событие, что содержимое корзины изменилось
      events.emit("cart:changed", { items: cartModel.getProductsList() });
			//д) Устанавливаем handler для закрытия модального окна
      successModal.closeHandler(() => {
        modalView.close();
      });
			//е) Открываем модальное окно и отрисовываем <template id="success">
      modalView.open(successModal.render());
    }
  }
);

loadProducts();