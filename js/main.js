const btnCarrito = document.getElementById('btn-carrito');
const displayCarrito = document.getElementById('carrito');

const libros = [
  {
    id: 1,
    nombre: 'Señor de los Anillos: Comunidad del Anillo',
    precio: 60,
    imagen: 'lotr_comunidad.jpg',
  },
  {
    id: 2,
    nombre: 'Señor de los Anillos: Las dos torres',
    precio: 60,
    imagen: 'lotr_torres.jpg',
  },
  {
    id: 3,
    nombre: 'El hobbit',
    precio: 55,
    imagen: 'hobbit.jpg',
  },
  {
    id: 4,
    nombre: 'Harry Potter: El caliz de fuego',
    precio: 45,
    imagen: 'hp_caliz.jpg',
  },
  {
    id: 5,
    nombre: 'Harry Potter: El prisionero de Azkaban',
    precio: 50,
    imagen: 'hp_prisionero.jpg',
  },
  {
    id: 6,
    nombre: 'Las cronicas de Narnia',
    precio: 35,
    imagen: 'narnia.jpg',
  },
  {
    id: 7,
    nombre: 'Game of Thrones',
    precio: 55,
    imagen: 'game_of_thrones.jpg',
  },
  {
    id: 8,
    nombre: 'Alicia en el pais de las maravillas',
    precio: 40,
    imagen: 'alicia.jpg',
  },
  {
    id: 9,
    nombre: 'Moby Dick',
    precio: 40,
    imagen: 'moby_dick.jpg',
  },
  {
    id: 10,
    nombre: 'Los tres mosqueteros',
    precio: 45,
    imagen: 'tres_mosqueteros.jpg',
  },
];

class Libro {
  constructor(obj) {
    this.nombre = obj.nombre;
    this.id = obj.id;
    this.cantidad = obj.cantidad;
    this.precio = obj.precio;
    this.precioIva = this.agregarIva();
  }

  agregarIva() {
    return this.precio + (this.precio * 21) / 100;
  }
}

const carrito = [];

const generarHtmlCatalogo = () => {
  const inputBusqueda = document.querySelector('.filtros [name="busqueda"]');
  inputBusqueda.addEventListener('keyup', filtrarLibros);

  let catalogo = document.querySelector('#catalogo');

  libros.forEach((libro) => {
    let elemento = document.createElement('div');
    elemento.id = `card-${libro.id}`;
    elemento.className = 'card';
    elemento.innerHTML = `
      <img class="card__img" src="images/${libro.imagen}">
      <div class="card__info">
        <p class="card__nombre">${libro.nombre}</p>
        <p class="card__precio">$${libro.precio}</p>
      </div>
      <button class="card__btn">Añadir al carrito</button>`;

    catalogo.appendChild(elemento);
  });
};

const buscarLibro = (id) => {
  return libros.find((libro) => libro.id === id);
};

const filtrarLibros = (e) => {
  let catalogo = document.querySelector('#catalogo');
  let value = e.target.value;
  let librosFiltrados = libros.filter((el) =>
    el.nombre.toLowerCase().includes(value.toLowerCase())
  );

  catalogo.innerHTML = '';

  librosFiltrados.forEach((libro) => {
    let elemento = document.createElement('div');
    elemento.id = `card-${libro.id}`;
    elemento.className = 'card';
    elemento.innerHTML = `
      <img class="card__img" src="images/${libro.imagen}">
      <div class="card__info">
        <p class="card__nombre">${libro.nombre}</p>
        <p class="card__precio">$${libro.precio}</p>
      </div>
      <button class="card__btn">Añadir al carrito</button>`;

    catalogo.appendChild(elemento);
  });
  cargarLibrosCarrito();
};

const agregarLibro = (libro) => {
  if (carrito.some((item) => item.id === libro.id)) {
    let duplicado = carrito.find((item) => item.id === libro.id);
    duplicado.cantidad++;
  } else {
    libro.cantidad = 1;
    carrito.push(libro);
  }
};

const cargarLibrosCarrito = () => {
  let cardBtns = document.querySelectorAll('.card__btn');

  cardBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let itemId = parseInt(e.target.closest('.card').id.slice(5));

      agregarLibro(buscarLibro(itemId));
      generarHtmlCarrito();
    });
  });
};

const eliminarLibro = (id) => {
  if (carrito.some((el) => el.id === id)) {
    if (carrito.find((el) => el.id === id).cantidad === 1) {
      let posicion = carrito.findIndex((libro) => libro.id === id);
      carrito.splice(posicion, 1);
    } else {
      carrito.find((el) => el.id === id).cantidad--;
    }
  }
};

const eliminarLibrosCarrito = () => {
  let deleteBtns = document.querySelectorAll('.libro__eliminar');

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let itemId = parseInt(e.target.closest('.product-container').id.slice(9));

      eliminarLibro(itemId);
      generarHtmlCarrito();
    });
  });
};

const generarHtmlCarrito = () => {
  let contenedorCarrito = document.querySelector('.contenedor-carrito');
  let totalCarrito = document.querySelector('.total-carrito');

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = 'No hay productos en tu carrito.';
  } else {
    contenedorCarrito.innerHTML = '';
  }

  carrito.forEach((producto) => {
    let elemento = document.createElement('div');
    elemento.id = `producto-${producto.id}`;
    elemento.className = 'product-container';
    elemento.innerHTML = `
        <img class="libro__img" src="images/${producto.imagen}">
        <div class="libro__info">
          <p class="libro__nombre">${producto.nombre}</p>
          <p class="libro__precio">$${producto.precio}</p>
          <p class="libro__cantidad">Cantidad: ${producto.cantidad}</p>
        </div>
        <button class="libro__eliminar">&times</button>
      `;
    contenedorCarrito.appendChild(elemento);
  });

  let total = 0;
  let totalIva = 0;

  for (const item of carrito) {
    let libro = new Libro(item);
    libro.agregarIva();
    totalIva += libro.precioIva * libro.cantidad;
    total += libro.precio * libro.cantidad;
  }

  totalCarrito.innerHTML = `Total a pagar: $${total.toFixed(2)}
  <span>Impuesto IVA: $${(totalIva - total).toFixed(2)}</span>
  `;

  eliminarLibrosCarrito();
};

generarHtmlCatalogo();
cargarLibrosCarrito();

btnCarrito.addEventListener('click', () => {
  displayCarrito.classList.toggle('active');

  if (displayCarrito.classList.contains('active')) {
    btnCarrito.innerHTML = 'close';
  } else {
    btnCarrito.innerHTML = 'shopping_cart';
  }
});
