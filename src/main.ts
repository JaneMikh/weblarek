import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ProductApi } from './components/base/ProductApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { CartIcon } from './components/Views/CartIcon';
import { EventEmitter } from './components/base/Events';
import { IProduct } from './types/index';
import { Modal } from './components/Views/Modals/ModalView';
import { CartView } from './components/Views/CartView';
import { Catalogue } from './components/Views/Catalogue';
import { ensureElement } from './utils/utils';
import { CardInCatalogue } from './components/Views/Cards/CardInCatalogue';
//import { IGalleryCard } from './types/index';
import { CardInModal } from './components/Views/Cards/CardInModal';
import { CardInCartView } from './components/Views/Cards/CardInCart';
import { ContactsForm, IContactsForm } from './components/Views/Forms/ContactsForm';
import { OrderForm, IOrderForm } from './components/Views/Forms/OrderForm';
import { SuccessModal } from './components/Views/Modals/ModalSuccess';
import { cloneTemplate } from './utils/utils';
import { TCardModal, TCardCatalogue } from './types/index';

// СОБЫТИЯ
const events = new EventEmitter();

// API
const api = new Api(API_URL);
const productApi = new ProductApi(api, CDN_URL);

// ТЕМПЛЕЙТЫ И КОНТЕНТЫ
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cartContent = cartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
//const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
//const orderContent = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
//const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
//const contactsContent = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
//const successTemplate = ensureElement<HTMLTemplateElement>('#success');
//const successContent = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardContent = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cardInCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');




// МОДЕЛИ (DATA)
const catalogueModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

//ОТОБРАЖЕНИЕ (VIEW)
const catalogueView = new Catalogue(ensureElement<HTMLElement>('.gallery'), events);
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cartIconView = new CartIcon(ensureElement<HTMLElement>('.header'), events);
const cartView = new CartView(cartContent, events);
//const orderForm = new OrderForm(orderContent);
//const contactsForm = new ContactsForm(contactsContent, events);
//const successModal = new SuccessModal(successContent);
//const cardPreview = new CardInModal(cardContent);

//Функция для изменения формата изображенияя с SVG на PNG
function changeImageFormat(apiProducts: IProduct[]): IProduct[] {
  const newItems: IProduct[] = [];
  for (const item of apiProducts) {
    const newItem = { ...item };
    if (newItem.image && newItem.image.toLowerCase().endsWith(".svg")) {
      newItem.image = newItem.image.slice(0, -4) + ".png";
    }
     newItems.push(newItem);
  }
  return newItems;
}

//Получение данных о товарах с сервера
async function loadProducts() {
  try {
    const cardList = await productApi.getProductsData();
    catalogueModel.setItemsList(changeImageFormat(cardList));
    
  } catch (error) {
    console.error('Ошибка при загрузке каталога: ', error);
  }
}

//ПОДПИСКА НА СОБЫТИЯ

// Отрисовка каталога товаров
events.on('catalogue:changed', () => {
  const itemsCards = catalogueModel.getItemsList().map((item) => {
    const cardInCatalogue = new CardInCatalogue(cloneTemplate(cardTemplate), {
      onClick: () => events.emit('card:select', item)
    });

    return cardInCatalogue.render(item);
  });
  catalogueView.render({ gallery: itemsCards });

});

loadProducts();

// Обрабока события "Открыть карточку в модальном окне"
events.on('card:select', (item: IProduct) => {
  
  const cardPreview = new CardInModal(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if(!item.inCart) {
        events.emit('card:add-to-cart', item);
      } else {
        events.emit('card:delete-from-cart', item);
      }
      cardPreview.updateButtonState(item.inCart);
    }
  });
  if (cartModel.hasItem(item.id)){
    item.inCart = true;
    cardPreview.updateButtonState(true)
  }

  cardPreview.toggleButton(item);
  modalView.render({
    content: cardPreview.render({
                title: item.title,
                price: item.price,
                image: item.image,
                category: item.category,
                description: item.description
    })
 });
});

// Добавление товара в корзину
events.on('card:add-to-cart', (item: IProduct) => {
  if (cartModel.hasItem(item.id)) {
    cartModel.removeItem(item.id);
  } else {
     //поиск в каталоге карточку, если она существует, добавляем ее в корзину
    const product = catalogueModel.getItemsList().find((element) => element.id === item.id);
    if (product) cartModel.addItem(product); // При этом запускается изменение состояния корзины "cart:change"

  }
	item.inCart = true;
  cartModel.addItem(item);
});

// Удаление товара из корзины
events.on('card:delete-from-cart', (item: IProduct) => {
	item.inCart = false;
	cartModel.removeItem(item.id);
  //Добавила (возможно, не надо)
  events.emit('cart:changed', { items: cartModel.getProductsList() });
});

// Обработка состояния "Открыть корзину"
events.on('cart:open', () => {
  modalView.render({
    content: cartView.render()
  });
});


console.log(cartModel.getProductsList());

// Обновление состояния корзины
events.on('cart:changed', ({ items }: { items?: IProduct[] } = {}) => {
  cartIconView.counter = cartModel.getItemNumber();  // Подсчет числа товаров в корзине
  const cartItems = items || cartModel.getProductsList();   // Получение массива товаров, перемещенных в корзину
  cartView.total = cartModel.getTotalPrice();
  cartView.items = cartItems.map((item, index) => {           // Проходимся по массиву товаров и создаем новые копии карточек
    const card = new CardInCartView(cloneTemplate(cardInCartTemplate), {
      onClick: () => {
        events.emit('card:delete-from-cart', item);
      }
    });
    card.setCardIndex(index);
      // Отрисовка карточки
    return card.render({
      title: item.title,
      price: item.price
    });
  });
});



/*
// Обновление состояния корзины
events.on('cart:changed', ({ items }: { items?: IProduct[] } = {}) => {
  const cartItems = items || cartModel.getProductsList();   // Получение массива товаров, перемещенных в корзину
  const cards = cartItems.map((item, index) => {           // Проходимся по массиву товаров и создаем новые копии карточек
    const cardInCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    const newCardTemplate = cardInCartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardInCartView(newCardTemplate);

    card.setData(item, index);  // Отрисовка карточки
    return card.render();
  });

  cartView.updateState(cards, cartModel.getTotalPrice());   // Обновление состояния корзины и добавляем общую сумму заказа
  cartIconView.counter = cartModel.getItemNumber();  // Подсчет числа товаров в корзине
});

*/

/*
// Обработка события "Добавить в корзину/удалить из корзины"
events.on('card:toggle', ({ id }: { id: string }) => {
  if (cartModel.hasItem(id)) cartModel.removeItem(id);  // если в корзине есть этот товар, то удалить id
  else {
     //поиск в каталоге карточку, если она существует, добавляем ее в корзину
    const product = catalogueModel.getItemsList().find((item) => item.id === id);
    if (product) cartModel.addItem(product); // При этом запускается изменение состояния корзины "cart:change"
  }
});


// Удаление товара из корзины
events.on('cart:remove', ({id}: {id: string}) => {
  cartModel.removeItem(id);     // Удаляем данные карточки из модели Cart по id
  events.emit('cart:changed', {items: cartModel.getProductsList()});
});

/*
// Обработка состояния "Открыть корзину"
events.on('cart:open', () => {
  const basketButton = cartContent.querySelector<HTMLButtonElement>(".basket__button")!;
  basketButton.onclick = () => events.emit('order:open'); // При нажатии на кнопку "Оформить" сработает событие 'order:open'
  modalView.open(cartContent);
});


// Обновление состояния корзины
events.on('cart:changed', ({ items }: { items?: IProduct[] } = {}) => {
  const cartItems = items || cartModel.getProductsList();   // Получение массива товаров, перемещенных в корзину
  const cards = cartItems.map((item, index) => {           // Проходимся по массиву товаров и создаем новые копии карточек
    const cardInCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    const newCardTemplate = cardInCartTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new CardInCartView(newCardTemplate, events);

    card.setData(item, index);  // Отрисовка карточки
    return card.render();
  });

  cartView.updateState(cards, cartModel.getTotalPrice());   // Обновление состояния корзины и добавляем общую сумму заказа
  cartIconView.counter = cartModel.getItemNumber();  // Подсчет числа товаров в корзине
});


// Валидация по изменению полей. Передаем данные полей в модель "Buyer"
events.on('buyer:changed-field', ({formData}: {formData: {email: string; phone: string}}) => {
    buyerModel.setBuyerData(formData);
  }
);


// Форма "Аресс электронной почты и телефон"
events.on('contacts:open', () => {
  contactsForm.onSubmit();
  events.on('buyer:validated-data', ({errors}: {errors: Record<string, string>}) => {
    contactsForm.setErrors(errors);
    }
  );
  modalView.open(contactsContent);
});


// Форма "Способ оплаты и адрес доставки"
events.on('order:open', () => {
  orderForm.onSubmit((formData: IOrderForm) => {
    modalView.close();
    events.emit('order:success', {orderData: formData});
    events.emit('contacts:open');
  });
  modalView.open(orderContent);
});


// Отправка формы заказа
events.on('contacts:submit', ({ formData }: { formData: IContactsForm }) => {
    const errors: Record<string, string> = {};
    if (!formData.email.includes("@")) errors.email = 'Неверно указан email';
    if (!formData.phone.match(/^\+?\d{10,15}$/)) {
      errors.phone = 'Неверно указан телефон';
		}
    events.emit('buyer:validated-data', { errors });

		//Если ошибок нет, то:
    if (Object.keys(errors).length === 0) {
      const totalPrice = cartModel.getTotalPrice();     // Получаем общую сумму покупки
      successModal.text = `Списано ${totalPrice} синапсов`;    // Выводим сумму в DOM
      cartModel.clearCart();    // Очищаем корзину
      events.emit("cart:changed", {items: cartModel.getProductsList()}); // Генерируем событие, что содержимое корзины изменилось
      successModal.closeHandler(() => {  // Устанавливаем handler для закрытия модального окна
        modalView.close();
      });
      modalView.open(successModal.render());  // Открываем модальное окно и отрисовываем <template id="success">
    }
  }
);

loadProducts();
*/