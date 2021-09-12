import { formulario, listadoCliente, nombreInput, telefonoInput, empresaInput, emailInput } from "./selectores.js";

let DB;


export function crearDB() {
  const crearDB = window.indexedDB.open('crm', 2);
  crearDB.onerror = function () {
    console.log('Hubo un error');
  }
  crearDB.onsuccess = function () {
    DB = crearDB.result;
  }
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore('crm', {
      keyPath: 'id',
      autoIncrement: true
    });

    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('empresa', 'empresa', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });
  }
}

export function conectarDB() {
  const conectarDB = window.indexedDB.open('crm', 2);
  conectarDB.onerror = function () {
    console.log('Hubo un error');
  }
  conectarDB.onsuccess = function () {
    DB = conectarDB.result;
  }
}

export function validarFormulario(e) {
  e.preventDefault();

  const nombre = document.querySelector('#nombre').value;
  const telefono = document.querySelector('#telefono').value;
  const empresa = document.querySelector('#empresa').value;
  const email = document.querySelector('#email').value;

  if (nombre === '' || telefono === '' || empresa === '' || email === '') {
    imprimirAlerta('Todos los campos son requeridos', 'error');
    return;
  }

  const cliente = {
    nombre,
    telefono,
    empresa,
    email,
    id: Date.now()
  };

  agregarCliente(cliente);
  obtenerClientes();
}

export function imprimirAlerta(mensaje, tipo) {
  const alerta = document.querySelector('.alerta');
  if (!alerta) {
    const divAlerta = document.createElement('div');
    divAlerta.textContent = mensaje;
    divAlerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

    if (tipo === 'error') {
      divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
    } else {
      divAlerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }


    formulario.appendChild(divAlerta);
    setTimeout(() => {
      divAlerta.remove();
    }, 1500);
  }
}

function agregarCliente(datos) {
  const transaction = DB.transaction(['crm'], 'readwrite');
  const objectStore = transaction.objectStore('crm');
  objectStore.add(datos);
  transaction.onerror = function () {
    imprimirAlerta('El E-mail ya existe en la base de Datos');
  }
  transaction.oncomplete = function () {
    imprimirAlerta('El cliente fue agregado correctamente');
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

export function obtenerClientes() {
  const objectStore = DB.transaction('crm').objectStore('crm');
  objectStore.openCursor().onsuccess = function (e) {
    const cursor = e.target.result;

    if (cursor) {
      const { nombre, empresa, telefono, email, id } = cursor.value;

      listadoCliente.innerHTML += ` 
          <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5 editar">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
          </td>
          </tr>
        `;

      cursor.continue();
    }
  }
}

export function actualizarCliente(e) {
  e.preventDefault()

  if (nombreInput === '' || empresaInput === '' || telefonoInput === '' || emailInput === '') {
    imprimirAlerta('Todos los campos son requeridos', 'error')
    return;
  }

  const parametrosURL = new URLSearchParams(window.location.search);
  const idCliente = parametrosURL.get('id');

  const clienteActualizado = {
    nombre: nombreInput.value,
    empresa: empresaInput.value,
    telefono: telefonoInput.value,
    email: emailInput.value,
    id: Number(idCliente)
  }

  const transaction = DB.transaction(['crm'], 'readwrite');
  const objectStore = transaction.objectStore('crm');
  objectStore.put(clienteActualizado);
  transaction.onerror = function () {
    console.log('hubo un error');
  }
  transaction.oncomplete = function () {
    imprimirAlerta('Cliente editado correctamente');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }


}

export function datosCliente(id) {
  const transaction = DB.transaction(['crm'], 'readwrite');
  const objectStore = transaction.objectStore('crm');
  const cliente = objectStore.openCursor();
  cliente.onsuccess = function (e) {
    const cursor = e.target.result;

    if (cursor) {
      if (cursor.value.id === Number(id)) {
        llenarFormulario(cursor.value);
      }
    }
  }
}

function llenarFormulario(datos) {
  const { nombre, telefono, empresa, email } = datos;

  nombreInput.value = nombre;
  telefonoInput.value = telefono;
  empresaInput.value = empresa;
  emailInput.value = email;
};

export function borrarCliente(e) {
  if (e.target.classList.contains('eliminar')) {
    const idEliminar = Number(e.target.dataset.cliente);

    const confirmar = confirm('Desea eliminar a este cliente de la BD?');
    if (confirmar) {
      const transaction = DB.transaction(['crm'], 'readwrite');
      const objectStore = transaction.objectStore('crm');
      objectStore.delete(idEliminar);
      transaction.onerror = function () {
        console.log('hubo un error')
      };
      transaction.oncomplete = function () {
        e.target.parentElement.parentElement.remove();
      }
    }
  }
}

