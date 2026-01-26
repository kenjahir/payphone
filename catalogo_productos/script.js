const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://marinaracewear.com/storage/media/attributes/8/9/5/9/7/89597/2.jpg"
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://zapatosxmayor.com/wp-content/uploads/2020/11/zapato-casual-hombre-zapatos-negros.jpg"
  },
  {
    name: "Gorra blue",
    price: 14.99,
    image: "https://neweraec.vtexassets.com/arquivos/ids/156733/10047531_1.jpg?v=638324710543770000"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let ppButton = null;

// Renderizar productos
products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
  });

  container.appendChild(card);
});

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });

  const cartTotal = document.getElementById('cart-total');
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }

  const ppButtonContainer = document.getElementById('pp-button');
  if (cart.length === 0) {
    if (ppButtonContainer) {
      ppButtonContainer.innerHTML = '';
      ppButtonContainer.style.display = 'none';
    }
    const payButton = document.getElementById('pay-button');
    if (payButton) payButton.style.display = 'inline-block';
  }
}

function initPaymentBox(total) {
  const amountInCents = Math.round(total * 100);
  const transactionId = `TRX_${Date.now()}`;

  localStorage.setItem('lastTransactionAmount', total.toFixed(2));
  localStorage.setItem('lastTransactionId', transactionId);

  const ppButtonContainer = document.getElementById('pp-button');
  ppButtonContainer.innerHTML = '';

  if (window.PPaymentButtonBox) {
    ppButton = new window.PPaymentButtonBox({
      token: 'l4kopFGYe7zT_H12gik7AkOfsaHrsa3WBTuG7xH7ivgixbGfnSqgIqM3-EEmFhWHiax6xI3s3GcAV86XVk6VKz0wWSC4Gts4naP0LqMKI6Wuu1439y_BE_Phh0R-7NVWO88wOZP1TToWMUKJk51JV57_ZwE1PVWptpYUmEsF73-RBHMIbeJ7ogy5zuGmdZaAzL-DYQfyry96H5y8-Rxyz1EqLBq5CvWTAg1795Y5nZrZgD_bNgf_c0tWILYeG_OIaZeTV76p5Ek5BqSoUewN6TG_PLZ0fuaT--fIe_Xt5WnVt1ACYUfVNE8BSlg-RlyTFKTqcO6LFjaPjpYddFTBigOwLbA',
      clientTransactionId: transactionId,
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: "USD",
      storeId: "40f4460f-fe0c-439f-912b-bf8bda2a3220",
      reference: `Compra en tienda - ${transactionId}`,
      lang: "es",
      defaultMethod: "card",
      timeZone: -5,
      redirect: false,

      onSuccessfulPayment: function (response) {
        console.log("Pago exitoso:", response);

        const transactionIdFromResponse = response.transactionId || 'sin-id';
        const transactionStatus = 'Approved';

        localStorage.setItem('paymentStatus', transactionStatus);
        localStorage.setItem('transactionId', transactionIdFromResponse);
        localStorage.removeItem('cart');

        window.location.href = `confirmacion.html?clientTransactionId=${transactionId}&transactionId=${transactionIdFromResponse}&transactionStatus=${transactionStatus}`;
      },

      onCancelledPayment: function () {
        showPaymentMessage('Pago cancelado', 'info');
        document.getElementById('pay-button').style.display = 'inline-block';
        document.getElementById('pp-button').style.display = 'none';
      },

      onFailurePayment: function (error) {
        showPaymentMessage('Error en el pago: ' + error.message, 'error');
        document.getElementById('pay-button').style.display = 'inline-block';
        document.getElementById('pp-button').style.display = 'none';
      }
    });

    ppButton.render("pp-button");
    document.getElementById('pp-button').style.display = 'block';
  } else {
    console.error("PayPhone no está disponible");
    showPaymentMessage("Error al cargar el botón de pago. Intente más tarde.", "error");
    document.getElementById('pay-button').style.display = 'inline-block';
  }
}

function showPaymentMessage(message, type) {
  const paymentResponse = document.getElementById('payment-response');
  if (paymentResponse) {
    paymentResponse.textContent = message;
    paymentResponse.style.display = 'block';
    paymentResponse.className = `payment-response ${type}`;
    setTimeout(() => {
      paymentResponse.style.display = 'none';
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCart();

  const payButton = document.getElementById('pay-button');
  payButton.addEventListener('click', () => {
    if (cart.length === 0) {
      showPaymentMessage("El carrito está vacío. Agrega productos antes de pagar.", "info");
      return;
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    payButton.style.display = 'none';
    initPaymentBox(total);
  });

  setTimeout(() => {
    if (!window.PPaymentButtonBox) {
      console.error('No se pudo cargar PayPhone');
    } else {
      console.log('PayPhone cargado correctamente');
    }
  }, 1000);
});
