const express = require("express");
const router = express.Router();
const productoClase = require("../modules/producto");
const producto = new productoClase();

/* GET users listing. */
router.get("/", function(req, res, next) {
    res.status(200).json(producto.getProductos());

});

router.get("/:idP", (req, res) => {
    let idProducto = parseInt(req.params.idP);
    if (!isNaN(idProducto)) {
        let objProductoId = producto.getProductoById(idProducto);
        objProductoId != null ?
            res.status(200).json(objProductoId) :
            res
            .status(406)
            .json({ error: `No se encontró el producto con id: ${idProducto}` });
    } else {
        res.status(404).json({ error: "El id ingresado no es numerico" });
    }
});

router.post("/", (req, res) => {

    let objProducto = {...req.body };
    let objProductoNuevo = producto.setProducto(objProducto);
    //agrego evento a socket
    req.app.io.sockets.emit('update_products', producto.getProductos());
    objProductoNuevo != null ?
        res.status(200).json(objProductoNuevo) :
        res
        .status(406)
        .json({ error: "Error al querer agregar el nuevo producto" });


});

router.put("/idP", (req, res) => {
    let idProducto = parseInt(req.params.idP);
    let objProducto = {...req.body };

    producto.updateProducto(idProducto, objProducto) ?
        res.status(200).json({
            status: `El producto con Id ${idProducto} fue actualizado correctamente.`,
        }) :
        res
        .status(406)
        .json({ error: `No se encontró el producto con id: ${idProducto}` });
});

router.delete("/:idP", (req, res) => {
    let idProducto = parseInt(req.params.idP);

    producto.deleteProducto(idProducto) ?
        res.status(200).json({
            status: `El producto con Id ${idProducto} fue eliminado correctamente.`,
        }) :
        res
        .status(406)
        .json({ error: `No se encontró el producto con id: ${idProducto}` });
});
module.exports = router;