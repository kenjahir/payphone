const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image:
      "https://marinaracewear.com/storage/media/attributes/8/9/5/9/7/89597/2.jpg",
  },
  {
    name: "Jordan Air Force 1",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image:
      "https://neweraec.vtexassets.com/arquivos/ids/156733/10047531_1.jpg?v=638324710543770000",
  },
  {
    name: "Jordan Retro 4",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Sudadera Nike",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Jordan 1 High",
    price: 169.99,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Pantalón Adidas",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Camiseta Polo",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Jordan Dunk Low",
    price: 99.99,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Chaqueta Deportiva",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Gorra Yankees",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop&crop=center",
  },
  {
    name: "Jordan Air Max",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center",
  },
];

const container = document.getElementById("product-list");
const cartList = document.getElementById("cart");
const cart = JSON.parse(localStorage.getItem("cart")) || [];
let ppButton = null;

function getCategory(name) {
  const n = name.toLowerCase();
  if (/(jordan|air max|retro|dunk|nike)/.test(n)) return "Calzado";
  if (/(gorra|yankees|accesorio)/.test(n)) return "Accesorios";
  if (/(camiseta|chaqueta|sudadera|pantalón|pantalon|polo)/.test(n))
    return "Ropa";
  if (/(laptop|computadora|pc)/.test(n)) return "Tecnología";
  if (/(audifonos|audífonos|audio)/.test(n)) return "Audio";
  return "General";
}

function getDescription(name) {
  const map = {
    "Laptop Gamer": "Laptop de alto rendimiento para gaming y trabajo",
  };
  return map[name] || "Producto confiable con la mejor relación calidad/precio";
}

// Renderizar productos
products.forEach((product) => {
  const card = document.createElement("div");
  card.className = "card";

  const category = getCategory(product.name);
  const desc = getDescription(product.name);
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}"
         onerror="this.src='https://via.placeholder.com/800x450/eff4ff/8aa7d6?text=${encodeURIComponent(
           product.name
         )}'" />
    <h2>${product.name}</h2>
    <p class="desc">${desc}</p>
    <div class="price">$${product.price.toFixed(2)}</div>
    <div class="meta"><span class="dot"></span><span>${category}</span></div>
    <button><span aria-hidden="true">🛒</span> Agregar</button>
  `;

  const button = card.querySelector("button");
  button.addEventListener("click", () => {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });

  container.appendChild(card);
});

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <span class="item-info">${item.name} - $${item.price.toFixed(2)}</span>
      <button class="delete-btn" onclick="removeFromCart(${index})" title="Eliminar producto">
        🗑️
      </button>
    `;

    cartList.appendChild(li);
    total += item.price;
  });

  const cartTotal = document.getElementById("cart-total");
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }

  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = String(cart.length);

  const ppButtonContainer = document.getElementById("pp-button");
  if (cart.length === 0) {
    if (ppButtonContainer) {
      ppButtonContainer.innerHTML = "";
      ppButtonContainer.style.display = "none";
    }
    const payButton = document.getElementById("pay-button");
    if (payButton) payButton.style.display = "inline-block";
  }
}

// Función para eliminar productos del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  // Mostrar mensaje de confirmación
  showPaymentMessage("Producto eliminado del carrito", "info");
}

function clearCart() {
  cart.length = 0; // Limpiar el array
  localStorage.removeItem("cart"); // Eliminar del localStorage
  updateCart(); // Actualizar la vista
}

function initPaymentBox(total) {
  const amountInCents = Math.round(total * 100);
  const transactionId = `TRX_${Date.now()}`;

  localStorage.setItem("lastTransactionAmount", total.toFixed(2));
  localStorage.setItem("lastTransactionId", transactionId);

  const ppButtonContainer = document.getElementById("pp-button");
  ppButtonContainer.innerHTML = "";

  // Mostrar mensaje de que se está preparando el pago
  showPaymentMessage(
    "Preparando el pago... Por favor, complete la transacción en su dispositivo.",
    "info"
  );

  if (window.PPaymentButtonBox) {
    ppButton = new window.PPaymentButtonBox({
      token:
        "kzw90LZHHqT1S-4MSYvNFYX5ujdKcD9LY-RXsz9I8tWPdY8wH88K2b8I5Z03DSInYXJJbOvd8eEz1vUgVMX83t9BViy17UfBRflc7oZxu9adEDCnE98vo4nGOw17TpauMLbcIArHqnkDAnC6eJvJioKkJNEsBQQp-5ymCSKfv6bBQfnyz8LHYf8qp2tFs1nlf51yyB9cdkBGaohqYPwoK5fiTIRTiIjoHNlvOHFtlyNnwOVafAV1D71Dt4Dxvm2yZnyJHkmh3Lh2skjWpPGselppgUeElcWNOFbERwxwrp6WrYfbrnL1BJaZY1QO3nzfz35lcw",
      clientTransactionId: transactionId,
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: "USD",
      storeId: "06a7824d-0969-4635-9a9b-8bc7597c3ba0",
      reference: `Compra en tienda - ${transactionId}`,
      lang: "es",
      defaultMethod: "card",
      timeZone: -5,
      redirect: false,

      onSuccessfulPayment: (response) => {
        console.log("✅ Pago exitoso desde la aplicación:", response);

        // Limpiar carrito inmediatamente
        clearCart();

        // Mostrar mensaje de éxito grande y visible
        showPaymentMessage(
          "🎉 ¡PAGO EXITOSO! Su compra ha sido procesada correctamente.",
          "success",
          true
        );

        const transactionIdFromResponse =
          response.transactionId || response.id || "sin-id";
        const transactionStatus = "Approved";

        // Guardar información del pago
        localStorage.setItem("paymentStatus", transactionStatus);
        localStorage.setItem("transactionId", transactionIdFromResponse);
        localStorage.setItem("paymentResponse", JSON.stringify(response));

        // Ocultar botón de pago y mostrar botón para ir a confirmación
        document.getElementById("pay-button").style.display = "none";
        document.getElementById("pp-button").style.display = "none";

        // Crear botón para ir a confirmación
        setTimeout(() => {
          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Ver Detalles de la Compra";
          confirmButton.className = "pay-button";
          confirmButton.style.backgroundColor = "#007ac1";
          confirmButton.onclick = () => {
            window.location.href = `confirmacion.html?clientTransactionId=${transactionId}&transactionId=${transactionIdFromResponse}&transactionStatus=${transactionStatus}`;
          };

          const cartContainer = document.querySelector(".cart-container");
          cartContainer.appendChild(confirmButton);
        }, 3000);
      },

      onCancelledPayment: (response) => {
        console.log("❌ Pago cancelado:", response);
        showPaymentMessage("Pago cancelado por el usuario", "info");
        document.getElementById("pay-button").style.display = "inline-block";
        document.getElementById("pp-button").style.display = "none";
      },

      onFailurePayment: (error) => {
        console.log("💥 Error en el pago:", error);
        showPaymentMessage(
          "Error en el pago: " + (error.message || "Error desconocido"),
          "error"
        );
        document.getElementById("pay-button").style.display = "inline-block";
        document.getElementById("pp-button").style.display = "none";
      },
    });

    ppButton.render("pp-button");
    document.getElementById("pp-button").style.display = "block";
  } else {
    console.error("PayPhone no está disponible");
    showPaymentMessage(
      "Error al cargar el botón de pago. Intente más tarde.",
      "error"
    );
    document.getElementById("pay-button").style.display = "inline-block";
  }
}

function showPaymentMessage(message, type, isPermanent = false) {
  const paymentResponse = document.getElementById("payment-response");
  if (paymentResponse) {
    paymentResponse.textContent = message;
    paymentResponse.style.display = "block";
    paymentResponse.className = `payment-response ${type}`;

    // Si es un mensaje de éxito, hacerlo más grande y visible
    if (type === "success") {
      paymentResponse.style.fontSize = "1.3rem";
      paymentResponse.style.padding = "1.5rem";
      paymentResponse.style.fontWeight = "bold";
      paymentResponse.style.border = "3px solid #28a745";
      paymentResponse.style.boxShadow = "0 4px 15px rgba(40, 167, 69, 0.3)";
    }

    // No ocultar automáticamente si es permanente
    if (!isPermanent) {
      let timeout = 5000;
      if (type === "success") timeout = 8000;
      if (type === "info" && message.includes("dispositivo")) timeout = 8000;

      setTimeout(() => {
        paymentResponse.style.display = "none";
      }, timeout);
    }
  }
}

// Verificar si hay parámetros de pago exitoso en la URL al cargar la página
function checkPaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get("id") || urlParams.get("transactionId");
  const clientTransactionId = urlParams.get("clientTransactionId");

  if (transactionId && clientTransactionId) {
    // Limpiar carrito si hay parámetros de pago exitoso
    clearCart();
    showPaymentMessage(
      "🎉 ¡PAGO COMPLETADO EXITOSAMENTE! Su compra ha sido procesada.",
      "success",
      true
    );

    // Limpiar la URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay pago exitoso en la URL
  checkPaymentSuccess();

  updateCart();
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = String(cart.length);

  const payButton = document.getElementById("pay-button");
  payButton.addEventListener("click", () => {
    if (cart.length === 0) {
      showPaymentMessage(
        "El carrito está vacío. Agrega productos antes de pagar.",
        "info"
      );
      return;
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    payButton.style.display = "none";
    initPaymentBox(total);
  });

  setTimeout(() => {
    if (!window.PPaymentButtonBox) {
      console.error("No se pudo cargar PayPhone");
    } else {
      console.log("PayPhone cargado correctamente");
    }
  }, 1000);
});
