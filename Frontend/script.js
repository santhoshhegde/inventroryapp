let editingId = null; // Global flag for editing state

document.addEventListener("DOMContentLoaded", () => {
  fetchTypes();
  loadItems();

  document.getElementById("itemForm").addEventListener("submit", defaultSubmit);
});

async function fetchTypes() {
  const res = await fetch("http://localhost:3000/api/item-types");
  const types = await res.json();
  const select = document.querySelector("select[name='item_type']");
  select.innerHTML = "";
  types.forEach((type) => {
    const opt = document.createElement("option");
    opt.value = type.id;
    opt.textContent = type.type_name;
    select.appendChild(opt);
  });
}

async function loadItems() {
  const res = await fetch("http://localhost:3000/api/items");
  const items = await res.json();
  console.log(items);
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
          <button onclick="editItem(${item.id}, '${item.name}', '${
      item.purchase_date
    }', ${item.stock_available}, ${item.type_id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
        </td>
      `;
    table.appendChild(row);
  });
}

function editItem(id, name, date, stock, typeId) {
  const form = document.getElementById("itemForm");
  form.name.value = name;
  form.purchase_date.value = date.slice(0, 10); // Only take the date part
  form.stock_available.checked = stock;
  form.item_type.value = typeId;

  editingId = id; // Set the flag for editing mode
}

async function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    const res = await fetch(`http://localhost:3000/api/items/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadItems();
    }
  }
}

const defaultSubmit = async (e) => {
  e.preventDefault(); // Prevent form from submitting traditionally
  const form = e.target;

  const data = {
    name: form.name.value,
    purchase_date: form.purchase_date.value,
    stock_available: form.stock_available.checked,
    item_type_id: form.item_type.value,
  };

  let url = "http://localhost:3000/api/items";
  let method = "POST";

  if (editingId !== null) {
    url = `http://localhost:3000/api/items/${editingId}`; // Edit mode: Update an existing item
    method = "PUT"; // Change method to PUT for update
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    loadItems(); // Reload items after submission
    form.reset(); // Reset form
    editingId = null; // Reset editing mode
  }
};
