import express from 'express';
import productsRoute from './routes/products.route.js';
import cartsRoute from './routes/carts.route.js';
import handlebars from 'express-handlebars';
import path from 'node:path';
import viewRouter from './routes/view.route.js';
import { Server } from 'socket.io';

const app = express();
//-------------------------------------------HANDLEBARS------------------------------------------
app.engine("handlebars",handlebars.engine()); // defino a expres que va a usar el motor de plantillas con la extensión handlebars
app.set("views", path.join(process.cwd(),"src","views")); // le digo donde van a estar mis vistas. process.cwd() me da la ruta raiz del proyecto
app.set("view engine","handlebars"); // le digo a express que el motor de plantillas va a ser handlebars
//-----------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.static(path.join(process.cwd(),"src","public"))); // middleware de archivos estáticos 
// ------------------------------------------ROUTES------------------------------------------
app.use("/",viewRouter)
app.use("/api/products",productsRoute) // middleware 
app.use("/api/carts",cartsRoute) // middleware
// ------------------------------------------------------------------------------------------
const serverHttp = app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080"); // esto devueve una instancia del servidor
});
const io = new Server(serverHttp); // instancio el servidor de sockets pasandole como parametro el servidor http
app.set("io",io) // para poder usar io en cualquier parte de la aplicacion

// ------------------------------------SOCKETS------------------------------------------
// escucho el evento connection para saber cuando un cliente se conecta via sockets, 
// cada vez que conecte un nuevo cliente este evento se va a disparar
io.on("connection",(socket)=>{ 
    console.log("Nuevo cliente conectado via sockets --> ", socket.id);
});
//--------------------------------------------------------------------------------------
