const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");


app.use(express.json());

//Sector Productos

//Listar todos los productos
app.get("/api/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();

        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Traer un solo producto por id: 
app.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            res.json({
                error: "Producto no encontrado"
            });
        } else {
            res.json(producto);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Agregar un nuevo producto por post: 
app.post("/api/products", async (req, res) => {
    const nuevoProducto = req.body; 
    console.log(nuevoProducto);

    try {
        await productManager.addProduct(nuevoProducto),
        res.status(201).json({message: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("error al agregar un producto ", error);
        res.status(500).json({error: "error del servidor"});
    }
})

//Actualizamos producto por id: 
app.put("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);
    const productoActualizado = req.body;

    try {
        const productoModificado = await productManager.updateProduct(id, productoActualizado);

        if (productoModificado) {
            res.json({ message: "Producto actualizado correctamente" });
        } else {
            res.json({ message: "Producto no encontrado o eliminado correctamente" });
        }
    } catch (error) {
        console.log("No pudimos actualizar", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});


// Eliminar un producto por id
app.delete("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);

    try {
        const productoEliminado = await productManager.deleteProduct(id);

        if (productoEliminado) {
            res.json({
                message: "Producto eliminado correctamente",
                deletedProduct: productoEliminado
            });
        } else {
            res.status(404).json({
                error: "Producto no encontrado"
            });
        }
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

app.listen(PUERTO);
