import { Router } from 'express';
import fs from "fs";
import path from 'node:path';

const route = Router();

route.get("/", async (req,res) => { // NO actualiza en tiempo real
    const data = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
    const productos = JSON.parse(data)
    const a = productos.products
    console.log(productos)
    res.render("home", {a})
});

route.get("/realTimeProducts", async (req,res) => { // SI actualiza en tiempo real
    const data = await fs.promises.readFile(path.join(process.cwd(),"products.json") , "utf-8");
    const productos = JSON.parse(data)
    const a = productos.products
    console.log(productos)
    res.render("realTimeProducts", {a})
});
export default route;