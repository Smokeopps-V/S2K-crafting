const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const quickFilterButtons = Array.from(document.querySelectorAll(".chip"));
const resultCount = document.getElementById("resultCount");
const popupElement = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupLevel = document.getElementById("popupLevel");
const popupXP = document.getElementById("popupXP");
const popupStopXP = document.getElementById("popupStopXP");
const popupBP = document.getElementById("popupBP");
const popupMaterials = document.getElementById("popupMaterials");
const closePopupBtn = document.getElementById("closePopupBtn");

let lastFocusedCard = null;
let currentCategory = categorySelect ? categorySelect.value : "all";

function hasRequiredDom() {
  return Boolean(itemList && searchInput);
}

function formatMaterialLabel(materialKey) {
  return materialKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toUpperCase();
}

function normalizeLookupKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function materialKeyToText(materialKey) {
  return String(materialKey || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
}

function sortMaterialEntries(materials) {
  return Object.entries(materials || {}).sort((a, b) => {
    const amountA = Number(a[1]);
    const amountB = Number(b[1]);

    if (amountA === amountB) {
      return a[0].localeCompare(b[0]);
    }

    return amountB - amountA;
  });
}

function buildItemLookup(items) {
  const lookup = new Map();

  items.forEach(item => {
    const normalizedName = normalizeLookupKey(item.name);
    if (normalizedName) {
      lookup.set(normalizedName, item);
    }
  });

  return lookup;
}

function findCraftableItem(materialKey, itemLookup) {
  const candidates = [
    normalizeLookupKey(materialKey),
    normalizeLookupKey(materialKeyToText(materialKey))
  ];

  for (const key of candidates) {
    if (itemLookup.has(key)) {
      return itemLookup.get(key);
    }
  }

  return null;
}

function renderMaterialTree(options) {
  const {
    container,
    materials,
    itemLookup,
    depth = 0,
    multiplier = 1,
    ancestry = new Set(),
    maxDepth = 4
  } = options;

  const materialEntries = sortMaterialEntries(materials);
  materialEntries.forEach(([material, amount]) => {
    const row = document.createElement("div");
    row.className = "material-row";
    row.style.setProperty("--depth", String(depth));
    if (depth > 0) {
      row.classList.add("is-nested");
    }

    const materialName = document.createElement("span");
    materialName.textContent = formatMaterialLabel(material);

    const numericAmount = Number(amount);
    const scaledAmount = Number.isFinite(numericAmount) ? numericAmount * multiplier : amount;
    const materialAmount = document.createElement("span");
    materialAmount.textContent = String(scaledAmount);

    row.appendChild(materialName);
    row.appendChild(materialAmount);
    container.appendChild(row);

    if (depth >= maxDepth) {
      return;
    }

    const childItem = findCraftableItem(material, itemLookup);
    if (!childItem || !childItem.materials) {
      return;
    }

    const childId = normalizeLookupKey(childItem.name);
    if (ancestry.has(childId)) {
      return;
    }

    const childRows = sortMaterialEntries(childItem.materials);
    if (childRows.length === 0) {
      return;
    }

    row.classList.add("is-craftable");

    const childContainer = document.createElement("div");
    childContainer.className = "material-children";

    const nextAncestry = new Set(ancestry);
    nextAncestry.add(childId);

    renderMaterialTree({
      container: childContainer,
      materials: childItem.materials,
      itemLookup,
      depth: depth + 1,
      multiplier: Number.isFinite(numericAmount) ? scaledAmount : multiplier,
      ancestry: nextAncestry,
      maxDepth
    });

    container.appendChild(childContainer);
  });
}

function getItems() {
  if (typeof CONFIG_ITEMS === "undefined" || !Array.isArray(CONFIG_ITEMS)) {
    console.error("CONFIG_ITEMS is missing or invalid.");
    return [];
  }

  return CONFIG_ITEMS;
}

function renderEmptyState(message) {
  if (!itemList) {
    return;
  }

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
  if (!resultCount) {
    return;
  }

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
  if (!hasRequiredDom()) {
    console.error("Missing required DOM nodes for rendering.");
    return;
  }

  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect ? categorySelect.value : currentCategory;
  const items = getItems();

  itemList.innerHTML = "";

  if (items.length === 0) {
    updateResultCount(0, selectedCategory);
    setActiveQuickFilter(selectedCategory);
    renderEmptyState("No recipes loaded. Check config.js for errors, then hard refresh (Ctrl+F5).");
    return;
  }

  let filteredItems = [];
  try {
    filteredItems = items.filter(
      item =>
        String(item.name || "").toLowerCase().includes(searchValue) &&
        (selectedCategory === "all" || item.category === selectedCategory)
    );
  } catch (error) {
    console.error("Failed to filter items:", error);
    renderEmptyState("Config loaded, but filtering failed. Check console for details.");
    return;
  }

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
  if (!popupElement || !popupTitle || !popupLevel || !popupXP || !popupStopXP || !popupBP || !popupMaterials || !closePopupBtn) {
    return;
  }

  popupTitle.textContent = item.name;
  popupLevel.textContent = `Level ${item.levelRequired}+`;
  popupXP.textContent = `XP ${Number(item.xp) || 0}`;
  popupStopXP.textContent = `Stop XP ${Number(item.stopLevel) || 0}`;
  popupBP.textContent = item.blueprintRequired ? "Blueprint required" : "No blueprint needed";

  popupMaterials.innerHTML = "";
  const materialEntries = sortMaterialEntries(item.materials);

  if (materialEntries.length === 0) {
    const row = document.createElement("div");
    row.className = "material-row empty-materials";
    row.textContent = "No materials configured for this item.";
    popupMaterials.appendChild(row);
  } else {
    const itemLookup = buildItemLookup(getItems());
    renderMaterialTree({
      container: popupMaterials,
      materials: item.materials,
      itemLookup,
      depth: 0,
      multiplier: 1,
      ancestry: new Set([normalizeLookupKey(item.name)])
    });
  }

  popupElement.classList.remove("hidden");
  document.body.classList.add("no-scroll");
  closePopupBtn.focus();
}

function closePopup() {
  if (!popupElement) {
    return;
  }

  popupElement.classList.add("hidden");
  document.body.classList.remove("no-scroll");

  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

if (itemList) {
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
}

quickFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category || "all";
    if (categorySelect) {
      categorySelect.value = currentCategory;
    }
    renderItems();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderItems);
}

if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    currentCategory = categorySelect.value || "all";
    renderItems();
  });
}

if (closePopupBtn) {
  closePopupBtn.addEventListener("click", closePopup);
}

if (popupElement) {
  popupElement.addEventListener("click", event => {
    if (event.target === popupElement) {
      closePopup();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !popupElement.classList.contains("hidden")) {
    closePopup();
  }
});

if (hasRequiredDom()) {
  try {
    renderItems();
  } catch (error) {
    console.error("Initial render failed:", error);
    renderEmptyState("Initial render failed. Open browser console for error details.");
  }
}
