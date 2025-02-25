//1- PONER LA uRL BASE

urlBase = 'https://jsonplaceholder.typicode.com/posts';// la url con la que interactuaremos

let posts = []; //iniciamos los posteos como un array vacio.


//2-HACEMOS LA FUNCTION QUE CONTENGA EL GET DE LA API CON LA QUE VAMOS A INTERACTUAR:
function getData(){// esta function viene del button del html, con el que ejecutariamos el get de la API
    fetch(`${urlBase}`)// solicitud HTTP para obtener los datos de la API
    .then(res => res.json())//res es el parametro de esta function y con esta function vamos a convertir los fomratos en JSON(objeto JS para poder manipular).
    .then(data => {//data representa los datos en JSON  que recibimos de la API .
        posts = data// y aqui guardamos dichos datos en la variable array post que hicimos arriba.

//8- LLAMAMOS LA FUNCTION "renderPostList()" a nuestra function getData, que es con la que optenemos la API e interactuaremos 
        //en este espacio debemos poner el metodo para mostrar la infomración en pantalla.
        renderPostList();



    })
    .catch(error => console.error('Error al llamar a la API: ', error));//Si ocurre un error en cualquier parte del código, el .catch() lo captura y muestra un mensaje en la consola.
}

getData();// si comentamos en el html el boton de ver posteo y solo declaramos esta function aqui, en la pagina saldran los post sin tener que presionar el boton.




//3- CREAREMOS AHORA UNA FUNCTION QUE SE ENCARGARÁ DE RENDERIZAR Y DARA FORMA AL MAQUETADO DE COMO SERÁ TODA LA LISTA DESORDENADA QUE MENCIONAMOS EN EL HTML COMO: "id=postList"

function renderPostList(){
    const postList = document.getElementById('postList');// llamamos el id de ul(lista desordenada).
    postList.innerHTML ='';// importante siempre dejarla vacia.

    //4- UTILIZAMOS forEach() EL CUAL SE ENCARGARA DE RECORRER TODO EL ARRAY, POR ESO LO ENRUTAMOS:
    posts.forEach(post =>{ //para esta function ponemos como parametro un "post" que necesitara ingresarse, en este caso sera el de la API
       const listItem = document.createElement('li');// dentro de la lista desordenada vamos a crear un elemento "li".
       listItem.classList.add('postItem');//le agregaremos una clase a esta "li".

       //5-ACONTINUACION VAMOS A REALIZAR UNA ESTRUTURA DE CODIGO HTML QUE ES LA QUE QUEREMOS QUE APAREZCA ABAJO DEL BOTON "ver porteos" DONDE SE APRECIARAN LOS POSTEOS DE LA API CON LA QUE ESTAMOS TRABAJANDO:

       //vamos a escribirle todo este codigo a la variable con la que hemos venido trabajando (listItem) y todo se remontará al elemento "ul" del HTML.
       listItem.innerHTML = `
       <strong>${post.title}</strong>
       <p>${post.body}</p>
       <button onclick="editPost(${post.id})">Editar</button>
       <button onclick="deletePost(${post.id})">Eliminar</button>
       
        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar </button>
        </div>
       `

       postList.appendChild(listItem);//6- Agrega listItem como un hijo de postList en el DOM. y En términos sencillos: coloca el <li> dentro del <ul> para que aparezca en la página.

    });


};

//9- VAMOS A TRABAJAR CON LOS METODOS QUE NOS FALTAN, EMPEZAMOS CON UNA FUNCTION PARA EL POST DE LA API, O SEA, AGREGAREMOS POST NUEVOS A LA LISTA YA EXISTENTE:

function postData(){



    const postTitleInput = document.getElementById('postTitle');// llamamos los id correspondientes al input y texarea que el ususario llenará
    const postBodyInput = document.getElementById('postBody');//este es el textarea

   //10- se modifico las dos lineas anteriores de codigo (js:67 y js:68) estas tenian const postTitle y postBody en vez de las actuales pero no estaba borrando lo que se escribia en el input una vez presionado el boton de Enviar. entonces se procedio a igualar variables y en la linea js:101 y js:102 se igualan las variables postTitleInput y postBodyInput a ('') vacío. dentro del arrow del .then.
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;






    if (postTitle.trim() == '' || postBody.trim() == ''){// consicionamos para que no deje espacios en blanco
        alert('Los campos son obligatorios');
        return;
    }

    fetch(urlBase, {// este es el algoritmo para llamar el post de API. o sea, para agregar post en la app de red social.
    method: 'POST',
    body: JSON.stringify({
    title: postTitle,// vinculamos las variables para que el ususario pueda escribir lo que desee
    body: postBody,// vinculamos las variables para que el ususario pueda escribir lo que desee
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

    .then(res => res.json())// tomamos los datos y los pasamos a formato JSON u objeto de javaScript para poder manipular.
    .then(data => {
        posts.unshift(data);// la data del JSON vamos a pushearla o agregarla en el array que tenemos "posts".
        renderPostList();//y declaramos la function que se encarga de renderizar la lista desordenada. esto para que la informacion que el ususario agregue se convierta en un post y sea visible y estilizado en el navegador.

        postTitleInput.value = '';
        postBodyInput.value = '';



    })
    .catch(error => console.error('Error al querer crear posteo: ', error));  //por si hay algun error.

};

//11- vamos a seguir con la function editPost() con esto haremos el PUT DE LA API o sea, modificar un post:

function editPost(id){//necesitamos poner por parametro el id para que seleccione un post determinado. recordemos que esta function hace parte de la estructura nueva de html que hicimos desde js. con esta function le daremos todas las indicaciones necesarias al boton editar.
    const editForm = document.getElementById(`editForm-${id}`);//vamos a llamar al bloque div que aparecerá cuando precionemos el boton editar.
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';// haremos que se creee una especie de switch para que al clickear el boton se abra el bloque div y se cierre con click tambien

}

function updatePost(id){// esta funcion se encaragará de hacer editable los input de ese bloque de div que aparecera con el "boton editar"
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;
//____________________________________________________________________________________________________________________________________
//12- DENTRO DE LA FUNCTION VAMOS A EJECUTAR NUESTRO PUT USANDO FETCH

    fetch(`${urlBase}/${id}`,{// el algoritmo fetch() para extraer API, este se usa cuando queremos actualizar(https://jsonplaceholder.typicode.com/guide/)
        method: 'PUT',
        body: JSON.stringify({
        id:id,// editamos esto y ponemos la id con la que estamos trabajando para que identifique exactamente el post que queremos editar
        title: editTitle,//ponemos el nombre que queremos que tenga nuestra input
        body: editBody,// ponemos el nombre que queremos que tenga nuestra textarea
        userId: 1,
        }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })

    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id);

        if(index != -1){
            posts[index] = data
        }else{
            alert('Hubo un error al actualizar la información del posteo');
        }
        renderPostList();
    })

    .catch(error => console.error('Error al querer actualizar el post: ', error));

}
//__________________________________________________________________________________________________________________________________

//13- SE CREA FUNCTION PARA USAR EL DELETE DE LA API, CON LA INTENCION DE PODER DAR FUNCIONALIDAD AL BOTON DE BORRAR Y PODER ELIMINAR UN POST.


function deletePost(id){// con esta function le daremos funcionalidad al boton de borrar, necesitamos el id como parametro para que solo interactue con el post que se desea y no con todos
    fetch(`${urlBase}/${id}`, {// algoritmo de fetch() para delete un post
        method: 'DELETE',
    })

    .then(res => {
        if (res.ok){//si la respuesta es ok
            posts = posts.filter(post => post.id != id)//entonces pedimos al posts ( al array) que filtre los id diferentes al que hemos seleccionado para que...
            renderPostList();// para que los renderice normalmente y solo elimine el que seleccionamos

        }else{
            alert('Hubo un error y no se pudo eliminar el posteo');
        }

        
    })

    .catch(error => console.error('Hubo un error: ', error));
};