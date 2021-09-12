import { conectarDB, actualizarCliente, datosCliente } from "./classes/funciones.js"
import { formulario } from "./classes/selectores.js";

document.addEventListener('DOMContentLoaded', () => {
  conectarDB();

  formulario.addEventListener('submit', actualizarCliente);

  const parametrosURL = new URLSearchParams(window.location.search);
  const idCliente = parametrosURL.get('id');
  if (idCliente) {
    setTimeout(() => {
      datosCliente(idCliente)
    }, 100);
  }
})