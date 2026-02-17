let products = [];
let cart = [];
let wishlist = [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
// Load products from JSON file
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
    cleanUpCartAndWishlist();
  });

// Display products on the page
function displayProducts(productsToDisplay) {
  const productContainer = document.getElementById('products');
  productContainer.innerHTML = '';
  productsToDisplay.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col-md-4', 'mb-4');
    productDiv.innerHTML = `
      <div class="product card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: $${product.price}</p>
          <p class="card-text">Category: ${product.category}</p>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
        </div>
      </div>
    `;
    productContainer.appendChild(productDiv);
  });
}

// Add product to cart
function addToCart(id) {
    const product = products.find(prod => prod.id === id);
    if (product) {
      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
        alert(`${product.name} quantity increased in cart!`);
      } else {
        cart.push({ ...product, quantity: 1 });
        alert(`${product.name} added to cart!`);
      }
      viewCart();
    }
  }

// Add product to wishlist
function addToWishlist(id) {
    const product = products.find(prod => prod.id === id);
    if (product) {
      const existingItem = wishlist.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
        alert(`${product.name} quantity increased in wishlist!`);
      } else {
        wishlist.push({ ...product, quantity: 1 });
        alert(`${product.name} added to wishlist!`);
      }
      viewWishlist();
    }
  }

// Move item from wishlist to cart
function moveToCart(id) {
    const product = wishlist.find(prod => prod.id === id);
    if (product) {
      addToCart(id);
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        wishlist = wishlist.filter(item => item.id !== id);
      }
      viewWishlist();
    }
  }

// View wishlist
function viewWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    wishlistItems.innerHTML = wishlist.length
      ? wishlist.map(item => `<p>${item.name} - $${item.price} x ${item.quantity} <button class="btn btn-sm btn-link" onclick="moveToCart(${item.id})">Move to Cart</button></p>`).join('')
      : 'No items in wishlist.';
  }

// View cart
function viewCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = cart.length
      ? cart.map(item => `<p>${item.name} - $${item.price} x ${item.quantity}</p>`).join('')
      : 'No items in cart.';
  }

// View order history
function viewOrderHistory() {
    const orderHistoryItems = document.getElementById('orderHistoryItems');
    orderHistoryItems.innerHTML = orderHistory.length
      ? orderHistory.map(item => `<p>${item.name} - $${item.price} x ${item.quantity} (${new Date(item.date).toLocaleDateString()})</p>`).join('')
      : 'No orders found.';
  }
// Checkout function
function checkout() {
    if (cart.length) {
      orderHistory.push(...cart.map(item => ({ ...item, date: new Date().toISOString() })));
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      cart = [];
      viewCart();
      alert("Checkout complete! Order history updated.");
    } else {
      alert("Your cart is empty!");
    }
  }

// Clean up cart and wishlist
function cleanUpCartAndWishlist() {
  const productIds = products.map(product => product.id);
  cart = cart.filter(item => productIds.includes(item.id));
  wishlist = wishlist.filter(item => productIds.includes(item.id));
}

// Filter products
function filterProducts() {
  const categoryFilter = document.getElementById('category-filter').value;
  const priceFilter = document.getElementById('price-filter').value;
  const priceDisplay = document.getElementById('price-display');
  
  priceDisplay.textContent = `$${priceFilter}`;

  let filteredProducts = products;

  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === categoryFilter);
  }

  filteredProducts = filteredProducts.filter(product => product.price <= priceFilter);

  displayProducts(filteredProducts);
}

// Search products
function searchProducts() {
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  const searchResults = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.category.toLowerCase().includes(searchTerm)
  );
  displayProducts(searchResults);
}

// Clear order history
function clearOrderHistory() {
  orderHistory = [];
  localStorage.removeItem('orderHistory');
  viewOrderHistory();
  alert("Order history has been cleared.");
}

// Initialize price filter
document.addEventListener('DOMContentLoaded', () => {
  const priceFilter = document.getElementById('price-filter');
  const priceDisplay = document.getElementById('price-display');
  priceDisplay.textContent = `$${priceFilter.value}`;
  priceFilter.addEventListener('input', () => {
    priceDisplay.textContent = `$${priceFilter.value}`;
  });
});