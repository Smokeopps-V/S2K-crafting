const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const quickFilterButtons = Array.from(document.querySelectorAll(".chip"));
const resultCount = document.getElementById("resultCount");
const popupElement = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupLevel = document.getElementById("popupLevel");
const popupBP = document.getElementById("popupBP");
const popupMaterials = document.getElementById("popupMaterials");
const closePopupBtn = document.getElementById("closePopupBtn");

let lastFocusedCard = null;
let currentCategory = "all";

function formatMaterialLabel(materialKey) {
  return materialKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toUpperCase();
}

function getItems() {
  if (typeof CONFIG_ITEMS === "undefined" || !Array.isArray(CONFIG_ITEMS)) {
    console.error("CONFIG_ITEMS is missing or invalid.");
    return [];
  }

  return CONFIG_ITEMS;
}

function renderEmptyState(message) {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.textContent = message;
  itemList.appendChild(emptyState);
}

function getCategoryLabel(category) {
  if (category === "all") {
    return "All items";
  }

  return `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

function updateResultCount(count, category) {
  const itemLabel = count === 1 ? "item" : "items";
  resultCount.textContent = `${count} ${itemLabel} shown in ${getCategoryLabel(category)}`;
}

function setActiveQuickFilter(category) {
  quickFilterButtons.forEach(button => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function renderItems() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = currentCategory;
  const items = getItems();

  itemList.innerHTML = "";

  if (items.length === 0) {
    updateResultCount(0, selectedCategory);
    setActiveQuickFilter(selectedCategory);
    renderEmptyState("No recipes loaded. Check config.js for errors, then hard refresh (Ctrl+F5).");
    return;
  }

  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(searchValue) &&
      (selectedCategory === "all" || item.category === selectedCategory)
  );

  itemList.dataset.currentItems = JSON.stringify(filteredItems);
  updateResultCount(filteredItems.length, selectedCategory);
  setActiveQuickFilter(selectedCategory);

  if (filteredItems.length === 0) {
    renderEmptyState("No items found for your current filters.");
    return;
  }

  filteredItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "item-card";
    card.dataset.itemIndex = String(index);
    card.innerHTML = `
      <h3 class="item-card-title">${item.name}</h3>
      <div class="item-card-meta">
        <span>Level ${item.levelRequired}+</span>
        <span class="card-badge">${item.category}</span>
      </div>
    `;
    itemList.appendChild(card);
  });
}

function openPopup(item) {
  popupTitle.textContent = item.name;
  popupLevel.textContent = `Level ${item.levelRequired}+`;
  popupBP.textContent = item.blueprintRequired ? "Blueprint required" : "No blueprint needed";

  popupMaterials.innerHTML = "";

  const materialEntries = Object.entries(item.materials || {}).sort((a, b) => {
    const amountA = Number(a[1]);
    const amountB = Number(b[1]);

    if (amountA === amountB) {
      return a[0].localeCompare(b[0]);
    }

    return amountB - amountA;
  });

  if (materialEntries.length === 0) {
    const row = document.createElement("div");
    row.className = "material-row empty-materials";
    row.textContent = "No materials configured for this item.";
    popupMaterials.appendChild(row);
  } else {
    materialEntries.forEach(([material, amount]) => {
      const row = document.createElement("div");
      row.className = "material-row";

      const materialName = document.createElement("span");
      materialName.textContent = formatMaterialLabel(material);

      const materialAmount = document.createElement("span");
      materialAmount.textContent = String(amount);

      row.appendChild(materialName);
      row.appendChild(materialAmount);
      popupMaterials.appendChild(row);
    });
  }

  popupElement.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  closePopupBtn.focus();
}

function closePopup() {
  popupElement.classList.add("hidden");
  document.body.classList.remove("no-scroll");

  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

itemList.addEventListener("click", event => {
  const button = event.target.closest(".item-card");
  if (!button) {
    return;
  }

  const currentItems = JSON.parse(itemList.dataset.currentItems || "[]");
  const selectedItem = currentItems[Number(button.dataset.itemIndex)];
  lastFocusedCard = button;

  if (selectedItem) {
    openPopup(selectedItem);
  }
});

quickFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category || "all";
    renderItems();
  });
});

searchInput.addEventListener("input", renderItems);
closePopupBtn.addEventListener("click", closePopup);

popupElement.addEventListener("click", event => {
  if (event.target === popupElement) {
    closePopup();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !popupElement.classList.contains("hidden")) {
    closePopup();
  }
});

renderItems();
