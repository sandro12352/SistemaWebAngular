import { Producto } from "../../inventario/interfaces/productos.interface";

export interface DetalleVenta{
    venta_id: number,
    producto_id: number,
    cantidad: number,
    precio_vendido: number,
    subtotal: number,
    producto?:Producto,
}