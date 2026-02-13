const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const popupElement = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupLevel = document.getElementById("popupLevel");
const popupBP = document.getElementById("popupBP");
const popupMaterials = document.getElementById("popupMaterials");
const closePopupBtn = document.getElementById("closePopupBtn");

let lastFocusedCard = null;

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

function renderItems() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;
  const items = getItems();

  itemList.innerHTML = "";

  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(searchValue) &&
      (selectedCategory === "all" || item.category === selectedCategory)
  );

  itemList.dataset.currentItems = JSON.stringify(filteredItems);

  if (filteredItems.length === 0) {
    renderEmptyState("No items found for your current filters.");
    return;
  }

  filteredItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "item-card";
    card.textContent = item.name;
    card.dataset.itemIndex = String(index);
    itemList.appendChild(card);
  });
}

function openPopup(item) {
  popupTitle.textContent = item.name;
  popupLevel.textContent = `Level Required: ${item.levelRequired}`;
  popupBP.textContent = `Blueprint Required: ${item.blueprintRequired ? "Yes" : "No"}`;

  popupMaterials.innerHTML = "";

  const materialEntries = Object.entries(item.materials || {});

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
      materialName.textContent = material.toUpperCase();

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

searchInput.addEventListener("input", renderItems);
categorySelect.addEventListener("change", renderItems);
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
