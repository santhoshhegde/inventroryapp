let itemTypes = [];
let editingItems = [];

document.addEventListener("DOMContentLoaded", async () => {
  await fetchTypes();
  addItemField();
  document.getElementById("itemForm").addEventListener("submit", handleSubmit);
  loadItems();
});

async function fetchTypes() {
  const res = await fetch("http://localhost:3000/api/item-types");
  itemTypes = await res.json();
}

function addItemField(item = null) {
  const container = document.getElementById("itemFieldsContainer");

  const div = document.createElement("div");
  div.classList.add("item-fields");
  div.innerHTML = `
    <input type="text" name="name" placeholder="Item Name" value="${
      item ? item.name : ""
    }" required />
    <select name="item_type" required>
      ${itemTypes
        .map(
          (type) =>
            `<option value="${type.id}" ${
              item && item.item_type_id === type.id ? "selected" : ""
            }>${type.type_name}</option>`
        )
        .join("")}
    </select>
    <input type="date" name="purchase_date" value="${
      item ? item.purchase_date : ""
    }" required />
    <label><input type="checkbox" name="stock_available" ${
      item && item.stock_available ? "checked" : ""
    } /> In Stock</label>
    <button type="button" onclick="this.parentElement.remove()">Remove</button>
    <br/><br/>
  `;
  container.appendChild(div);
  if (item) editingItems.push(item);
}

async function handleSubmit(e) {
  e.preventDefault();
  const fieldGroups = document.querySelectorAll(".item-fields");
  console.log(fieldGroups);
  const items = Array.from(fieldGroups).map((group) => {
    return {
      name: group.querySelector('input[name="name"]').value,
      item_type_id: group.querySelector('select[name="item_type"]').value,
      purchase_date: group.querySelector('input[name="purchase_date"]').value,
      stock_available: group.querySelector('input[name="stock_available"]')
        .checked,
    };
  });

  const res = await fetch("http://localhost:3000/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });

  if (res.ok) {
    document.getElementById("itemForm").reset();
    document.getElementById("itemFieldsContainer").innerHTML = "";
    addItemField(); // Reset to one field
    loadItems();
  } else {
    alert("Error submitting items");
  }
}

async function loadItems() {
  const res = await fetch("http://localhost:3000/api/items");
  const items = await res.json();

  const table = document.getElementById("itemTable");
  table.innerHTML = `<tr><th>Name</th><th>Type</th><th>Date</th><th>Stock</th><th>Actions</th></tr>`;

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.type_name}</td>
      <td>${item.purchase_date.slice(0, 10)}</td>
      <td>${item.stock_available ? "Yes" : "No"}</td>
      <td>
        <button onclick="editItem(${item.id}, this)">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function editItem(id, button) {
  const row = button.closest("tr");
  const name = row.querySelector("td:nth-child(1)").textContent;
  const type = row.querySelector("td:nth-child(2)").textContent;
  const purchaseDate = row.querySelector("td:nth-child(3)").textContent;
  const stockAvailable =
    row.querySelector("td:nth-child(4)").textContent === "Yes";

  addItemField({
    id,
    name,
    item_type_id: itemTypes.find((typeObj) => typeObj.type_name === type).id,
    purchase_date: purchaseDate,
    stock_available: stockAvailable,
  });

  // Remove edit button and make it behave like adding a new item
  button.style.display = "none";
}

async function deleteItem(id) {
  const res = await fetch(`http://localhost:3000/api/items/${id}`, {
    method: "DELETE",
  });

  if (res.ok) loadItems();
}
