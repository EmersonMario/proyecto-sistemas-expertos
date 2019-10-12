var db;

(()=>{
    if (!('indexedDB' in window)) 
        console.log('Este navegador no soporta indexedDB');
    
        //Si la base de datos no existe la crea, sino solo la abre.
        let solicitud = window.indexedDB.open('appstore',1);  //Asincrona
        
        solicitud.onsuccess = function(evento){
            console.log("Se creó o abrió la BD");
            db = solicitud.result;
            llenarSelectCategorias()
        }

        solicitud.onerror = function(evento){
            console.log(evento);
        }

        //Se ejecuta cuando se crea o se necesita actualizar la BD
        solicitud.onupgradeneeded = function(evento){
            //En este punto si se podria crear las colecciones
            console.log('Se creo o actualizó la BD');
            let db = evento.target.result;
            //Las colecciones en IndexedDB se les llama ObjectStores
            let objectStoreCategorias = db.createObjectStore('categorias',{keyPath:'codigo', autoIncrement:true});

            objectStoreCategorias.transaction.oncomplete = function(evento){
                console.log('Se creo el object store de categorias');
                llenarBase(db);
            }

            objectStoreCategorias.transaction.onerror = function(evento){
                console.log(evento);
            }
        }
        
})();




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
              precio:parseFloat(Math.random() * (100 - 1.00)).toFixed(2),
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
})();

//funcion que utilizo para llenar IndexDB con los arreglos previamente previstos en el js
function llenarBase(db){
        //ciclo para ir llenando el ObjectStore de categorias con todas las categorias del arreglo
    for (let i = 0; i < categorias.length; i++) {
        let transaccion =  db.transaction(['categorias'],'readwrite'); 
        let objectStoreUsuarios = transaccion.objectStore('categorias');
        let solicitud = objectStoreUsuarios.add(categorias[i]);
        solicitud.onsuccess = function(evento){
            console.log('Se agrego el registro con exito');
            console.log(evento);
        }
        solicitud.onerror = function(evento){
            console.log(evento);
        }  
    }
};
  
function llenarSelectCategorias(){
    document.getElementById('slc-categorias').innerHTML = '';
    let transaccion = db.transaction(['categorias'],'readonly');
    let objectStoreCategorias = transaccion.objectStore('categorias');
    let cursor = objectStoreCategorias.openCursor();
    document.getElementById('slc-categorias').innerHTML = " <option disabled selected>Selecciona una categoria</option>"
    cursor.onsuccess = function(evento){
        //Se ejecuta por cada registro en el objectstore
        if (evento.target.result){
            anexarSelelctOption(evento.target.result.value, evento.target.result.key);
            evento.target.result.continue(); //Mover el cursor a la siguiente direccion de memoria
        }
    }
}
function anexarSelelctOption(categorias, keyPath){
    document.getElementById('slc-categorias').innerHTML += 
                    `<option value="${keyPath}">${categorias.nombreCategoria}</option>`;
}
 
function cargarAplicaciones(valor) {
    let transaccion = db.transaction(['categorias'],'readonly');
    let objectStoreCategorias = transaccion.objectStore('categorias');
    let solicitud = objectStoreCategorias.get(parseInt(valor));
    solicitud.onsuccess = function(evento){

        llenarAplicaciones(evento.target.result.aplicaciones,valor);
    }
}

function llenarAplicaciones(aplicaciones,keyPath) {
    console.log(aplicaciones);
    document.getElementById('aplicaciones').innerHTML = '';
    for (let i = 0; i < aplicaciones.length; i++) {
        let calificacion;
        let precio;
        if (aplicaciones[i].precio< 0.5) {
            precio = "FREE";
        }else{
            precio=aplicaciones[i].precio;
        }
        if (aplicaciones[i].calificacion==1) {
            calificacion =`<i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="far fa-star"></i> 
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>`
        } else if (aplicaciones[i].calificacion==2){
            calificacion =`<i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>`
        } else if (aplicaciones[i].calificacion==3){
            calificacion =`<i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="far fa-star"></i>
                            <i class="far fa-star"></i>`
        } else if (aplicaciones[i].calificacion==4){
            calificacion =`<i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="far fa-star"></i>`
        } else if (aplicaciones[i].calificacion==5){
            calificacion =`<i class="fas fa-star" style ="color: #FFBA1B!important;" ></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>
                            <i class="fas fa-star" style ="color: #FFBA1B!important;"></i>`
        }
        document.getElementById('aplicaciones').innerHTML += 
                `<div onclick='modal(${keyPath},${aplicaciones[i].codigo})'>
                    <a class="navbar-brand img" href="#"><img src="${aplicaciones[i].icono}" alt=""></a>
                    <h1>${aplicaciones[i].nombre}</h1>
                    <p>${aplicaciones[i].descripcion}</p>
                    <p>${calificacion}</p>
                    <h2>$ ${precio}</h2>
                </div>`;
    }
}

function modal(keyPath,codigo) {
    $('#modalAplicaciones').modal('show');  
    let transaccion = db.transaction(['categorias'],'readonly');
    let objectStoreCategorias = transaccion.objectStore('categorias');
    let solicitud = objectStoreCategorias.get(keyPath);
    solicitud.onsuccess = function(evento){
        console.log(keyPath + "  "+codigo) 
        llenarModal(evento.target.result.aplicaciones,codigo);
    } 
}

function llenarModal(aplicaciones,codigo) {
    for (let i = 0; i < aplicaciones.length; i++) {
        if(aplicaciones[i].codigo == codigo){
            let imagenesCarrousel = aplicaciones[i].imagenes;
            let precio;
            let calificacion;
            if (aplicaciones[i].precio< 0.5) {
                precio = "FREE";
            }else{
                precio=aplicaciones[i].precio;
            }
            if (aplicaciones[i].calificacion==1) {
                calificacion =`<i class="fas fa-star" style ="color: red!important;"></i>
                                <i class="far fa-star"></i> 
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>`
            } else if (aplicaciones[i].calificacion==2){
                calificacion =`<i class="fas fa-star" style ="color: red!important;"></i>
                                <i class="fas fa-star" style ="color: red!important;"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>`
            } else if (aplicaciones[i].calificacion==3){
                calificacion =`<i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>`
            } else if (aplicaciones[i].calificacion==4){
                calificacion =`<i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="far fa-star"></i>`
            } else if (aplicaciones[i].calificacion==5){
                calificacion =`<i class="fas fa-star" style ="color: green!important;" ></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>
                                <i class="fas fa-star" style ="color: green!important;"></i>`
            }
            document.getElementById('info-modal').innerHTML = `
                <div id="carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src="${imagenesCarrousel[0]}" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                        <img src="${imagenesCarrousel[1]}" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                        <img src="${imagenesCarrousel[2]}" class="d-block w-100" alt="...">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <div id="informacion">
                    <table>
                        <tr>
                            <th><div style ="  width: 16%;  float:left;"><a class="navbar-brand img" href="#"><img src="${aplicaciones[i].icono}" alt=""></a></div></th>
                            <th><h1>${aplicaciones[i].nombre}</h1>
                            <p>${aplicaciones[i].descripcion}</p>
                            <h2>$ ${precio}</h2></th>
                        </tr>
                    </table>
                 </div>
                 <div>
                     <p>${calificacion}</p>
                </div>
                <div>
                
                </div>
            `
            if (aplicaciones[i].instalada== true) {
                document.getElementById('botones-modal').innerHTML = 
                `   <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button"  class="btn btn-danger"  >Eliminar</button>
                `
            } else {
                document.getElementById('botones-modal').innerHTML = 
                `   <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button"  class="btn btn-danger"  >Eliminar</button>
                    <button type="button" class="btn btn-primary">Instalar</button>
                `
            }
           
        }
        
    }
    

}