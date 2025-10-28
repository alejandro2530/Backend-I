import fs from 'fs';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const products = [
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Whey Protein Isolate 2kg",
    "description": "Proteína aislada de suero, 90%+ proteína por servicio, sabor vainilla.",
    "code": "WPI-2001",
    "price": 49.99,
    "status": true,
    "stock": 120,
    "category": "Proteínas",
    "thumbnails": ["img/whey_isolate_2kg.jpg"]
  },
  {
    "id": "9c0a3b7d-3e1f-4a5b-9b2c-6d7e8f1a2b3c",
    "title": "Creatina Monohidrato 300g",
    "description": "Creatina micronizada pura para fuerza y recuperación.",
    "code": "CRE-3003",
    "price": 14.99,
    "status": true,
    "stock": 250,
    "category": "Rendimiento",
    "thumbnails": ["img/creatina_300g.jpg"]
  },
  {
    "id": "2a1f4c6d-7b8e-49f0-a3c2-5d6e7f8a9b0c",
    "title": "BCAA 2:1:1 500g",
    "description": "Aminoácidos ramificados para recuperación muscular, sabor frutos rojos.",
    "code": "BCAA-5005",
    "price": 24.5,
    "status": true,
    "stock": 180,
    "category": "Aminoácidos",
    "thumbnails": ["img/bcaa_500g.jpg"]
  },
  {
    "id": "7d6e5c4b-3a2f-1e0d-9c8b-6a5f4e3d2c1b",
    "title": "Pre-Workout Energize 300g",
    "description": "Pre-entreno con cafeína, citrulina y beta-alanina para energía y foco.",
    "code": "PRE-3007",
    "price": 29.99,
    "status": true,
    "stock": 140,
    "category": "Pre-Entreno",
    "thumbnails": ["img/preworkout_300g.jpg"]
  },
  {
    "id": "0f1e2d3c-4b5a-6978-90ab-cdef12345678",
    "title": "Glutamina 400g",
    "description": "L-glutamina pura para soporte de recuperación y sistema inmune.",
    "code": "GLU-4004",
    "price": 19.99,
    "status": true,
    "stock": 160,
    "category": "Recuperación",
    "thumbnails": ["img/glutamina_400g.jpg"]
  },
  {
    "id": "3b2a1c0d-9e8f-7a6b-5c4d-3e2f1a0b9c8d",
    "title": "Mass Gainer 4kg",
    "description": "Ganador de masa con carbohidratos y proteínas para aumento calórico.",
    "code": "MG-4008",
    "price": 59.0,
    "status": true,
    "stock": 60,
    "category": "Gainers",
    "thumbnails": ["img/mass_gainer_4kg.jpg"]
  },
  {
    "id": "5a4b3c2d-1e0f-9d8c-7b6a-5f4e3d2c1b0a",
    "title": "Multivitamínico Sport 60 caps",
    "description": "Complejo multivitamínico con minerales y cofactores para deportistas.",
    "code": "MVI-6060",
    "price": 12.99,
    "status": true,
    "stock": 300,
    "category": "Vitaminas",
    "thumbnails": ["img/multivitamin_60caps.jpg"]
  },
  {
    "id": "8c7b6a5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d",
    "title": "Omega-3 1000mg 120 cápsulas",
    "description": "Aceite de pescado concentrado con EPA y DHA para salud cardiovascular.",
    "code": "OM3-1201",
    "price": 17.5,
    "status": true,
    "stock": 210,
    "category": "Salud",
    "thumbnails": ["img/omega3_120.jpg"]
  },
  {
    "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
    "title": "Beta-Alanina 200g",
    "description": "Beta-alanina para buffer de acidez y mejor rendimiento en repeticiones altas.",
    "code": "BA-2002",
    "price": 16.99,
    "status": true,
    "stock": 190,
    "category": "Rendimiento",
    "thumbnails": ["img/beta_alanina_200g.jpg"]
  },
  {
    "id": "d4c3b2a1-0f9e-8d7c-6b5a-4e3f2a1b0c9d",
    "title": "Barra Proteica 60g (pack 12)",
    "description": "Pack de 12 barras ricas en proteína, bajo en azúcares añadidos.",
    "code": "PB-12PK",
    "price": 21.99,
    "status": true,
    "stock": 95,
    "category": "Snacks",
    "thumbnails": ["img/protein_bars_12pack.jpg"]
  }
]
const carts = [];
// CREACIÓN DE LA CLASE USERMANAGER PARA MANEJO DE USUARIOS Y CONTROLAR EL ARCHIVO JSON
class ProductManager {
    static bbddProducts;

    static getInstance = async () => {
        // patron singleton
        if(fs.existsSync("./products.json")){
            console.log("existe el products");
            this.bbddProducts = JSON.parse(await fs.promises.readFile("./products.json","utf-8"))
            return;
        }
        console.log("no existe el products, creando...");
        this.bbddProducts = {products};
        await fs.promises.writeFile("./products.json",JSON.stringify({products}))
        return this.bbddProducts;
    }
}
class CartManager {
    static bbddCarts;

    static getInstance = async () => {
        // patron singleton
        if(fs.existsSync("./cart.json")){
            console.log("existe el cart");
            this.bbddCarts = JSON.parse(await fs.promises.readFile("./cart.json","utf-8"))
            return;
        }
        console.log("no existe el cart, creando...");
        this.bbddCarts = {carts};
        await fs.promises.writeFile("./cart.json",JSON.stringify({carts}))
        return this.bbddCarts;
    }
}

app.listen(8080, () => {
    console.log("Servidor escuchando en el puerto 8080");
});

app.get("/", (req,res) => {
    res.send("Servidor funcionando");
});

// ------------------------------------------PRODUCTS------------------------------------------
 
app.get("/api/products", (req,res) => {
    res.status(200).json({payload: products});
});

// ENDPOINT PARA AGREGAR UN PRODUCTO
app.post("/api/products", (req,res) => {
    
    // identifico el producto que viene en el body
    const newProduct = {id: uuidv4(), ...req.body}

    // guardo el producto en el array de productos
    products.push(newProduct);

    res.status(200).json({playload: newProduct, message: "Producto agregado correctamente"});
})

// ENDPOINT PARA UN PRODUCTO ESPECIFICO
app.get("/api/products/:productId", (req,res) => {
    const idProduct = req.params.productId;

    const productFinded = products.find(prod => prod.id === idProduct)

    if(!productFinded){return res.status(404).json({playload: null, message: "Producto no encontrado"})}

    res.status(200).json({payload: productFinded});
});

// ENDPOINT PARA ACTUALIZAR UN PRODUCTO
app.put("/api/products/:productId",(req,res) => {
    const idProduct = req.params.productId;
    const updateData = req.body;

    const indexProduct = products.findIndex(prod => prod.id === idProduct)

    if(indexProduct === -1) {return res.status(404).json({payload: null, message: "Producto a modificar no encontrado"})}

    const updateProduct = {...products[indexProduct], ...updateData}

    products[indexProduct] = updateProduct;

    res.status(200).json({payload: updateProduct, message: "Producto actualizado correctamente"});
});

// ENDPOINT PARA ELIMINAR UN PRODUCTO
app.delete("/api/products/:productId", (req,res) => {
    const idProduct = req.params.productId;
    const indexProduct = products.findIndex(prod => prod.id === idProduct)

    if (indexProduct === -1) {return res.status(404).json({payload: null, message: "Producto a eliminar no encontrado"})}

    const productDelete = products.splice(indexProduct, 1);

    res.status(200).json({payload: productDelete, message: "Producto eliminado correctamente"});
});

// ------------------------------------------CARTS------------------------------------------
app.get("/api/carts",(req,res) => {
    res.status(200).json({playload: carts})
});
// ENDPOINT PARA SELEECIONAR UN CARRITO ESPECIFICO
app.get("/api/carts/select/:cartId", (req,res) => {
    const idCart = req.params.cartId;
    const cartFinded = carts.find(cart => cart.idCart === idCart)

    if(!cartFinded){return res.status(404).json({playload: null, message: "Carrito no encontrado con el ID" + idCart})}
    res.status(200).json({payload: cartFinded});
});
// ENDPOINT PARA CREAR UN NUEVO CARRITO
app.post("/api/carts/newCart", (req,res) => {
    const newCart = {idCart: uuidv4(), productsCart: []};
    carts.push(newCart);
    console.log(carts);
    
    res.status(200).json({payload: carts, message: "Carrito creado correctamente"});
})
// ENDPOINT PARA AGREGAR UN PRODUCTO AL CARRITO
app.post("/api/carts/select/:cartId/product/:productId",(req, res) => {
  const idCart = req.params.cartId;
  const idProduct = req.params.productId;

  const cartFinded = carts.find(cart => cart.idCart === idCart);
  if (!cartFinded)
    return res.status(404).json({ payload: null, message: "Carrito no encontrado" });

  const productFinded = products.find(prod => String(prod.id) === idProduct);
  if (!productFinded)
    return res.status(404).json({ payload: null, message: "Producto no encontrado" });

  const productInCart = cartFinded.productsCart.some(prod => prod.idProductCart === idProduct);

  if (!productInCart) {
    cartFinded.productsCart.push({ idProductCart: idProduct, quantity: 1 });
    return res.status(200).json({ payload: cartFinded, message: "Producto nuevo agregado al carrito" });
  }

  const index = cartFinded.productsCart.findIndex(prod => prod.idProductCart === idProduct);
  cartFinded.productsCart[index].quantity += 1;

  res.status(200).json({ payload: cartFinded, message: "Cantidad incrementada en 1" });
});

CartManager.getInstance();
ProductManager.getInstance();
