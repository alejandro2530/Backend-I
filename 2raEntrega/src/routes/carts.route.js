import fs from 'fs';
import { Router } from "express"; // export comun sin default. por que le estoy especificando
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';

const route = Router();

route.get("/", async(req,res) => {
  // recupero los carts del archio carts.json
  const cartsJson = await fs.promises.readFile("./carts.json", "utf-8");
  const carts = JSON.parse(cartsJson);

  if(carts.length === 0) {return res.json({playload: null, message: "No hay carritos creados"})}

  res.status(200).json({playload: carts})
});
route.get("/select/:cartId", async (req,res) => {
  const idCart = req.params.cartId;
  
  // recupero los carts del archio carts.json
  const cartsJson = await fs.promises.readFile(path.join(process.cwd(),"carts.json"), "utf-8");
  const data = JSON.parse(cartsJson); 
  
  const cartFinded = data.find(cart => cart.idCart === idCart)

  if(!cartFinded){return res.status(404).json({playload: null, message: "Carrito no encontrado con el ID" + idCart})}
  
  res.status(200).json({payload: cartFinded});
});
route.post("/newCart", async (req,res) => {
  const newCart = {idCart: uuidv4(), productsCart: []};

  // recupero los carts del archio carts.json
  const cartsJson = await fs.promises.readFile(path.join(process.cwd(),"carts.json"), "utf-8");
  const data = JSON.parse(cartsJson); 

  data.carts.push(newCart);
  await fs.writeFileSync(path.join(process.cwd(),"carts.json"), JSON.stringify(data));
  
  res.status(200).json({payload: data, message: "Carrito creado correctamente"});
})
route.post("/select/:cartId/newProduct/:productId", async(req, res) => {
  const idCart = req.params.cartId;
  const idProduct = req.params.productId;

  // recupero los carts del archio carts.json
  const cartsJson = await fs.promises.readFile(path.join(process.cwd(),"carts.json"), "utf-8");
  const dataCarts = JSON.parse(cartsJson); 

  const cartFinded = dataCarts.carts.find(cart => cart.idCart === idCart);
  if (!cartFinded) return res.status(404).json({ payload: null, message: "Carrito no encontrado" });

  // recupero los productos de products.json
  const productsJson = await fs.promises.readFile(path.join(process.cwd(),"products.json"), "utf-8");
  const dataProducts = JSON.parse(productsJson);

  const productFinded = dataProducts.products.find(prod => String(prod.id) === idProduct);
  if (!productFinded) return res.status(404).json({ payload: null, message: "Producto no encontrado" });

  const productInCart = cartFinded.productsCart.some(prod => prod.idProductCart === idProduct);

  if (!productInCart) {
    cartFinded.productsCart.push({ idProductCart: idProduct, quantity: 1 });
    await fs.promises.writeFile(path.join(process.cwd(),"carts.json"), JSON.stringify(dataCarts));
    return res.status(200).json({ payload: cartFinded, message: "Producto nuevo agregado al carrito" });
  }
  
  const index = cartFinded.productsCart.findIndex(prod => prod.idProductCart === idProduct);
  cartFinded.productsCart[index].quantity += 1;
  
  res.status(200).json({ payload: cartFinded, message: "El producto ya existe en el carrito y se agrego uno mas" });
  
  await fs.promises.writeFile(path.join(process.cwd(),"carts.json"), JSON.stringify(dataCarts));
});

export default route;