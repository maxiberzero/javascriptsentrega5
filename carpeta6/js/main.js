"use strict";

// PRE-ENTREGA 6: simulador de pedidos de viandas.
// Entradas con prompt y resultados con alert y console.log.

// 1. Clase con cinco propiedades y métodos de instancia.
class Vianda {
  constructor(id, nombre, categoria, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }

  reservar(cantidad) {
    if (
      !Number.isInteger(cantidad) ||
      cantidad <= 0 ||
      cantidad > this.stock
    ) {
      return false;
    }

    this.stock -= cantidad;
    return true;
  }

  devolver(cantidad) {
    this.stock += cantidad;
  }
}

// 2. Array de objetos creados con la clase.
// Precios ilustrativos en pesos argentinos.
const viandas = [
  new Vianda(1, "Pollo al horno con vegetales", "clasica", 6500, 8),
  new Vianda(2, "Milanesa con puré", "clasica", 7000, 6),
  new Vianda(3, "Tarta de espinaca y queso", "vegetariana", 5500, 10),
  new Vianda(4, "Berenjenas rellenas con queso", "vegetariana", 6000, 5),
  new Vianda(5, "Bowl de garbanzos y quinoa", "vegana", 5800, 7),
  new Vianda(6, "Guiso de lentejas y verduras", "vegana", 5200, 0)
];

const carrito = [];

// 3. Funciones auxiliares.
function formatoPrecio(importe) {
  return "$ " + importe.toFixed(2) + " ARS";
}

function informar(mensaje) {
  console.log(mensaje);
  alert(mensaje);
}

function pedirNumero(mensaje, minimo, entero) {
  while (true) {
    const entrada = prompt(
      mensaje + "\nCancelar: volver al menú."
    );

    if (entrada === null) {
      return null;
    }

    const texto = entrada.trim();
    const numero = Number(texto.replace(",", "."));

    if (
      texto !== "" &&
      Number.isFinite(numero) &&
      numero >= minimo &&
      (!entero || Number.isInteger(numero))
    ) {
      return numero;
    }

    informar(
      "Ingresá un número válido, mayor o igual a " + minimo +
      (
        entero
          ? ", sin decimales."
          : ". Usá números sin separador de miles."
      )
    );
  }
}

function mostrarViandas(lista, titulo) {
  console.log(titulo);

  if (lista.length === 0) {
    informar("No hay viandas que coincidan con tu búsqueda.");
    return;
  }

  let detalle = titulo + "\n\n";

  // forEach: recorre y muestra los resultados.
  lista.forEach((vianda) => {
    const fila =
      "ID " + vianda.id +
      " | " + vianda.nombre +
      " | " + vianda.categoria +
      " | " + formatoPrecio(vianda.precio) +
      " | Stock: " + vianda.stock;

    console.log(fila);
    detalle += fila + "\n";
  });

  alert(detalle);
}

// 4. Primer método de búsqueda: find.
function buscarPorId() {
  const id = pedirNumero(
    "Ingresá el ID de la vianda que querés consultar:",
    1,
    true
  );

  if (id === null) {
    return;
  }

  const encontrada = viandas.find(
    (vianda) => vianda.id === id
  );

  if (encontrada === undefined) {
    informar("No existe una vianda con el ID " + id + ".");
    return;
  }

  mostrarViandas(
    [encontrada],
    "Resultado de la búsqueda por ID"
  );
}

// 5. Segundo método de búsqueda: filter.
function filtrarViandas() {
  const opcion = prompt(
    "Elegí una categoría:\n" +
    "1. Clásica\n" +
    "2. Vegetariana\n" +
    "3. Vegana\n" +
    "4. Todas\n" +
    "Cancelar: volver al menú."
  );

  if (opcion === null) {
    return;
  }

  let categoria;

  switch (opcion.trim()) {
    case "1":
      categoria = "clasica";
      break;

    case "2":
      categoria = "vegetariana";
      break;

    case "3":
      categoria = "vegana";
      break;

    case "4":
      categoria = "todas";
      break;

    default:
      informar("La categoría debe ser una opción del 1 al 4.");
      return;
  }

  const presupuesto = pedirNumero(
    "Precio máximo por vianda (sin separador de miles):",
    0,
    false
  );

  if (presupuesto === null) {
    return;
  }

  const resultados = viandas.filter((vianda) =>
    (categoria === "todas" || vianda.categoria === categoria) &&
    vianda.precio <= presupuesto &&
    vianda.stock > 0
  );

  mostrarViandas(
    resultados,
    "Viandas disponibles hasta " + formatoPrecio(presupuesto)
  );
}

// 6. Agregar viandas al carrito y reservar su stock.
function agregarAlCarrito() {
  const id = pedirNumero(
    "Ingresá el ID de la vianda que querés agregar:",
    1,
    true
  );

  if (id === null) {
    return;
  }

  const vianda = viandas.find(
    (producto) => producto.id === id
  );

  if (vianda === undefined) {
    informar("El ID ingresado no existe. Consultá el menú de viandas.");
    return;
  }

  if (vianda.stock === 0) {
    informar("Esta vianda está agotada.");
    return;
  }

  const cantidad = pedirNumero(
    "¿Cuántas unidades de " + vianda.nombre +
    " querés? Disponibles: " + vianda.stock + ".",
    1,
    true
  );

  if (cantidad === null) {
    return;
  }

  if (!vianda.reservar(cantidad)) {
    informar(
      "Stock insuficiente. Solo quedan " + vianda.stock + " unidades."
    );
    return;
  }

  const existente = carrito.find(
    (item) => item.vianda.id === id
  );

  if (existente === undefined) {
    carrito.push({
      vianda: vianda,
      cantidad: cantidad
    });
  } else {
    existente.cantidad += cantidad;
  }

  informar(
    "Agregaste " + cantidad +
    " unidad(es) de " + vianda.nombre +
    ". Stock disponible: " + vianda.stock + "."
  );
}

// 7. Transformación con map.
// Crea un nuevo array con el detalle y los subtotales.
function obtenerDetalleCarrito() {
  return carrito.map((item) => ({
    id: item.vianda.id,
    nombre: item.vianda.nombre,
    precioUnitario: item.vianda.precio,
    cantidad: item.cantidad,
    subtotal: item.vianda.precio * item.cantidad
  }));
}

// 8. Transformación con reduce.
// Acumula los subtotales para obtener el total del pedido.
function calcularTotal(detalle) {
  return detalle.reduce(
    (acumulador, item) => acumulador + item.subtotal,
    0
  );
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    informar("Tu pedido está vacío. Agregá viandas desde la opción 4.");
    return;
  }

  const detalle = obtenerDetalleCarrito();
  const total = calcularTotal(detalle);

  let mensaje = "TU PEDIDO\n\n";

  console.log("Detalle del pedido generado con map:", detalle);

  detalle.forEach((item) => {
    mensaje +=
      item.cantidad + " x " + item.nombre +
      " = " + formatoPrecio(item.subtotal) + "\n";
  });

  mensaje += "\nTOTAL: " + formatoPrecio(total);

  console.log("Total calculado con reduce:", total);
  informar(mensaje);
}

// Devuelve las unidades reservadas y vacía el carrito.
function vaciarCarrito() {
  carrito.forEach(
    (item) => item.vianda.devolver(item.cantidad)
  );

  carrito.length = 0;
}

function confirmarPedido() {
  if (carrito.length === 0) {
    informar("No podés confirmar un pedido vacío.");
    return;
  }

  mostrarCarrito();

  const respuesta = prompt(
    "Escribí SI para confirmar el pedido simulado.\n" +
    "Cualquier otra respuesta conserva el pedido sin confirmar."
  );

  if (
    respuesta === null ||
    (
      respuesta.trim().toUpperCase() !== "SI" &&
      respuesta.trim().toUpperCase() !== "SÍ"
    )
  ) {
    informar("El pedido sigue en tu carrito, sin confirmar.");
    return;
  }

  const detalle = obtenerDetalleCarrito();

  console.log("PEDIDO CONFIRMADO:", detalle);
  console.log("TOTAL FINAL:", calcularTotal(detalle));

  // El stock ya se descontó al agregar las viandas.
  // Confirmar no lo descuenta por segunda vez.
  carrito.length = 0;

  informar(
    "¡Pedido confirmado! Total: " +
    formatoPrecio(calcularTotal(detalle)) +
    ".\nEs una simulación: no se realiza ningún cobro ni envío."
  );
}

// 9. Menú principal.
function iniciarSimulador() {
  alert(
    "Bienvenido a Viandas del Día.\n" +
    "Abrí la consola con F12 para ver los resultados.\n" +
    "Los precios son ilustrativos. Los datos se reinician al recargar."
  );

  let continuar = true;

  while (continuar) {
    const opcion = prompt(
      "VIANDAS DEL DÍA\n\n" +
      "1. Ver todas las viandas\n" +
      "2. Buscar una vianda por ID\n" +
      "3. Filtrar por categoría y precio máximo\n" +
      "4. Agregar viandas al pedido\n" +
      "5. Ver pedido y total\n" +
      "6. Vaciar pedido\n" +
      "7. Confirmar pedido\n" +
      "0. Salir\n\n" +
      "Cancelar también cierra el simulador."
    );

    if (opcion === null || opcion.trim() === "0") {
      vaciarCarrito();

      informar(
        "Simulador cerrado. Se liberó el stock de los pedidos sin confirmar."
      );

      continuar = false;
    } else {
      switch (opcion.trim()) {
        case "1":
          mostrarViandas(viandas, "Menú de viandas");
          break;

        case "2":
          buscarPorId();
          break;

        case "3":
          filtrarViandas();
          break;

        case "4":
          agregarAlCarrito();
          break;

        case "5":
          mostrarCarrito();
          break;

        case "6":
          vaciarCarrito();
          informar(
            "Pedido vacío. Las unidades reservadas vuelven al stock."
          );
          break;

        case "7":
          confirmarPedido();
          break;

        default:
          informar("Opción inválida. Elegí un número del 0 al 7.");
      }
    }
  }
}

// 10. Conexión del botón con el simulador.
// Los prompts comienzan después del clic.
const botonIniciar = document.getElementById("iniciar");
const estado = document.getElementById("estado");

botonIniciar.disabled = false;
estado.textContent = "JavaScript conectado. Presioná Iniciar simulador.";

botonIniciar.addEventListener("click", () => {
  iniciarSimulador();

  estado.textContent =
    "Simulador cerrado. Podés volver a iniciarlo con el botón.";
});