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
const popupTotalMats = document.getElementById("popupTotalMats");
const popupCraftQty = document.getElementById("popupCraftQty");
const popupMaterials = document.getElementById("popupMaterials");
const copyMaterialsBtn = document.getElementById("copyMaterialsBtn");
const copyFeedback = document.getElementById("copyFeedback");
const closePopupBtn = document.getElementById("closePopupBtn");

let lastFocusedCard = null;
let currentCategory = categorySelect ? categorySelect.value : "all";
let currentPopupItem = null;
let blueprintOnly = false;

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

function getTotalMaterials(item, craftQuantity) {
  const qty = Number.isFinite(Number(craftQuantity)) ? Number(craftQuantity) : 1;
  return Object.values(item && item.materials ? item.materials : {}).reduce((sum, value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
      return sum;
    }

    return sum + amount * qty;
  }, 0);
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
  if (!popupElement || !popupTitle || !popupLevel || !popupXP || !popupStopXP || !popupBP || !popupTotalMats || !popupCraftQty || !popupMaterials || !closePopupBtn) {
    return;
  }

  currentPopupItem = item;
  popupTitle.textContent = item.name;
  popupLevel.textContent = `Level ${item.levelRequired}+`;
  popupXP.textContent = `XP ${Number(item.xp) || 0}`;
  popupStopXP.textContent = `Stop XP ${Number(item.stopLevel) || 0}`;
  popupBP.textContent = item.blueprintRequired ? "Blueprint required" : "No blueprint needed";
  popupCraftQty.value = "1";
  popupTotalMats.textContent = `Total Mats ${getTotalMaterials(item, 1)}`;
  renderPopupMaterials(item, 1);

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
    if (popupTotalMats) {
      popupTotalMats.textContent = `Total Mats ${getTotalMaterials(currentPopupItem, craftQuantity)}`;
    }
    renderPopupMaterials(currentPopupItem, craftQuantity);
  });
}

if (copyMaterialsBtn) {
  copyMaterialsBtn.addEventListener("click", handleCopyMaterials);
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
    setBlueprintOnlyState(false);
    renderItems();
  } catch (error) {
    console.error("Initial render failed:", error);
    renderEmptyState("Initial render failed. Open browser console for error details.");
  }
}
