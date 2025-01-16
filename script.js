
const productForm = document.getElementById('productForm'); 
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription'); 
const productPrice = document.getElementById('productPrice'); 
const productImage = document.getElementById('productImage'); 
const imagePreview = document.getElementById('imagePreview'); 
const message = document.getElementById('message');
const productList = document.getElementById('productList');
// Store uploaded products
let products = [];
// Show image preview
productImage.addEventListener('change', () => {
const file = productImage.files[0];
if (file) {
const reader = new FileReader();
reader.onload = function () {
    imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
    imagePreview.style.display = 'block';
};
reader.readAsDataURL(file);
}
});
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const description=productDescription.value.trim();
    const price = parseFloat(productPrice.value.trim());

    if (name === "" || description === "" || isNaN(price) || price <= 0) { 
        message.textContent = "Please fill out all fields correctly."; 
        message.style.color = "red";
    }
    const newProduct = {
    id: Date.now(),
    name,
    description,
    price,
    image: imagePreview.querySelector('img').src 
};
products.push(newProduct); 
displayProducts(); 
clearForm();
message.textContent = "Product uploaded successfully!"; 
message.style.color = "green";
});
// Display products
function displayProducts() { 
    productList.innerHTML = ''; 
    products.forEach (product => {
        const productItem = document.createElement('div'); 
        productItem.classList.add('product-item'); 
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}"> 
            <div class="product-info">
                <h3>${product.name}</h3>
            <p>${product.description}</p> 
            <p>$${product.price}</p>
            <button onclick="editProduct(${product.id})">Edit</button> <button onclick="deleteProduct(${product.id})">Delete</button> 
            </div>
            `;
productList.appendChild(productItem);
});
}
// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
    productName.value = product.name;
    productDescription.value = product.description;
    productPrice.value = product.price;
    const previewImage = document.querySelector('.image-preview img');
    previewImage ? previewImage.src = product. image: null;
    productImage.files = new DataTransfer().files;
    message.textContent = "Edit the product and resubmit.";
    message.style.color = "blue";
    products = products.filter(p => p.id !== id);
    displayProducts();
 }
}
// Track the product to delete
let productToDelete = null;

function deleteProduct(id) {
    // Set the product to delete
    productToDelete = id;

    // Show the modal
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.style.display = 'flex';
}

// Handle Confirm and Cancel
document.getElementById('confirmDelete').addEventListener('click', () => {
    if (productToDelete !== null) {
        // Remove the product
        products = products.filter(p => p.id !== productToDelete);

        // Refresh the product list
        displayProducts();

        // Reset the tracker
        productToDelete = null;
    }

    // Close the modal
    document.getElementById('deleteModal').style.display = 'none';

    // Feedback
    alert("Product deleted successfully!");
});

document.getElementById('cancelDelete').addEventListener('click', () => {
    // Reset the tracker
    productToDelete = null;

    // Close the modal
    document.getElementById('deleteModal').style.display = 'none';

    // Feedback
    alert("Product deletion canceled.");
});

// Clear the form after submission
function clearForm() {
    productName.value = ""; 
    productDescription.value = "";
    productPrice.value = "";
    productImage.value = "";
    imagePreview.style.display = 'none';
}

//For sorting
const sortingHTML = `
  <div class="sorting">
    <button id="sortByName">Sort by Name</button>
    <button id="sortByPrice">Sort by Price</button>
    <input type="text" id="searchBar" placeholder="Search products...">
  </div>
`;

const productDisplay = document.querySelector('.product-display');
productDisplay.insertAdjacentHTML('afterbegin', sortingHTML);

//Sorting functionality

document.getElementById('sortByName').addEventListener('click', () => {
    products.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts();
  });
  
  document.getElementById('sortByPrice').addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price);
    displayProducts();
  });

  //Search Function

  document.getElementById('searchBar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
  });

  
  //Rating system

  function displayProducts(filteredProducts = products) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>$${product.price}</p>
          <div class="rating" data-id="${product.id}">
            ${Array.from({ length: 5 }, (_, i) => `<span class="star" data-value="${i + 1}">&#9734;</span>`).join('')}
          </div>
          <button onclick="editProduct(${product.id})">Edit</button>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      `;
      productList.appendChild(productItem);
    });
    setupRatings();
  }
  
  function setupRatings() {
    document.querySelectorAll('.rating').forEach(ratingEl => {
      const productId = parseInt(ratingEl.dataset.id);
      const stars = ratingEl.querySelectorAll('.star');
  
      stars.forEach(star => {
        star.addEventListener('click', () => {
          const rating = parseInt(star.dataset.value);
          const product = products.find(p => p.id === productId);
          product.rating = rating;
          updateStarDisplay(ratingEl, rating);
          alert("Thank you for the rating!")
        });
      });
  
      const product = products.find(p => p.id === productId);
      if (product.rating) {
        updateStarDisplay(ratingEl, product.rating);
      }
    });
  }
  
  function updateStarDisplay(ratingEl, rating) {
    const stars = ratingEl.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.innerHTML = index < rating ? '&#9733;' : '&#9734;';
    });
  }
  