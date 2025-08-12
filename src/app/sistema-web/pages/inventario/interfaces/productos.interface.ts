export interface Producto {
  producto_id?: number;
  proveedor_id: number;
  categoria_id: number;
  nombre: string;
  valor_compra: number;
  valor_venta: number;
  fecha_compra: string;
  stock: number;
  descripcion: string;
  creado_en?: string;
}