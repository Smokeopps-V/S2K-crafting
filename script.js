const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const quickFilterButtons = Array.from(document.querySelectorAll(".chip"));
const resultCount = document.getElementById("resultCount");
const planItemsElement = document.getElementById("planItems");
const planMaterialsElement = document.getElementById("planMaterials");
const planTotalMatsElement = document.getElementById("planTotalMats");
const planTitaniumTotalElement = document.getElementById("planTitaniumTotal");
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

function getCraftPlan() {
  if (typeof CONFIG_CRAFT_PLAN === "undefined") {
    return [];
  }

  if (!Array.isArray(CONFIG_CRAFT_PLAN)) {
    console.error("CONFIG_CRAFT_PLAN must be an array.");
    return [];
  }

  return CONFIG_CRAFT_PLAN;
}

function renderPlanMessage(message) {
  planItemsElement.innerHTML = "";
  planMaterialsElement.innerHTML = "";
  planTotalMatsElement.textContent = "";
  planTitaniumTotalElement.textContent = "";

  const row = document.createElement("div");
  row.className = "empty-state";
  row.textContent = message;
  planItemsElement.appendChild(row);
}

function createPlanRow(label, value) {
  const row = document.createElement("div");
  row.className = "plan-row";

  const left = document.createElement("span");
  left.textContent = label;

  const right = document.createElement("strong");
  right.textContent = value;

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

function renderCraftPlan(items) {
  const craftPlan = getCraftPlan();

  if (craftPlan.length === 0) {
    renderPlanMessage("No craft plan set. Add entries to CONFIG_CRAFT_PLAN in config.js.");
    return;
  }

  const itemLookup = new Map(items.map(item => [item.name.toLowerCase(), item]));
  const normalizedPlan = [];

  craftPlan.forEach(entry => {
    const itemName = String(entry.item || entry.name || "").trim();
    const quantity = Number(entry.quantity);

    if (!itemName || !Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    const itemData = itemLookup.get(itemName.toLowerCase());
    if (!itemData) {
      return;
    }

    normalizedPlan.push({ item: itemData, quantity });
  });

  if (normalizedPlan.length === 0) {
    renderPlanMessage("Craft plan has no valid items. Check item names and quantities.");
    return;
  }

  planItemsElement.innerHTML = "";
  planMaterialsElement.innerHTML = "";

  const totalMaterials = {};

  normalizedPlan.forEach(({ item, quantity }) => {
    planItemsElement.appendChild(createPlanRow(item.name, `x${quantity}`));

    Object.entries(item.materials || {}).forEach(([material, amount]) => {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount < 0) {
        return;
      }

      totalMaterials[material] = (totalMaterials[material] || 0) + numericAmount * quantity;
    });
  });

  const sortedMaterials = Object.entries(totalMaterials).sort((a, b) => {
    if (a[1] === b[1]) {
      return a[0].localeCompare(b[0]);
    }

    return b[1] - a[1];
  });

  if (sortedMaterials.length === 0) {
    planMaterialsElement.appendChild(createPlanRow("No materials", "0"));
  } else {
    sortedMaterials.forEach(([material, amount]) => {
      planMaterialsElement.appendChild(createPlanRow(material.toUpperCase(), String(amount)));
    });
  }

  const totalMatsCount = sortedMaterials.reduce((sum, [, amount]) => sum + amount, 0);
  const titaniumEntry = sortedMaterials.find(([material]) => material.toLowerCase() === "titanium");
  const titaniumTotal = titaniumEntry ? titaniumEntry[1] : 0;

  planTotalMatsElement.textContent = `Total mats: ${totalMatsCount}`;
  planTitaniumTotalElement.textContent = `Total titanium: ${titaniumTotal}`;
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
  const selectedCategory = categorySelect.value;
  const items = getItems();

  renderCraftPlan(items);

  itemList.innerHTML = "";

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

quickFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    categorySelect.value = category;
    renderItems();
  });
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
