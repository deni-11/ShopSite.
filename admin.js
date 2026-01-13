const STORAGE_KEY = "sa_product_extra_v1";
const DEFAULT_MAX_ID = 32;

function getNextId() {
  const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // Максимальный id среди уже сохранённых "дополнительных" товаров
  const maxExtraId = products.length
    ? Math.max(...products.map(p => Number(p.id) || 0))
    : 0;

  // Берём максимум между базовой верхней границей и уже использованными extra-id
  const maxId = Math.max(DEFAULT_MAX_ID, maxExtraId);

  return maxId + 1;
}

let products = loadProducts();
let editingId = null;

//------------------ STORAGE ------------------//
function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Ошибка чтения extras из localStorage:', e);
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  renderTable();
}

//------------------ UI ELEMENTS ------------------//
const inputs = {
  title: document.getElementById("pTitle"),
  price: document.getElementById("pPrice"),
  rating: document.getElementById("pRating"),
  image: document.getElementById("pImage"),
  icon: document.getElementById("pIcon"),
  freeDelivery: document.getElementById("pFreeDelivery"),
  inStock: document.getElementById("pInStock")
};

// Все чекбоксы категорий
const categoryCheckboxes = Array.from(
  document.querySelectorAll('input[name="pCategory"]')
);

//------------------ FORM HANDLING ------------------//
function clearForm() {
  editingId = null;

  // Очищаем все обычные поля
  Object.values(inputs).forEach(el => {
    if (el.type === "checkbox") el.checked = false;
    else el.value = "";
  });

  // Снимаем все категории
  categoryCheckboxes.forEach(cb => cb.checked = false);
}

function fillForm(product) {
  editingId = product.id;

  inputs.title.value = product.title;
  inputs.price.value = product.price;
  inputs.rating.value = product.rating;
  inputs.image.value = product.image || "";
  inputs.icon.value = product.icon || "";
  inputs.freeDelivery.checked = !!product.freeDelivery;
  inputs.inStock.checked = !!product.inStock;

  // Восстанавливаем выбранные категории
  const cats = Array.isArray(product.categories)
    ? product.categories
    : (product.category ? [product.category] : []);

  categoryCheckboxes.forEach(cb => {
    cb.checked = cats.includes(cb.value);
  });
}

//------------------ SAVE PRODUCT ------------------//
document.getElementById("saveProduct").onclick = () => {
  // Собираем выбранные категории из чекбоксов
  const selectedCategories = categoryCheckboxes
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const p = {
    id: editingId === null ? getNextId() : editingId,
    title: inputs.title.value,
    price: Number(inputs.price.value),
    categories: selectedCategories, // массив категорий
    rating: Number(inputs.rating.value),
    image: inputs.image.value,
    icon: inputs.icon.value,
    freeDelivery: inputs.freeDelivery.checked,
    inStock: inputs.inStock.checked
  };

  if (!p.title) {
    alert("Title is required!");
    return;
  }

  if (editingId === null) {
    products.push(p);
  } else {
    const index = products.findIndex(x => x.id === editingId);
    products[index] = p;
  }

  saveProducts();
  clearForm();
};

document.getElementById("resetForm").onclick = clearForm;

//------------------ TABLE ------------------//
function renderTable() {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";

  products.forEach(prod => {
    const tr = document.createElement("tr");

    const cats = Array.isArray(prod.categories)
      ? prod.categories.join(", ")
      : (prod.category || "");

    tr.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.icon || ""} ${prod.title}</td>
      <td>${prod.price}€</td>
      <td>${cats}</td>
      <td><button class="secondary editBtn">Edit</button></td>
      <td><button class="secondary deleteBtn">Delete</button></td>
    `;

    tr.querySelector(".editBtn").onclick = () => fillForm(prod);
    tr.querySelector(".deleteBtn").onclick = () => {
      products = products.filter(x => x.id !== prod.id);
      saveProducts();
    };

    tbody.appendChild(tr);
  });
}

renderTable();

//------------------ SEARCH ------------------//
document.getElementById("searchInput").oninput = e => {
  const q = e.target.value.toLowerCase();

  const rows = document.querySelectorAll("#productTable tbody tr");
  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(q) ? "" : "none";
  });
};

//------------------ IMPORT / EXPORT ------------------//
document.getElementById("exportJson").onclick = () => {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "products.json";
  a.click();
};

document.getElementById("importJson").onclick = () => {
  document.getElementById("jsonFileInput").click();
};

document.getElementById("jsonFileInput").onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    products = JSON.parse(reader.result);
    saveProducts();
  };
  reader.readAsText(file);
};

//------------------ DEMO PRODUCTS ------------------//
document.getElementById("loadDemo").onclick = () => {
  products = [
    { id: 1001, title: "Demo Phone", price: 399, categories: ["electronics"], rating: 5, image: "", icon: "📱", freeDelivery: true, inStock: true },
    { id: 1002, title: "Beauty Kit", price: 29, categories: ["beauty"], rating: 4, image: "", icon: "💄", freeDelivery: false, inStock: true }
  ];
  saveProducts();
};
