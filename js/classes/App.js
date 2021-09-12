import { crearDB, obtenerClientes, borrarCliente } from "./funciones.js";
import { listadoCliente } from "./selectores.js";

class App {
  constructor() {
    this.initApp();
  }

  initApp() {
    document.addEventListener('DOMContentLoaded', () => {
      crearDB();
      if (window.indexedDB.open('crm', 2)) {
        setTimeout(() => {
          obtenerClientes();
        }, 250);
      }
      listadoCliente.addEventListener('click', borrarCliente);
    });
  }
};

export default App;


