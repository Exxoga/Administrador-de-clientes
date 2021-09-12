import { conectarDB, validarFormulario } from "./classes/funciones.js";
import { formulario } from "./classes/selectores.js";


document.addEventListener('DOMContentLoaded', () => {
  conectarDB();
  setTimeout(() => {
    formulario.addEventListener('submit', validarFormulario);
  }, 100);

});




