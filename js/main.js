const nav = document.querySelector('#main-nav');
const topOfNav = nav.offsetTop;
var links = document.getElementById("myLinks");

function fixNav() {
    if (window.scrollY >= topOfNav) {
        document.body.style.paddingTop = nav.offsetHeight + 'px';
        document.body.classList.add('fixed-nav');
        links.style.display = 'block';
    } else {
        document.body.style.paddingTop = 0;
        document.body.classList.remove('fixed-nav');
        links.style.display = 'none';
    }
}
window.addEventListener('scroll', fixNav);

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    const headerMsg = document.querySelector('.headerMsg');
    if (x.style.display === "block") {
      x.style.display = "none";
      headerMsg.style.display = "block"
    } else {
      x.style.display = "block";
      headerMsg.style.display = "none"
    }
}

function addToBasket (productId, productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.id === productId);

  if(existingItem) {
    existingItem.quantity += 1;
  
  } else {
    cart.push ({
      id: productId,
      name: productName,
      price: price,
      quantity: 1
    });
  }

    localStorage.setItem('cart', JSON.stringify(cart));
    
   
    updateCartDisplay();
    updateCartDropdown()
    console.log(JSON.parse(localStorage.getItem('cart')));
}
 

function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").innerHTML = totalItems;
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('qty-increase')) {
    e.stopPropagation(); // Prevent dropdown from closing
    const productId = e.target.dataset.productId;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      updateCartDropdown();

    if (typeof updateCartPage === 'function') {
      updateCartPage();
      }
    }
  }
  
  if (e.target.classList.contains('qty-decrease')) {
    e.stopPropagation(); // Prevent dropdown from closing
    const productId = e.target.dataset.productId;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(cartItem => cartItem.id !== productId);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      updateCartDropdown();

    if (typeof updateCartPage === 'function') {
      updateCartPage();
      }
    }
  }
  
  if (e.target.classList.contains('remove-item')) {
    e.stopPropagation(); // Prevent dropdown from closing
    const productId = e.target.dataset.productId;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(cartItem => cartItem.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartDropdown();

  if (typeof updateCartPage === 'function') {
    updateCartPage();
    }
  }
});

function updateCartDropdown() {
  
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  const dropDown = document.querySelector('.dropdown');
  
  // Store the clear button HTML
  const clearButtonHTML = '<button class="clearButton" onclick="clearCart(event)">Clear</button>';
  const goToCart = '<a href="cart.html" class="checkoutButton">Go To Cart</a>'
  dropDown.innerHTML = "";

  // If cart is empty, show a message
  if (currentCart.length === 0) {
    dropDown.innerHTML = '<div class="empty-cart" style="padding: 20px; text-align: center; color: #666;">Your cart is empty</div>';
  } else {
    currentCart.forEach(product => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.setAttribute('data-product-id', product.id)

      cartItem.innerHTML = `      
      <img class="cart-item-image" src="images/ui/mock-image1.jpg" alt="${product.name}">
        <div class="cart-item-details">
          <h4>${product.name}</h4>
          <div class="cart-item-controls">
            <span class="cart-price">£${product.price}</span>
            <div class="quantity-controls">
              <button class="qty-decrease" data-product-id="${product.id}">-</button>
              <span class="quantity">${product.quantity}</span>
              <button class="qty-increase" data-product-id="${product.id}">+</button>
            </div>
          </div>
        </div>
        <button class="remove-item" data-product-id="${product.id}">×</button>`

      dropDown.appendChild(cartItem)
    });
    
    // Add clear button at the end if there are items
    const buttonRow = `
      <div class="button-row">
        <button class="clearButton" onclick="clearCart(event)">Clear</button>
        <a href="cart.html" class="clearButton cart-link">Go To Cart</a>
      </div>
    `;
    dropDown.insertAdjacentHTML('beforeend', buttonRow);
  }
}

function clearCart(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart'); 
    updateCartDisplay();
    updateCartDropdown();
  }
}

/* CLICK-BASED DROPDOWN NAVIGATION */
const triggers = document.querySelectorAll('.nav-list > li');

// Track which dropdown is currently open
let currentOpenDropdown = null;

function showDropdown(li) {
  // If clicking the same dropdown, close it
  if (currentOpenDropdown === li) {
    hideDropdown(li);
    currentOpenDropdown = null;
    return;
  }
  
  // Close any previously open dropdown
  if (currentOpenDropdown) {
    hideDropdown(currentOpenDropdown);
  }
  
  // Open the new dropdown
  li.classList.add('trigger-enter');
  setTimeout(() => {
    if(li.classList.contains('trigger-enter')) {
      li.classList.add('trigger-enter-active');
    }
  }, 150);

  currentOpenDropdown = li;
}

function hideDropdown(li) {
  li.classList.remove('trigger-enter', 'trigger-enter-active');
}

// Handle clicks on nav items with dropdowns
triggers.forEach(trigger => {
  // Only add click handler to items that have dropdowns
  if (trigger.querySelector('.dropdown')) {
    const link = trigger.querySelector('a');
    
    // Prevent the link from navigating when clicked
    link.addEventListener('click', function(e) {

       if (window.innerWidth <= 768) {
        return;
      }

      e.preventDefault();
      showDropdown(trigger);
    });
  }
});

window.addEventListener('resize', function() {
  if (window.innerWidth <= 768 && currentOpenDropdown) {
    hideDropdown(currentOpenDropdown);
    currentOpenDropdown = null;
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  // Don't do anything if there's no open dropdown
  if (!currentOpenDropdown) return;
  
  // Check if the click target is inside ANY dropdown or is a cart control
  const clickedDropdown = e.target.closest('.dropdown');
  const clickedNavItem = e.target.closest('.nav-list > li');
  const isCartButton = e.target.classList.contains('qty-increase') || 
                       e.target.classList.contains('qty-decrease') || 
                       e.target.classList.contains('remove-item') ||
                       e.target.classList.contains('clearButton');
  
  // If clicked inside the dropdown OR is a cart button, don't close it
  if (clickedDropdown || isCartButton) {
    return;
  }
  
  // If clicked on a nav item (but not inside dropdown)
  if (clickedNavItem) {
    // Only close if it's a different nav item
    if (clickedNavItem !== currentOpenDropdown) {
      hideDropdown(currentOpenDropdown);
      currentOpenDropdown = null;
    }
  } else {
    // Clicked outside everything - close dropdown
    hideDropdown(currentOpenDropdown);
    currentOpenDropdown = null;
  }
});

// Optional: Close dropdown when pressing Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && currentOpenDropdown) {
    hideDropdown(currentOpenDropdown);
    currentOpenDropdown = null;
  }
});

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartDisplay();
  updateCartDropdown();
});

