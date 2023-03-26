const enlaceCarrito = document.querySelector('#mostrar-carrito');
const modalCarrito = document.querySelector('#carrito-modal');
const botonCerrarCarrito = document.querySelector('#cerrar-carrito');

enlaceCarrito.addEventListener('click', () => {
  modalCarrito.style.display = 'block';
});

botonCerrarCarrito.addEventListener('click', () => {
  modalCarrito.style.display = 'none';
});

window.addEventListener('click', (evento) => {
  if (evento.target == modalCarrito) {
    modalCarrito.style.display = 'none';
  }
});

let total = 0;

function addToCart(producto, precio, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productoEnCarrito = carrito.find(item => item.producto === producto);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += parseInt(cantidad) || 1;
    } else {
        carrito.push({ producto, precio: parseFloat(precio), cantidad: parseInt(cantidad) || 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    total += parseFloat(precio) * (parseInt(cantidad) || 1); 
    renderCart();
}

function renderCart() {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let modalCuerpo = document.querySelector('#carrito-modal .modal-cuerpo');
  modalCuerpo.innerHTML = '';
  let total = 0; 

  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    let productoHTML = `
      <div class="carrito-item">        
        <div class="carrito-item-detalles">
            <div class="carrito-item-titulo-cantidad">
                <span class="carrito-item-titulo">${item.producto}</span>
                <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad" data-indice="${i}"></i>
                <input type="text" value="${item.cantidad}" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad" data-indice="${i}"></i>
                </div>
            </div>
            <div class="carrito-item-precio-eliminar">
                <h3>Precio:</h3>
                <span class="carrito-item-precio">${parseFloat(item.precio) * item.cantidad}</span>
                <button class="btn-eliminar" data-indice="${i}">
                <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>           
      </div>
    `;
    modalCuerpo.innerHTML += productoHTML;
    total += parseFloat(item.precio) * item.cantidad;
  }

  let totalHTML = `
    <div class = "totales">
      <h3>Total:</h3>
      <p>${total}</p>
    </div>
  `;
  modalCuerpo.innerHTML += totalHTML;

  let botonesEliminar = document.querySelectorAll('.btn-eliminar');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', () => {
      let indice = boton.dataset.indice;
      carrito.splice(indice, 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      renderCart();
    });
  });

  let botonesRestarCantidad = document.querySelectorAll('.restar-cantidad');
  botonesRestarCantidad.forEach((boton) => {
    boton.addEventListener('click', () => {
      let indice = boton.dataset.indice;
      let cantidad = carrito[indice].cantidad;
      if (cantidad > 1) {
        carrito[indice].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCart();
      }
    });
  });

  let botonesSumarCantidad = document.querySelectorAll('.sumar-cantidad');
  botonesSumarCantidad.forEach((boton) => {
    boton.addEventListener('click', () => {
      let indice = boton.dataset.indice;
      carrito[indice].cantidad++;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      renderCart();
    });
  });
}

  document.querySelector('#vaciar-carrito').addEventListener('click', () => {
    localStorage.removeItem('carrito');
    renderCart();
  });

  document.querySelector('#mostrar-carrito').addEventListener('click', () => {
    renderCart();
    document.querySelector('#carrito-modal').classList.add('mostrar');
  });

  document.querySelector('#cerrar-carrito').addEventListener('click', () => {
    document.querySelector('#carrito-modal').classList.remove('mostrar');
  });
  
  document.querySelector('#pagar-carrito').addEventListener('click', () => {
    swal({
      title: 'Confirmar compra',
      text: '¿Estás seguro de que deseas realizar esta compra?',
      icon: 'warning',
      buttons: ['Cancelar', 'Confirmar'],
      dangerMode: true,
    })
    .then((confirmado) => {
      if (confirmado) {
        localStorage.removeItem('carrito');
        renderCart();
      }
    });
  });