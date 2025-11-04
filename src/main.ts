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
import { CardInModal } from './components/Views/Cards/CardInModal';
import { CardInCartView } from './components/Views/Cards/CardInCart';
import { ContactsForm} from './components/Views/Forms/ContactsForm';
import { OrderForm} from './components/Views/Forms/OrderForm';
import { SuccessModal } from './components/Views/Modals/ModalSuccess';
import { cloneTemplate } from './utils/utils';
import { TErrors } from './types/index';

// СОБЫТИЯ
const events = new EventEmitter();

// API
const api = new Api(API_URL);
const productApi = new ProductApi(api, CDN_URL);

// ТЕМПЛЕЙТЫ
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardInCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// МОДЕЛИ (DATA)
const catalogueModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

//ОТОБРАЖЕНИЕ (VIEW)
const catalogueView = new Catalogue(ensureElement<HTMLElement>('.gallery'), events);
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cartIconView = new CartIcon(ensureElement<HTMLElement>('.header'), events);
const cartView = new CartView(cloneTemplate(cartTemplate), events);
const orderFormView = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsTemplate), events);

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

//Получение данных с сервера
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

// Открыть карточку в модальном окне
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
    const product = catalogueModel.getItemsList().find((element) => element.id === item.id);
    if (product) cartModel.addItem(product); 
  }
	item.inCart = true;
  cartModel.addItem(item);
});

// Удаление товара из корзины
events.on('card:delete-from-cart', (item: IProduct) => {
	item.inCart = false;
	cartModel.removeItem(item.id);
  events.emit('cart:changed', { items: cartModel.getProductsList() });
});

// Открыть корзину
events.on('cart:open', () => {
  modalView.render({
    content: cartView.render()
  });
});

// Обновление состояния корзины
events.on('cart:changed', ({ items }: { items?: IProduct[] } = {}) => {
  cartIconView.counter = cartModel.getItemNumber();
  const cartItems = items || cartModel.getProductsList();
  cartView.total = cartModel.getTotalPrice();
  cartView.items = cartItems.map((item, index) => {
    const card = new CardInCartView(cloneTemplate(cardInCartTemplate), {
      onClick: () => {
        events.emit('card:delete-from-cart', item);
      }
    });
    card.setCardIndex(index);
    return card.render({
      title: item.title,
      price: item.price
    });
  });
});

// Переход к форме "Способ оплаты и адрес доставки"
events.on('order:open', () => {
  const products = cartModel.getProductsList();
  const productsIdList = products.map(item => item.id);
  buyerModel.setBuyerData({ items: productsIdList, total: cartModel.getTotalPrice() });
  
  modalView.render({
    content: orderFormView.render({
      payment: '',
      address: '',
      errors: [],
      valid: false
    })
  });
});

// Обработка событий в полях форм для заполнения данных покупателя
events.on('order-payment:change', (info: {value: string }) => {
  buyerModel.setBuyerData({ payment: info.value });
});

events.on('order-address:change', (info: {value: string }) => {
  buyerModel.setBuyerData({ address: info.value });
});

events.on('order-email:change', (info: { value: string }) => {
	buyerModel.setBuyerData({ email: info.value });
});

events.on('order-phone:change', (info: { value: string }) => {
	buyerModel.setBuyerData({ phone: info.value });
});

// Валидация полей ввода
events.on('form-errors:change', (errors: Partial<TErrors>) => {
  const { payment, email, phone, address } = errors;

  // Формирование строки ошибок для orderFormView
  orderFormView.valid = !payment && !address;
  const orderFormErrors = [];
  if(payment) {
    orderFormErrors.push(payment);
  }
  if (address) {
    orderFormErrors.push(address);
  }
  orderFormView.errors = orderFormErrors.join('; ');

 // Формирование строки ошибок для contactsFormView
  contactsFormView.valid = !email && !phone;
  const contactsFormErrors = [];
  if (email) {
    contactsFormErrors.push(email);
  }
  if (phone) {
    contactsFormErrors.push(phone);
  }
  contactsFormView.errors = contactsFormErrors.join('; ');
});

events.on('order:submit', () => {
  modalView.render({
    content: contactsFormView.render({
      email: '',
      phone: '',
      errors: [],
      valid: false
    })
  });
});

events.on('contacts:submit', () => {
  const order = buyerModel.getBuyerData();
  productApi.postOrderData(order)
  .then((res) => {
    cartModel.clearCart();
    cartView.clearCart();
    buyerModel.clearBuyerData();
    cartIconView.counter = cartModel.getItemNumber();
    const successModalView = new SuccessModal(cloneTemplate(successTemplate), {
      onClick: () => modalView.close()
    });
    modalView.render({
      content: successModalView.render({
        text: res.total
      })
    });
  })
  .catch((error) => {
    console.log(error);
  });
});

loadProducts();
