const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

function renderItems() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  itemList.innerHTML = "";

  CONFIG_ITEMS
    .filter(item =>
      item.name.toLowerCase().includes(searchValue) &&
      (selectedCategory === "all" || item.category === selectedCategory)
    )
    .forEach(item => {
      const div = document.createElement("div");
      div.className = "item-card";
      div.textContent = item.name;
      div.onclick = () => openPopup(item);
      itemList.appendChild(div);
    });
}

function openPopup(item) {
  document.getElementById("popupTitle").textContent = item.name;
  document.getElementById("popupLevel").textContent =
    "Level Required: " + item.levelRequired;
  document.getElementById("popupBP").textContent =
    "Blueprint Required: " + (item.blueprintRequired ? "Yes" : "No");

  const materialsDiv = document.getElementById("popupMaterials");
  materialsDiv.innerHTML = "";

  for (let mat in item.materials) {
    const row = document.createElement("div");
    row.className = "material-row";
    row.innerHTML = `
      <span>${mat.toUpperCase()}</span>
      <span>${item.materials[mat]}</span>
    `;
    materialsDiv.appendChild(row);
  }

  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

searchInput.addEventListener("input", renderItems);
categorySelect.addEventListener("change", renderItems);

renderItems();
