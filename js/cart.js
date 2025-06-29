

function updateCartPage() {
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const summaryContainer = document.getElementById('cart-summary');
  const cartGrid = document.querySelector('.cart-grid');
  
  // Clear the individual containers, not the entire grid
  if (cartItemsContainer) cartItemsContainer.innerHTML = "";
  if (summaryContainer) summaryContainer.innerHTML = "";

  // If cart is empty, show a message
  if (currentCart.length === 0) {
    cartGrid.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    return;
  }

  // Calculate totals
  const subtotal = currentCart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.20;
  const total = subtotal + shipping + tax;

  // Populate cart items
  currentCart.forEach(product => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-product-id', product.id);

    cartItem.innerHTML = `      
      <img class="cart-item-image" src="images/ui/mock-image1.jpg" alt="${product.name}">
      <div class="cart-item-details">
        <h4>${product.name}</h4>
        <div class="cart-item-controls">
          <span class="cart-price">£${product.price.toFixed(2)}</span>
          <div class="quantity-controls">
            <button class="qty-decrease" data-product-id="${product.id}">-</button>
            <span class="quantity">${product.quantity}</span>
            <button class="qty-increase" data-product-id="${product.id}">+</button>
          </div>
        </div>
      </div>
      <button class="remove-item" data-product-id="${product.id}">×</button>`;
      
    cartItemsContainer.appendChild(cartItem);
  });

  // Populate summary section
  summaryContainer.innerHTML = `
    <h3>Order Summary</h3>
    <div class="total-line">
      <span>Subtotal:</span>
      <span>£${subtotal.toFixed(2)}</span>
    </div>
    <div class="total-line">
      <span>VAT (20%):</span>
      <span>£${tax.toFixed(2)}</span>
    </div>
    <div class="total-line">
      <span>Shipping:</span>
      <span>${shipping === 0 ? 'FREE' : '£' + shipping.toFixed(2)}</span>
    </div>
    <div class="total-line final">
      <span>Total:</span>
      <span>£${total.toFixed(2)}</span>
    </div>
    <button class="checkoutButton" onclick="proceedToCheckout()">Proceed to Checkout</button>
    <button class="clearButton" onclick="clearCart(event)">Clear Cart</button>
  `;
}

function clearCart(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart'); 
    updateCartDisplay();
    updateCartPage();
    if (typeof updateCartDropdown === 'function') {
      updateCartDropdown(); // Update dropdown if function exists
    }
  }
}

function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Add your checkout logic here
  alert('Proceeding to checkout...');
  // Example: window.location.href = 'checkout.html';
}

// Add event delegation for cart page buttons
// // This ensures buttons work even after the DOM is updated
// document.addEventListener('click', function(e) {
//   // Only handle clicks if we're on the cart page and have cart containers
//   const cartItemsContainer = document.getElementById('cart-items');
//   const summaryContainer = document.getElementById('cart-summary');
  
//   if (!cartItemsContainer || !summaryContainer) {
//     return; 
//   }

//   if (e.target.classList.contains('qty-increase')) {
//     e.stopPropagation();
//     const productId = e.target.dataset.productId;
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const item = cart.find(item => item.id === productId);
    
//     if (item) {
//       item.quantity += 1;
//       localStorage.setItem('cart', JSON.stringify(cart));
//       updateCartDisplay();
//       updateCartPage();
//       if (typeof updateCartDropdown === 'function') {
//         updateCartDropdown();
//       }
//     }
//   }
  
//   if (e.target.classList.contains('qty-decrease')) {
//     e.stopPropagation();
//     const productId = e.target.dataset.productId;
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const item = cart.find(item => item.id === productId);
    
//     if (item) {
//       if (item.quantity > 1) {
//         item.quantity -= 1;
//       } else {
//         cart = cart.filter(cartItem => cartItem.id !== productId);
//       }
//       localStorage.setItem('cart', JSON.stringify(cart));
//       updateCartDisplay();
//       updateCartPage();
//       if (typeof updateCartDropdown === 'function') {
//         updateCartDropdown();
//       }
//     }
//   }
  
//   if (e.target.classList.contains('remove-item')) {
//     e.stopPropagation();
//     const productId = e.target.dataset.productId;
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     cart = cart.filter(cartItem => cartItem.id !== productId);
//     localStorage.setItem('cart', JSON.stringify(cart));
//     updateCartDisplay();
//     updateCartPage();
//     if (typeof updateCartDropdown === 'function') {
//       updateCartDropdown();
//     }
//   }
// });

document.addEventListener('DOMContentLoaded', function() {
  updateCartPage();
});