//Codigo para generar información de categorias y almacenarlas en un arreglo.
var categorias = [];
(()=>{
  //Este arreglo es para generar textos de prueba
  let textosDePrueba=[
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
      "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
      "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
      "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
      "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
  ]
  
  //Genera dinamicamente los JSON de prueba para esta evaluacion,
  //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria

  
  let contador = 1;
  for (let i=0;i<5;i++){//Generar 5 categorias
      let categoria = {
          nombreCategoria:"Categoria "+i,
          descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
          aplicaciones:[]
      };
      for (let j=0;j<10;j++){//Generar 10 apps por categoria
          let aplicacion = {
              codigo:contador,
              nombre:"App "+contador,
              descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
              icono:`img/app-icons/${contador}.webp`,
              instalada:contador%3==0?true:false,
              app:"app/demo.apk",
              calificacion:Math.floor(Math.random() * (5 - 1)) + 1,
              descargas:1000,
              desarrollador:`Desarrollador ${(i+1)*(j+1)}`,
              imagenes:["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
              comentarios:[
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Juan"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Pedro"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Maria"},
              ]
          };
          contador++;
          categoria.aplicaciones.push(aplicacion);
      }
      categorias.push(categoria);
  }
  console.log(categorias);
  
})();


var db;
(()=>{
    if (!('indexedDB' in window)) 
        console.log('Este navegador no soporta indexedDB');

        let solicitud = window.indexedDB.open("appstore", 1);

        solicitud.onsuccess = function(e){
            console.log("Se creó o abrió la BD");
            db = e.target.result;
            llenarSelectList();
            cargarAplicaciones();
            cargarModal();
        }

        solicitud.onerror = function(e){
            console.log(e);
        }

        //Creando el ObjectStore
        solicitud.onupgradeneeded = function(e){
            console.log('Se creo o actualizó la BD');
            let db = e.target.result;
            let objectStoreCategorias = db.createObjectStore("categorias", {keyPath: "codigo", autoIncrement:true});
            objectStoreCategorias.transaction.oncomplete = function(e){
                console.log('Se creo el object store de categorías');
                let transaccion = db.transaction(["categorias"], "readwrite");
                let almacen = transaccion.objectStore("categorias");
                let agregar;
                for (let i = 0; i < categorias.length; i++) {
                        agregar = almacen.add(categorias[i]);
                }
                agregar.onsuccess = function(e){
                    console.log('Se agrego el registro con exito');
                    console.log(e);
            }
                agregar.onerror = function(e){
                    console.log(e);
                }
            }
            objectStoreCategorias.transaction.onerror = function(e){
                console.log(e);
            }
            
        }  
})();

function llenarSelectList(){ 
    document.getElementById("categoria").innerHTML = "";
    let transaccion = db.transaction(["categorias"],"readonly");
    let almacen = transaccion.objectStore("categorias");
    let cursor = almacen.openCursor();
    document.getElementById('categoria').innerHTML = " <option disabled selected>Selecciona una categoria</option>";
    cursor.addEventListener("success", anexarCategoria, false);
}

function anexarCategoria(e){
    let cursor = e.target.result;
    if(cursor){
            document.getElementById("categoria").innerHTML += `<option>${cursor.value.nombreCategoria}</option>`;
            cursor.continue();
    } 
}

function cargarAplicaciones(){ 
    //console.log("Cargar aplicaciones de la categoria: "+ $("#categoria").val()); 
    document.getElementById("aplicacion").innerHTML = "";
    let transaccion = db.transaction(["categorias"],"readonly");
    let almacen = transaccion.objectStore("categorias");
    let cursor = almacen.openCursor();
    cursor.addEventListener("success", anexarAplicacion, false);
}

function anexarAplicacion(e){
    let cursor = e.target.result
    if(cursor.value.nombreCategoria == $("#categoria").val()){
        for (let i = 0; i < cursor.value.aplicaciones.length; i++) {
            document.getElementById('aplicacion').innerHTML += 
            `<span data-toggle="modal" data-target="#exampleModal">
            <div class="card m-2" style="width: 150px;">
            <img src="${cursor.value.aplicaciones[i].icono}" class="card-img-top p-3" alt="logo">
            <div class="card-body text-left">
                <h5 class="card-title" id="nombreAplicacion">${cursor.value.aplicaciones[i].nombre}</h5>
                <p class="card-text">Desarrollador</p>
                <p class="card-text">Estrellas</p>
                <p class="card-text">$44</p>
            </div>
            </div>
            </span>`;
            //cursor.value.aplicaciones[i];
            
        }
        
    }
    cursor.continue();
}

function cargarModal(){  
    let transaccion = db.transaction(["categorias"],"readonly");
    let almacen = transaccion.objectStore("categorias");
    let cursor = almacen.openCursor();
    cursor.addEventListener("success", anexarModal, false);
}

function anexarModal(e){
    let cursor = e.target.result
    if(cursor.value.nombreCategoria){
        for (let i = 0; i < cursor.value.aplicaciones.length; i++) {
            document.getElementById('exampleModalLabel').innerHTML += cursor.value.aplicaciones[i].nombre;
            //cursor.value.aplicaciones[i];
            
        }
        
    }
    cursor.continue();
}