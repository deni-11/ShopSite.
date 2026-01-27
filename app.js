// === PRODUCT DATA ===

const defaultProductData = [
  { id: 1, title: "Смартфон X100 Pro 256ГБ", price: 899, icon: "📱", image: "phone.png", freeDelivery: true, inStock: true, rating: 5, categories: ["electronics","trends"] },
  { id: 2, title: "Наушники ANC Ultra", price: 149, icon: "🎧", image: "headphones.png", freeDelivery: false, inStock: true, rating: 4,categories: ["electronics"]   },
  { id: 3, title: "Кроссовки Air Max", price: 119, icon: "👟", image: "shoes.png", freeDelivery: true, inStock: true, rating: 3, categories: ["fashion"] },
  { id: 4, title: "Кепка Classic Snapback", price: 29, icon: "🧢", image: "cap.png", freeDelivery: true, inStock: true, rating: 4, categories: ["fashion"] },
  { id: 5, title: "Ноутбук UltraBook 15", price: 1299,icon: "💻", image: "laptop.png", freeDelivery: true, inStock: true, rating: 5, categories: ["electronics","trends"] },
  { id: 6, title: "Сумка Messenger Leather", price: 89, icon: "🎒", image: "bag.png", freeDelivery: false, inStock: true, rating: 4, categories: ["fashion","home"] },
  { id: 7, title: "Сковорода 28 см Pro", price: 39, icon: "🍳", image: "pan.png", freeDelivery: false, inStock: true, rating: 4, categories: ["kitchen","home"] },
  { id: 8, title: "Геймпад Wireless S", price: 59, icon: "🎮", image: "gamepad.png", freeDelivery: false, inStock: true, rating: 5, categories: ["games","electronics"] },
  { id: 9, title: "Медвежонок Soft 40 см", price: 24, icon: "🧸", image: "bear.png", freeDelivery: true, inStock: false, rating: 4, categories: ["kids","home"] },
  { id:10, title: "Помада Velvet Matte", price: 18, icon: "💄", image: "pomade.png", freeDelivery: false, inStock: true, rating: 5, categories: ["beauty","trends"] },
  { id:11, title: "Дрель Hammer 500W", price: 79, icon: "⚙️", image: "drill.png", freeDelivery: true, inStock: true, rating: 3, categories: ["tools","home"] },
  { id:12, title: "Велосипед Gravel 700C", price: 899, icon: "🚲", image: "bike.png", freeDelivery: false, inStock: true, rating: 5, categories: ["sport","trends"] },
  { id: 21, title: "Набор кистей Luxury 12шт", price: 45, icon: "💄", image: "brushes.png", freeDelivery: true, inStock: true, rating: 5, categories: ["beauty"] },
  { id: 22, title: "Фен ProDry 2000W", price: 89, icon: "💇", image: "hairdryer.png",freeDelivery: false, inStock: true, rating: 4, categories: ["beauty", "electronics"] },
  { id: 23, title: "Беспроводной PowerBank 20K", price: 49, icon: "🔋", image: "powerbank.png",freeDelivery: true, inStock: true, rating: 5, categories: ["electronics"] },
  { id: 24, title: "4K Вебкамера StreamPro", price: 120, icon: "🎥", image: "webcam.png",  freeDelivery: true, inStock: false, rating: 4, categories: ["electronics"] },
  { id: 25, title: "Блендер TurboMix 800W", price: 70, icon: "🥤", image: "blender.png", freeDelivery: true, inStock: true, rating: 4, categories: ["kitchen","home"] },
  { id: 26, title: "Набор ножей ChefMaster", price: 95, icon: "🔪", image: "knives.png",  freeDelivery: false, inStock: true, rating: 5, categories: ["kitchen"] },
  { id: 27, title: "Робот-пылесос CleanBot X", price: 250, icon: "🤖", image: "vacuum.png",  freeDelivery: true, inStock: true, rating: 5, categories: ["home","electronics"] },
  { id: 28, title: "Арома-диффузор Zen Air", price: 30, icon: "🕯️", image: "diffuser.png", freeDelivery: false, inStock: true, rating: 4, categories: ["home"] },
  { id: 29, title: "Кроссовки Urban Flex", price: 110, icon: "👟", image: "sneakers.png", freeDelivery: true, inStock: false, rating: 5, categories: ["fashion"] },
  { id: 30, title: "Рюкзак TravelLite 35L", price: 75, icon: "🎒", image: "backpack.png", freeDelivery: true, inStock: true, rating: 4, categories: ["fashion"] },
  { id: 31, title: "Радиоуправляемая машинка X-Racer", price: 60, icon: "🚗", image: "car.png", freeDelivery: false, inStock: true, rating: 5, categories: ["games","kids"] },
  { id: 32, title: "Плюшевый мишка DreamBear 40 см", price: 25, icon: "🧸", image: "teddy.png",freeDelivery: true, inStock: true, rating: 5, categories: ["kids"] }
];

const EXTRA_STORAGE_KEY = 'sa_product_extra_v1';
const OLD_AGGREGATE_KEY = 'sa_product_data'; // для миграции старых данных

function loadProductDataFromStorage() {
  try {
    // 1) Пытаемся прочитать extras из нового ключа
    let rawExtra = localStorage.getItem(EXTRA_STORAGE_KEY);

    // 2) Если extras пока нет, пробуем мигрировать из старого sa_product_data (если ты уже что-то там сохранял)
    if (!rawExtra) {
      const old = localStorage.getItem(OLD_AGGREGATE_KEY);
      if (old) {
        // Старый формат мог содержать и базу, и кастомные товары.
        // Берём только те, у которых id не совпадает с defaultProductData.
        const parsedOld = JSON.parse(old);
        const defaultIds = new Set(defaultProductData.map(p => p.id));
        const migratedExtras = Array.isArray(parsedOld)
          ? parsedOld.filter(p => p && !defaultIds.has(p.id))
          : [];

        if (migratedExtras.length > 0) {
          localStorage.setItem(EXTRA_STORAGE_KEY, JSON.stringify(migratedExtras));
          rawExtra = JSON.stringify(migratedExtras);
        }
      }
    }

    const extras = rawExtra ? JSON.parse(rawExtra) : [];

    const validExtras = Array.isArray(extras)
      ? extras
          .filter(p => p && typeof p.id === 'number')
          .map(p => ({
            ...p,
            // подчищаем структуру — чтобы точно была categories как массив
            categories: Array.isArray(p.categories)
              ? p.categories
              : (p.category ? [p.category] : []),
          }))
      : [];

    const defaultIds = new Set(defaultProductData.map(p => p.id));
    const filteredExtras = validExtras.filter(p => !defaultIds.has(p.id));

    return [...defaultProductData, ...filteredExtras];
  } catch (e) {
    console.error('Ошибка при работе с localStorage (products):', e);
    return defaultProductData;
  }
}

let productData = loadProductDataFromStorage();

window.addEventListener('storage', (e) => {
  // Нас интересуют изменения «дополнительных» товаров
  if (e.key === EXTRA_STORAGE_KEY) {
    productData = loadProductDataFromStorage();
    applyFilters(); // перерисуем товары с учётом новых данных
  }
});

// === UTILS / STATE ===
const EUR = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const STORAGE_KEY = 'sa_cart_v1';

// >>> ПАГИНАЦИЯ: Добавлено
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
// <<< ПАГИНАЦИЯ: Конец добавления

const productsContainer = document.querySelector('.products');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const badge = document.querySelector('.badge');
const paginationControls = document.getElementById('paginationControls'); // Добавлено

let cart = []; // [{id,title,price,img,icon,qty}]

// === RENDER PRODUCTS ===
function productThumb(p) {
  if (p.image) {
    return `<img src="images/${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`;
  }
  return `<span aria-hidden="true">${p.icon}</span>`;
}

function renderProducts(list) {
  productsContainer.innerHTML = "";
  
  // >>> ПАГИНАЦИЯ: Логика вывода товаров для текущей страницы
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedList = list.slice(start, end);

  paginatedList.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.dataset.id = String(p.id);

    if (p.freeDelivery) card.dataset.free = "1";
    if (p.inStock)      card.dataset.stock = "1";
    if (p.rating >= 4)  card.dataset.rating4 = "1";

    card.innerHTML = `
      <div class="thumb">${productThumb(p)}</div>
      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="price">${EUR.format(p.price)}</div>
        <button class="add" ${p.inStock ? "" : "disabled"}>
          ${p.inStock ? "➕ В корзину" : "Нет в наличии"}
        </button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
  
  if (paginatedList.length > 0) {
    // Прокрутка к началу списка товаров при смене страницы/фильтров
    window.scrollTo({ top: productsContainer.offsetTop - 150, behavior: 'smooth' });
  }
}

// renderProducts(productData); // УДАЛИТЬ: рендеринг теперь управляется applyFilters

// === LOGO SCROLL TO TOP ===
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === CART: helpers ===
function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    // легкая валидация
    if (Array.isArray(parsed)) {
      cart = parsed
        .filter(x => x && typeof x.id === 'number' && typeof x.qty === 'number' && x.qty > 0)
        .map(x => ({
          id: x.id,
          title: String(x.title ?? ''),
          price: Number(x.price ?? 0),
          // ИЗМЕНЕНО: теперь item.img хранит имя файла, а не полный путь
          img: x.img ?? null,
          icon: x.icon ?? "🛍️",
          qty: Math.max(1, Math.floor(x.qty))
        }));
    }
  } catch {}
}

function recalcBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (count > 0) {
    badge.textContent = String(count);
    badge.style.display = 'inline-block';
    badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  } else {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
}

function renderCart() {
  cartItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = String(item.id);

    // ИЗМЕНЕНО: формируем путь к изображению из имени файла (item.img)
    const imgHtml = item.img
      ? `<img src="images/${item.img}" alt="${item.title}">`
      : `<div class="cart-icon-fallback">${item.icon ?? "🛍️"}</div>`;

    div.innerHTML = `
      ${imgHtml}
      <div class="cart-mid">
        <h4>${item.title}</h4>
        <div class="qty-controls" role="group" aria-label="Количество">
          <button class="qty-btn dec" aria-label="Уменьшить">−</button>
          <span class="qty-val" aria-live="polite">${item.qty}</span>
          <button class="qty-btn inc" aria-label="Увеличить">+</button>
        </div>
      </div>
      <div class="cart-right">
        <strong>${EUR.format(item.price * item.qty)}</strong>
        <button class="remove-btn" title="Удалить" aria-label="Удалить товар">✕</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  subtotalEl.textContent = EUR.format(subtotal);
  recalcBadge();
  saveCart();
}

// === ADD TO CART (делегирование на .products) ===
productsContainer.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;

  const id = Number(card.dataset.id);
  const product = productData.find(p => p.id === id);
  if (!product) return;

  // 🟢 1. ADD TO CART
  if (e.target.closest('.add')) {
    if (!product.inStock) return;

    const existing = cart.find(it => it.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.image ?? null,
        icon: product.icon,
        qty: 1
      });
    }

    renderCart();
    return; // ⛔ ВАЖНО: дальше не идём
  }

  // 🟢 2. OPEN PRODUCT PANEL
  openProductPanel(product);
});


// === CART PANEL TOGGLE ===
const cartBtn   = document.querySelector('.cart-btn');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');

if (cartBtn && cartPanel) {
  cartBtn.addEventListener('click', () => {
    cartPanel.classList.add('show');
    document.body.classList.add('cart-open');
  });
}
if (closeCart && cartPanel) {
  closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('show');
    document.body.classList.remove('cart-open');
  });
}

// === CART: +/- и удаление (делегирование на #cartItems) ===
cartItems.addEventListener('click', (e) => {
  const id = Number(e.target.closest('.cart-item')?.dataset.id);
  if (!id) return;

  if (e.target.closest('.inc')) {
    const it = cart.find(x => x.id === id);
    // ДОБАВЛЕНО: Проверка наличия
    const productInStock = productData.find(p => p.id === id)?.inStock;
    if (it && productInStock) { 
        it.qty += 1; 
        renderCart(); 
    }
    return;
  }
  if (e.target.closest('.dec')) {
    const it = cart.find(x => x.id === id);
    if (!it) return;
    it.qty -= 1;
    if (it.qty <= 0) {
      cart = cart.filter(x => x.id !== id);
    }
    renderCart();
    return;
  }
  if (e.target.closest('.remove-btn')) {
    cart = cart.filter(x => x.id !== id);
    renderCart();
    return;
  }
});

// === PRODUCT INFO PANEL ===
const productPanel   = document.getElementById('productPanel');
const productOverlay = document.getElementById('productOverlay');
const closeProduct   = document.getElementById('closeProduct');
const titleEl        = document.getElementById('productTitle');
const imgEl          = document.getElementById('productImage');
const priceEl        = document.getElementById('productPrice');
const stockEl        = document.getElementById('productStock');
const descEl         = document.getElementById('productDesc');

// Optional sample descriptions (you can expand later)
const descriptions = {
  1: "Мощный смартфон с камерой 108 Мп и батареей на 5000 мАч.",
  2: "Беспроводные наушники с активным шумоподавлением и 30 ч автономной работы.",
  3: "Удобные кроссовки для спорта и прогулок.",
  4: "Классическая кепка с регулировкой размера.",
  5: "Тонкий и производительный ноутбук с экраном 15 дюймов.",
  6: "Стильная кожаная сумка для города и путешествий.",
  7: "Профессиональная сковорода с антипригарным покрытием.",
  8: "Беспроводной геймпад для всех популярных платформ.",
  9: "Мягкий плюшевый мишка, лучший подарок для детей.",
  10:"Помада Velvet Matte — насыщенный цвет и мягкая текстура.",
  11:"Мощная дрель для любых бытовых задач.",
  12:"Легкий и быстрый велосипед для длительных поездок."
};

// Function to open panel
function openProductPanel(product) {
  titleEl.textContent = product.title;
  priceEl.textContent = EUR.format(product.price);
  stockEl.textContent = product.inStock ? "В наличии" : "Нет в наличии";
  descEl.textContent = descriptions[product.id] || "Описание товара скоро будет добавлено.";
  
  const imagePath = product.image ? `images/${product.image}` : null;
  if (imagePath) {
    imgEl.src = imagePath;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  productPanel.classList.add('show');
  productOverlay.classList.add('show');
  document.body.classList.add('cart-open');
}

// Function to close panel
function closeProductPanel() {
  productPanel.classList.remove('show');
  productOverlay.classList.remove('show');
  document.body.classList.remove('cart-open');
}

// Close events
closeProduct.addEventListener('click', closeProductPanel);
productOverlay.addEventListener('click', closeProductPanel);


// === PAGINATION RENDER ===
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  paginationControls.innerHTML = '';
  
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.className = 'page-btn';
    button.textContent = i;
    button.dataset.page = i;
    
    if (i === currentPage) {
      button.classList.add('active');
      button.setAttribute('aria-current', 'page');
    } else {
      button.tabIndex = 0;
    }

    paginationControls.appendChild(button);
  }
}

// Слушатель для кнопок пагинации (делегирование)
paginationControls.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn || btn.classList.contains('active')) return;

  const newPage = Number(btn.dataset.page);
  currentPage = newPage;
  applyFilters(e); // Перезапускаем фильтрацию/рендеринг для новой страницы
});


// === SEARCH + FILTERS ===
const searchInput = document.querySelector('.search input');
const searchBtn   = document.querySelector('.search button');

const [freeDelivery, inStock, rating4] = document.querySelectorAll('.filter-group input[type="checkbox"]');
const [minPriceInput, maxPriceInput]   = document.querySelectorAll('.price-input');

const noResultsMsg = document.createElement('div');
noResultsMsg.textContent = "Нет товаров по вашему запросу.";
noResultsMsg.style.padding = "20px";
noResultsMsg.style.textAlign = "center";
noResultsMsg.style.fontWeight = "700";
noResultsMsg.style.display = "none";
productsContainer.after(noResultsMsg);

// === CATEGORY FILTER ===
const categoryChips = document.querySelectorAll('.categories .chip');
let activeCategory = null; // ключ из data-cat или null = все

function setActiveCategory(key, clickedBtn) {
  if (activeCategory === key) {
    // повторный клик — снимаем фильтр
    activeCategory = null;
  } else {
    activeCategory = key;
  }
  // визуально отметить выбранный чип
  categoryChips.forEach(btn => {
    const isActive = activeCategory && btn.dataset.cat === activeCategory;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  applyFilters(); // пересчёт с учётом категории
}

categoryChips.forEach(btn => {
  btn.addEventListener('click', () => setActiveCategory(btn.dataset.cat, btn));
});


function applyFilters(event) {
    // Если вызов не связан с кнопкой пагинации, сбрасываем страницу на 1
    if (!event || !event.target.closest('.page-btn')) {
        currentPage = 1;
    }

    const q = searchInput.value.trim().toLowerCase();
    const minPrice = Number(minPriceInput.value) || 0;
    const maxPrice = Number(maxPriceInput.value) || Infinity;

    const filtered = productData.filter(p => {
      if (activeCategory && !p.categories?.includes(activeCategory)) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (freeDelivery.checked && !p.freeDelivery) return false;
      if (inStock.checked && !p.inStock) return false;
      if (rating4.checked && p.rating < 4) return false;
      return true;
    });

    // Отрисовка товаров на текущей странице и создание кнопок пагинации
    renderProducts(filtered);
    renderPagination(filtered.length);

    noResultsMsg.style.display = filtered.length === 0 ? "block" : "none";
}

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const confirmOrder = document.getElementById("confirmOrder");

checkoutBtn.addEventListener("click", () => {
  if (!cart.length) {
    alert("Корзина пуста");
    return;
  }

  cartPanel.classList.remove('show'); // ← ВАЖНО
  checkoutOverlay.classList.add("open");
});


closeCheckout.addEventListener("click", () => {
  checkoutOverlay.classList.remove("open");
  document.body.classList.remove("cart-open");
});

confirmOrder.addEventListener("click", () => {
  const order = {
    paymentMethod: document.getElementById("paymentMethod").value,
    deliveryMethod: document.getElementById("deliveryMethod").value,
    address: document.getElementById("address").value,
    name: document.getElementById("customerName").value,
    phone: document.getElementById("phone").value,
    cart: cart
  };

  if (!order.name || !order.phone || !order.address) {
    alert("Заполните все поля");
    return;
  }

  console.log("Заказ оформлен:", order);

  alert("Заказ оформлен успешно!");
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

searchInput.addEventListener('input', applyFilters); // Изменил на 'input' для моментальной реакции
searchBtn.addEventListener('click', applyFilters);
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });
[minPriceInput, maxPriceInput, freeDelivery, inStock, rating4].forEach(el => {
  el.addEventListener('input', applyFilters);
});

// === INIT: грузим корзину из localStorage и отрисовываем ===
loadCart();
renderCart();
applyFilters(); // Инициализируем первый рендеринг товаров
