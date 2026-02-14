const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sortBy");
const blueprintOnlyBtn = document.getElementById("blueprintOnlyBtn");
const quickFilterButtons = Array.from(document.querySelectorAll(".chip"));
const resultCount = document.getElementById("resultCount");
const popupElement = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupLevel = document.getElementById("popupLevel");
const popupXP = document.getElementById("popupXP");
const popupStopXP = document.getElementById("popupStopXP");
const popupBP = document.getElementById("popupBP");
const popupMaterialsHint = document.getElementById("popupMaterialsHint");
const popupCraftQty = document.getElementById("popupCraftQty");
const popupMaterialTotals = document.getElementById("popupMaterialTotals");
const popupMaterials = document.getElementById("popupMaterials");
const addToListBtn = document.getElementById("addToListBtn");
const copyMaterialsBtn = document.getElementById("copyMaterialsBtn");
const copyFeedback = document.getElementById("copyFeedback");
const closePopupBtn = document.getElementById("closePopupBtn");
const shoppingSummary = document.getElementById("shoppingSummary");
const shoppingItemsContainer = document.getElementById("shoppingItems");
const shoppingTotalsSummary = document.getElementById("shoppingTotalsSummary");
const shoppingTotalsContainer = document.getElementById("shoppingTotals");
const clearShoppingBtn = document.getElementById("clearShoppingBtn");

let lastFocusedCard = null;
let currentCategory = categorySelect ? categorySelect.value : "all";
let currentPopupItem = null;
let blueprintOnly = false;
let shoppingList = [];
let ownedStock = {};
const SHOPPING_STORAGE_KEY = "s2kShoppingList";
const OWNED_STOCK_STORAGE_KEY = "s2kOwnedStock";
const MATERIAL_KEY_ALIASES = {
  alum: "aluminium",
  aluminum: "aluminium"
};
const TOTAL_MATS_EXCLUDED_KEYS = new Set([
  "titanium",
  "powersupply",
  "brokenusb",
  "circuitboard",
  "controlchip",
  "radio",
  "brokentablet",
  "brokenlaptop",
  "smgbarrel",
  "smgextractor",
  "smgmag",
  "shotgunparts",
  "guntrigger",
  "boltassembly",
  "metalspring"
]);

function setBlueprintOnlyState(isEnabled) {
  blueprintOnly = Boolean(isEnabled);
  if (!blueprintOnlyBtn) {
    return;
  }

  blueprintOnlyBtn.classList.toggle("is-active", blueprintOnly);
  blueprintOnlyBtn.setAttribute("aria-pressed", blueprintOnly ? "true" : "false");
}

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

function canonicalMaterialKey(materialKey) {
  const raw = String(materialKey || "").trim();
  const normalized = normalizeLookupKey(raw);
  const canonical = MATERIAL_KEY_ALIASES[normalized];
  return canonical || raw;
}

function readStorageJSON(key, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}":`, error);
    return fallbackValue;
  }
}

function writeStorageJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}":`, error);
  }
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

function getCraftQuantity() {
  const rawValue = Number(popupCraftQty ? popupCraftQty.value : 1);
  if (!Number.isFinite(rawValue)) {
    return 1;
  }

  return Math.max(1, Math.floor(rawValue));
}

function shouldExcludeFromTotal(materialKey) {
  const normalizedKey = normalizeLookupKey(canonicalMaterialKey(materialKey));
  return (
    TOTAL_MATS_EXCLUDED_KEYS.has(normalizedKey) ||
    normalizedKey.startsWith("pistol") ||
    normalizedKey.startsWith("ak")
  );
}

function collectRawMaterialsRecursive(options) {
  const {
    materials,
    multiplier,
    itemLookup,
    bucket,
    excludeMaterialFn = null,
    ancestry = new Set(),
    maxDepth = 8,
    depth = 0
  } = options;

  if (!materials || depth > maxDepth) {
    return;
  }

  Object.entries(materials).forEach(([material, amount]) => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) {
      return;
    }

    const scaledAmount = numericAmount * multiplier;
    const childItem = findCraftableItem(material, itemLookup);

    if (childItem && childItem.materials) {
      const childId = normalizeLookupKey(childItem.name);
      if (!ancestry.has(childId)) {
        const nextAncestry = new Set(ancestry);
        nextAncestry.add(childId);
        collectRawMaterialsRecursive({
          materials: childItem.materials,
          multiplier: scaledAmount,
          itemLookup,
          bucket,
          excludeMaterialFn,
          ancestry: nextAncestry,
          maxDepth,
          depth: depth + 1
        });
      }
      return;
    }

    if (!excludeMaterialFn || !excludeMaterialFn(material)) {
      const canonicalKey = canonicalMaterialKey(material);
      bucket[canonicalKey] = (bucket[canonicalKey] || 0) + scaledAmount;
    }
  });
}

function buildRawMaterialMapForItem(item, craftQuantity, sharedLookup, options = {}) {
  const qty = Number.isFinite(Number(craftQuantity)) ? Number(craftQuantity) : 1;
  const itemLookup = sharedLookup || buildItemLookup(getItems());
  const { excludeMaterialFn = null } = options;
  const bucket = {};

  collectRawMaterialsRecursive({
    materials: item && item.materials ? item.materials : {},
    multiplier: qty,
    itemLookup,
    bucket,
    excludeMaterialFn,
    ancestry: new Set([normalizeLookupKey(item && item.name ? item.name : "")])
  });

  return bucket;
}

function getTotalMaterials(item, craftQuantity) {
  return Object.values(buildRawMaterialMapForItem(item, craftQuantity, null, { excludeMaterialFn: shouldExcludeFromTotal })).reduce((sum, value) => {
    const numericValue = Number(value);
    return sum + (Number.isFinite(numericValue) ? numericValue : 0);
  }, 0);
}

function updatePopupMaterialsHint(item, craftQuantity) {
  if (!popupMaterialsHint) {
    return;
  }

  popupMaterialsHint.textContent = `Combined totals | Total Mats ${getTotalMaterials(item, craftQuantity)}`;
}

function renderPopupMaterialTotals(item, craftQuantity) {
  if (!popupMaterialTotals) {
    return;
  }

  popupMaterialTotals.innerHTML = "";
  const totalsMap = buildRawMaterialMapForItem(item, craftQuantity, null, { excludeMaterialFn: shouldExcludeFromTotal });
  const entries = Object.entries(totalsMap).sort((a, b) => Number(b[1]) - Number(a[1]));

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-material-totals";
    empty.textContent = "No combined totals available.";
    popupMaterialTotals.appendChild(empty);
    return;
  }

  entries.forEach(([materialKey, amount]) => {
    const row = document.createElement("div");
    row.className = "popup-total-row";

    const name = document.createElement("span");
    name.className = "popup-total-name";
    name.textContent = formatMaterialLabel(materialKey);

    const value = document.createElement("span");
    value.className = "popup-total-value";
    value.textContent = String(amount);

    row.appendChild(name);
    row.appendChild(value);
    popupMaterialTotals.appendChild(row);
  });
}

function renderPopupMaterials(item, craftQuantity) {
  if (!popupMaterials) {
    return;
  }

  popupMaterials.innerHTML = "";
  const materialEntries = sortMaterialEntries(item.materials);

  if (materialEntries.length === 0) {
    const row = document.createElement("div");
    row.className = "material-row empty-materials";
    row.textContent = "No materials configured for this item.";
    popupMaterials.appendChild(row);
    return;
  }

  const itemLookup = buildItemLookup(getItems());
  renderMaterialTree({
    container: popupMaterials,
    materials: item.materials,
    itemLookup,
    depth: 0,
    multiplier: craftQuantity,
    ancestry: new Set([normalizeLookupKey(item.name)])
  });
}

function getItems() {
  if (typeof CONFIG_ITEMS === "undefined" || !Array.isArray(CONFIG_ITEMS)) {
    console.error("CONFIG_ITEMS is missing or invalid.");
    return [];
  }

  return CONFIG_ITEMS;
}

function hydratePlannerState() {
  const persistedList = readStorageJSON(SHOPPING_STORAGE_KEY, []);
  const persistedOwned = readStorageJSON(OWNED_STOCK_STORAGE_KEY, {});

  shoppingList = Array.isArray(persistedList)
    ? persistedList
      .map(entry => ({
        itemName: String(entry && entry.itemName ? entry.itemName : "").trim(),
        qty: Math.max(1, Math.floor(Number(entry && entry.qty ? entry.qty : 1)))
      }))
      .filter(entry => entry.itemName)
    : [];

  ownedStock = persistedOwned && typeof persistedOwned === "object" && !Array.isArray(persistedOwned)
    ? persistedOwned
    : {};
}

function persistShoppingList() {
  writeStorageJSON(SHOPPING_STORAGE_KEY, shoppingList);
}

function persistOwnedStock() {
  writeStorageJSON(OWNED_STOCK_STORAGE_KEY, ownedStock);
}

function addItemToShoppingList(item, qty) {
  if (!item || !item.name) {
    return;
  }

  const quantity = Math.max(1, Math.floor(Number(qty) || 1));
  const existing = shoppingList.find(entry => normalizeLookupKey(entry.itemName) === normalizeLookupKey(item.name));

  if (existing) {
    existing.qty += quantity;
  } else {
    shoppingList.push({
      itemName: item.name,
      qty: quantity
    });
  }

  persistShoppingList();
}

function removeShoppingListItem(itemName) {
  shoppingList = shoppingList.filter(entry => normalizeLookupKey(entry.itemName) !== normalizeLookupKey(itemName));
  persistShoppingList();
}

function clearShoppingList() {
  shoppingList = [];
  ownedStock = {};
  persistShoppingList();
  persistOwnedStock();
}

function buildCombinedShoppingTotals() {
  const totals = {};
  const items = getItems();
  const itemLookup = buildItemLookup(items);

  shoppingList.forEach(entry => {
    const item = itemLookup.get(normalizeLookupKey(entry.itemName));
    if (!item) {
      return;
    }

    const materialMap = buildRawMaterialMapForItem(item, entry.qty, itemLookup, { excludeMaterialFn: shouldExcludeFromTotal });
    Object.entries(materialMap).forEach(([materialKey, amount]) => {
      totals[materialKey] = (totals[materialKey] || 0) + amount;
    });
  });

  return totals;
}

function getOwnedAmount(materialKey) {
  const value = Number(ownedStock[materialKey]);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function setOwnedAmount(materialKey, value) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? Math.max(0, Math.floor(numericValue)) : 0;
  ownedStock[materialKey] = safeValue;
  persistOwnedStock();
  return safeValue;
}

function renderShoppingItems() {
  if (!shoppingItemsContainer || !shoppingSummary) {
    return;
  }

  shoppingItemsContainer.innerHTML = "";

  if (shoppingList.length === 0) {
    shoppingSummary.textContent = "No items in list yet.";
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Open an item and click 'Add to list' to build your crafting plan.";
    shoppingItemsContainer.appendChild(empty);
    return;
  }

  const totalCrafts = shoppingList.reduce((sum, entry) => sum + entry.qty, 0);
  const craftLabel = totalCrafts === 1 ? "craft" : "crafts";
  shoppingSummary.textContent = `${shoppingList.length} recipes, ${totalCrafts} ${craftLabel} total.`;

  shoppingList.forEach(entry => {
    const row = document.createElement("div");
    row.className = "shopping-item-row";

    const name = document.createElement("span");
    name.className = "shopping-item-name";
    name.textContent = `${entry.itemName} x${entry.qty}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "mini-btn";
    removeBtn.dataset.removeItem = entry.itemName;
    removeBtn.textContent = "Remove";

    row.appendChild(name);
    row.appendChild(removeBtn);
    shoppingItemsContainer.appendChild(row);
  });
}

function renderShoppingTotals() {
  if (!shoppingTotalsContainer) {
    return;
  }

  shoppingTotalsContainer.innerHTML = "";
  const totals = buildCombinedShoppingTotals();
  const totalEntries = Object.entries(totals).sort((a, b) => Number(b[1]) - Number(a[1]));
  let rawTotal = 0;
  let needTotal = 0;

  if (totalEntries.length === 0) {
    if (shoppingTotalsSummary) {
      shoppingTotalsSummary.textContent = "Raw Total 0 | Need Total 0";
    }
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Combined materials will appear here.";
    shoppingTotalsContainer.appendChild(empty);
    return;
  }

  totalEntries.forEach(([materialKey, amount]) => {
    rawTotal += amount;
    const row = document.createElement("div");
    row.className = "shopping-total-row";

    const name = document.createElement("span");
    name.className = "shopping-total-name";
    name.textContent = formatMaterialLabel(materialKey);

    const values = document.createElement("div");
    values.className = "shopping-total-values";

    const totalAmount = document.createElement("span");
    totalAmount.className = "shopping-total-amount";
    totalAmount.textContent = `Total ${amount}`;

    const ownedInput = document.createElement("input");
    ownedInput.type = "number";
    ownedInput.min = "0";
    ownedInput.step = "1";
    ownedInput.inputMode = "numeric";
    ownedInput.className = "owned-input";
    ownedInput.value = String(getOwnedAmount(materialKey));
    ownedInput.setAttribute("aria-label", `Owned ${formatMaterialLabel(materialKey)}`);

    const needAmount = document.createElement("span");
    needAmount.className = "shopping-need-amount";

    const refreshNeedText = () => {
      const owned = getOwnedAmount(materialKey);
      const needed = Math.max(0, amount - owned);
      needAmount.textContent = `Need ${needed}`;
      return needed;
    };

    ownedInput.addEventListener("input", () => {
      const safeValue = setOwnedAmount(materialKey, ownedInput.value);
      ownedInput.value = String(safeValue);
      renderShoppingTotals();
    });

    needTotal += refreshNeedText();

    values.appendChild(totalAmount);
    values.appendChild(ownedInput);
    values.appendChild(needAmount);
    row.appendChild(name);
    row.appendChild(values);
    shoppingTotalsContainer.appendChild(row);
  });

  if (shoppingTotalsSummary) {
    shoppingTotalsSummary.textContent = `Raw Total ${rawTotal} | Need Total ${needTotal}`;
  }
}

function renderShoppingPanel() {
  renderShoppingItems();
  renderShoppingTotals();
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
  const blueprintLabel = blueprintOnly ? " (Blueprint only)" : "";
  resultCount.textContent = `${count} ${itemLabel} shown in ${getCategoryLabel(category)}${blueprintLabel}`;
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
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (!blueprintOnly || item.blueprintRequired === true)
    );
  } catch (error) {
    console.error("Failed to filter items:", error);
    renderEmptyState("Config loaded, but filtering failed. Check console for details.");
    return;
  }

  const selectedSort = sortSelect ? sortSelect.value : "nameAsc";
  filteredItems.sort((a, b) => {
    const nameA = String(a.name || "");
    const nameB = String(b.name || "");
    const levelA = Number(a.levelRequired) || 0;
    const levelB = Number(b.levelRequired) || 0;
    const xpA = Number(a.xp) || 0;
    const xpB = Number(b.xp) || 0;
    const capA = Number(a.stopLevel) || 0;
    const capB = Number(b.stopLevel) || 0;

    switch (selectedSort) {
      case "levelAsc":
        return levelA - levelB || nameA.localeCompare(nameB);
      case "levelDesc":
        return levelB - levelA || nameA.localeCompare(nameB);
      case "xpAsc":
        return xpA - xpB || nameA.localeCompare(nameB);
      case "xpDesc":
        return xpB - xpA || nameA.localeCompare(nameB);
      case "capAsc":
        return capA - capB || nameA.localeCompare(nameB);
      case "capDesc":
        return capB - capA || nameA.localeCompare(nameB);
      default:
        return nameA.localeCompare(nameB);
    }
  });

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

    const title = document.createElement("h3");
    title.className = "item-card-title";
    title.textContent = String(item.name || "");

    const meta = document.createElement("div");
    meta.className = "item-card-meta";

    const level = document.createElement("span");
    level.textContent = `Level ${Number(item.levelRequired) || 0}+`;

    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = String(item.category || "uncategorized");

    meta.appendChild(level);
    meta.appendChild(badge);
    card.appendChild(title);
    card.appendChild(meta);
    itemList.appendChild(card);
  });
}

function openPopup(item) {
  if (!popupElement || !popupTitle || !popupLevel || !popupXP || !popupStopXP || !popupBP || !popupCraftQty || !popupMaterialTotals || !popupMaterials || !closePopupBtn) {
    return;
  }

  currentPopupItem = item;
  popupTitle.textContent = item.name;
  popupLevel.textContent = `Level ${item.levelRequired}+`;
  popupXP.textContent = `XP ${Number(item.xp) || 0}`;
  popupStopXP.textContent = `Stop XP ${Number(item.stopLevel) || 0}`;
  popupBP.textContent = item.blueprintRequired ? "Blueprint required" : "No blueprint needed";
  popupCraftQty.value = "1";
  updatePopupMaterialsHint(item, 1);
  renderPopupMaterialTotals(item, 1);
  renderPopupMaterials(item, 1);
  if (copyFeedback) {
    copyFeedback.textContent = "";
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
  currentPopupItem = null;
  if (copyFeedback) {
    copyFeedback.textContent = "";
  }

  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
}

function buildCopyMaterialText() {
  if (!popupMaterials || !currentPopupItem) {
    return "";
  }

  const rows = Array.from(popupMaterials.querySelectorAll(".material-row"));
  if (rows.length === 0) {
    return "";
  }

  const lines = [`${currentPopupItem.name} x${getCraftQuantity()}`];
  rows.forEach(row => {
    const spans = row.querySelectorAll("span");
    if (spans.length < 2) {
      return;
    }

    const depth = Number(row.style.getPropertyValue("--depth")) || 0;
    const indent = "  ".repeat(Math.max(0, depth));
    const label = spans[0].textContent ? spans[0].textContent.trim() : "";
    const amount = spans[1].textContent ? spans[1].textContent.trim() : "";
    if (label && amount) {
      lines.push(`${indent}${label}: ${amount}`);
    }
  });

  return lines.join("\n");
}

async function handleCopyMaterials() {
  const text = buildCopyMaterialText();
  if (!text) {
    if (copyFeedback) {
      copyFeedback.textContent = "Nothing to copy.";
    }
    return;
  }

  try {
    if (window.isSecureContext && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API unavailable in this context.");
    }

    if (copyFeedback) {
      copyFeedback.textContent = "Materials copied.";
    }
  } catch (error) {
    try {
      const fallback = document.createElement("textarea");
      fallback.value = text;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.top = "-9999px";
      document.body.appendChild(fallback);
      fallback.focus();
      fallback.select();
      fallback.setSelectionRange(0, fallback.value.length);
      const copied = document.execCommand("copy");
      document.body.removeChild(fallback);

      if (!copied) {
        throw new Error("document.execCommand('copy') returned false.");
      }

      if (copyFeedback) {
        copyFeedback.textContent = "Materials copied.";
      }
    } catch (fallbackError) {
      console.error("Clipboard write failed:", error);
      console.error("Clipboard fallback failed:", fallbackError);
      if (copyFeedback) {
        copyFeedback.textContent = "Auto-copy blocked. Showing manual copy dialog.";
      }
      window.prompt("Copy materials (Ctrl+C, Enter):", text);
    }
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

if (sortSelect) {
  sortSelect.addEventListener("change", renderItems);
}

if (blueprintOnlyBtn) {
  blueprintOnlyBtn.addEventListener("click", () => {
    setBlueprintOnlyState(!blueprintOnly);
    renderItems();
  });
}

if (closePopupBtn) {
  closePopupBtn.addEventListener("click", closePopup);
}

if (popupCraftQty) {
  popupCraftQty.addEventListener("input", () => {
    if (!currentPopupItem) {
      return;
    }

    const craftQuantity = getCraftQuantity();
    popupCraftQty.value = String(craftQuantity);
    updatePopupMaterialsHint(currentPopupItem, craftQuantity);
    renderPopupMaterialTotals(currentPopupItem, craftQuantity);
    renderPopupMaterials(currentPopupItem, craftQuantity);
  });
}

if (addToListBtn) {
  addToListBtn.addEventListener("click", () => {
    if (!currentPopupItem) {
      return;
    }

    addItemToShoppingList(currentPopupItem, getCraftQuantity());
    renderShoppingPanel();
    if (copyFeedback) {
      copyFeedback.textContent = "Added to crafting list.";
    }
  });
}

if (copyMaterialsBtn) {
  copyMaterialsBtn.addEventListener("click", handleCopyMaterials);
}

if (shoppingItemsContainer) {
  shoppingItemsContainer.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-item]");
    if (!removeButton) {
      return;
    }

    const itemName = removeButton.dataset.removeItem;
    if (!itemName) {
      return;
    }

    removeShoppingListItem(itemName);
    renderShoppingPanel();
  });
}

if (clearShoppingBtn) {
  clearShoppingBtn.addEventListener("click", () => {
    clearShoppingList();
    renderShoppingPanel();
  });
}

if (popupElement) {
  popupElement.addEventListener("click", event => {
    if (event.target === popupElement) {
      closePopup();
    }
  });
}

document.addEventListener("keydown", event => {
  if (!popupElement) {
    return;
  }

  if (event.key === "Escape" && !popupElement.classList.contains("hidden")) {
    closePopup();
  }
});

if (hasRequiredDom()) {
  try {
    hydratePlannerState();
    setBlueprintOnlyState(false);
    renderItems();
    renderShoppingPanel();
  } catch (error) {
    console.error("Initial render failed:", error);
    renderEmptyState("Initial render failed. Open browser console for error details.");
  }
}
