import fs from 'fs';
import { Router } from "express"; // export comun sin default. por que le estoy especificando
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';

const route = Router();


route.get("/", async (req,res) => {
    console.log("estoy en el router products")
    const productsJson = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
    const products = JSON.parse(productsJson);
    
    res.status(200).json({payload: products});
});
route.post("/",  async (req,res) => {    
    // identifico el producto que viene en el body
    const newProduct = {id: uuidv4(), ...req.body}
    const productsJson = await fs.promises.readFile(path.join(process.cwd(),"products.json"),"utf-8");
    const products = JSON.parse(productsJson);
    products.products.push(newProduct);

    
    await fs.promises.writeFile(path.join(process.cwd(),"products.json") , JSON.stringify(products));
    res.status(200).json({playload: products, message: "Producto agregado correctamente"});
    
    // emito para actualizar los productos en tiempo real
    const io = req.app.get("io");
    io.emit("productos_actualizados", products)
  }) 
route.get("/:productId", async (req,res) => {
  // identifico el id del producto que viene por params  
  const idProduct = req.params.productId;

  // recupero productos del archio product.json
  const productJson = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
  const products = JSON.parse(productJson);

  // verifico si el producto existe, comparando el id que viene de la req y el id de los productos que se encuentran en el archivo json
  const productFinded = products.products.find(prod => prod.id === idProduct)

  if(!productFinded){return res.status(404).json({playload: null, message: "Producto no encontrado"})}

  res.status(200).json({payload: productFinded});
});
route.put("/:productId", async (req, res) => {
  const idProduct = req.params.productId;
  const updateData = req.body;

  // recupero productos del archio product.json
  const productJson = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
  const products = JSON.parse(productJson);

  const indexProduct = products.products.findIndex((prod) => prod.id === idProduct);

  if (indexProduct === -1) {return res.status(404).json({ payload: null, message: "Producto a modificar no encontrado" })}

  const updateProduct = { ...products.products[indexProduct], ...updateData };

  products.products[indexProduct] = updateProduct;

  await fs.promises.writeFile(path.join(process.cwd(),"products.json") , JSON.stringify(products));
  return res.status(200).json({messaje: "Producto actualizado correctamente"});
});

route.delete("/:productId", async (req,res) => {
  const idProduct = req.params.productId;

  // recupero productos del archio product.json
  const productJson = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
  const products = JSON.parse(productJson);

  const indexProduct = products.products.findIndex(prod => prod.id === idProduct)

  if (indexProduct === -1) {return res.status(404).json({payload: null, message: "Producto a eliminar no encontrado"})}

  const productDelete = products.products.splice(indexProduct, 1);
  
  // emito para actualizar los productos en tiempo real
  const io = req.app.get("io");
  io.emit("productos_actualizados", products)
  
  await fs.promises.writeFile(path.join(process.cwd(),"products.json") , JSON.stringify(products));
  return res.status(200).json({payload: productDelete, message: "Producto eliminado correctamente"});
});

export default route; 
