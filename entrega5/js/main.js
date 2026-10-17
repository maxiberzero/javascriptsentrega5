
/* Pre-Entrega 5: Instanciando Objetos
   Proyecto: Simulador de pedidos de viandas saludables
*/

// 1. Creamos la clase Vianda
class Vianda {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    // Método para calcular un descuento
    aplicarDescuento(porcentaje) {
        return this.precio - (this.precio * porcentaje / 100);
    }

    // Método para vender viandas y actualizar el stock
    vender(cantidad) {
        if (cantidad > 0 && cantidad <= this.stock) {
            this.stock = this.stock - cantidad;
            return true;
        } else {
            return false;
        }
    }

    // Método para mostrar los datos de la vianda
    mostrarInfo() {
        return this.nombre + " - Precio: $" + this.precio +
            " - Stock disponible: " + this.stock;
    }
}

// 2. Instanciamos objetos usando new
const viandaPollo = new Vianda(1, "Pollo", 7000, "Tradicional", 10);
const viandaVegetariana = new Vianda(2, "Vegetariana", 6500, "Vegetariana", 8);
const viandaCarne = new Vianda(3, "Carne", 7500, "Tradicional", 6);

// 3. Guardamos los objetos en un array
const viandasDisponibles = [
    viandaPollo,
    viandaVegetariana,
    viandaCarne
];

// 4. Mostramos la información inicial en la consola
console.log("=== MENÚ INICIAL ===");

for (const vianda of viandasDisponibles) {
    console.log(vianda.mostrarInfo());
}

// 5. Probamos el método aplicarDescuento()
const precioConDescuento = viandaVegetariana.aplicarDescuento(10);

console.log("=== PRUEBA DE DESCUENTO ===");
console.log("Precio original vegetariana: $" + viandaVegetariana.precio);
console.log("Precio con 10% de descuento: $" + precioConDescuento);

// 6. Mostramos las viandas disponibles en una ventana
const listaViandas = viandasDisponibles
    .map(vianda => vianda.nombre + " - $" + vianda.precio)
    .join("\n");

alert("VIANDAS DISPONIBLES\n\n" + listaViandas);

// 7. Buscamos una vianda usando su nombre
const busqueda = prompt("¿Qué vianda querés buscar?");

if (busqueda !== null && busqueda.trim() !== "") {
    const viandaEncontrada = viandasDisponibles.find(
        vianda => vianda.nombre.toLowerCase() === busqueda.trim().toLowerCase()
    );

    if (viandaEncontrada) {
        alert("Encontramos la vianda:\n" + viandaEncontrada.mostrarInfo());
        console.log("Vianda encontrada:", viandaEncontrada);
    } else {
        alert("La vianda que buscás no está disponible.");
    }
} else {
    alert("No ingresaste ninguna vianda para buscar.");
}

// 8. Realizamos un pedido
const opcion = prompt(
    "¿Qué vianda querés pedir?\n" +
    "1. Pollo - $7000\n" +
    "2. Vegetariana - $6500\n" +
    "3. Carne - $7500"
);

let viandaElegida = null;

if (opcion === "1") {
    viandaElegida = viandaPollo;
} else if (opcion === "2") {
    viandaElegida = viandaVegetariana;
} else if (opcion === "3") {
    viandaElegida = viandaCarne;
}

if (viandaElegida !== null) {
    const cantidadIngresada = prompt("¿Cuántas viandas querés pedir?");
    const cantidad = Number(cantidadIngresada);

    if (
        cantidadIngresada !== null &&
        cantidadIngresada.trim() !== "" &&
        Number.isInteger(cantidad) &&
        cantidad > 0
    ) {
        // Comprobamos el stock antes de confirmar el pedido
        if (cantidad <= viandaElegida.stock) {
            const subtotal = viandaElegida.precio * cantidad;
            let totalFinal = subtotal;

            // Mantenemos el descuento del 10% por 3 viandas o más
            if (cantidad >= 3) {
                totalFinal = subtotal - (subtotal * 10 / 100);
                console.log("Se aplicó un descuento del 10% al pedido.");
            }

            // Actualizamos el stock mediante el método de la clase
            const ventaRealizada = viandaElegida.vender(cantidad);

            if (ventaRealizada) {
                console.log("=== RESUMEN DEL PEDIDO ===");
                console.log("Vianda: " + viandaElegida.nombre);
                console.log("Cantidad: " + cantidad);
                console.log("Precio por unidad: $" + viandaElegida.precio);
                console.log("Subtotal: $" + subtotal);
                console.log("Total final: $" + totalFinal);
                console.log("Stock restante: " + viandaElegida.stock);

                alert(
                    "PEDIDO CONFIRMADO\n\n" +
                    "Vianda: " + viandaElegida.nombre + "\n" +
                    "Cantidad: " + cantidad + "\n" +
                    "Total a pagar: $" + totalFinal + "\n" +
                    "Stock restante: " + viandaElegida.stock
                );

                // Ciclo para simular la preparación de las viandas
                for (let i = 1; i <= cantidad; i++) {
                    console.log("Preparando vianda número " + i);
                }
            }
        } else {
            alert("No hay suficiente stock para ese pedido.");
            console.log("Stock disponible: " + viandaElegida.stock);
        }
    } else {
        alert("Ingresá una cantidad entera mayor que cero.");
    }
} else {
    alert("La opción ingresada no es válida.");
}

// 9. Mostramos el estado final de los objetos
console.log("=== ESTADO FINAL DEL MENÚ ===");

for (const vianda of viandasDisponibles) {
    console.log(vianda.mostrarInfo());
}
