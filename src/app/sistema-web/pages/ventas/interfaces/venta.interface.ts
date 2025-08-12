import { Usuario } from "../../../../auth/interfaces/usuarios.interface";
import { Cliente } from "./cliente.interface";
import { DetalleVenta } from "./detalleVenta.interface";

export interface Venta {
  cliente_id:number,
  usuario_id:number,
  venta_id?: number;
  fecha_venta: Date;
  igv: number;
  total: number;
  estado: string;
  tipo_pago?: null | string;
  canal_venta: null | string;
  clave?: null | string;
  comentario?: null | string;
  cliente?: Cliente;
  usuario?: Usuario;
  detalle_venta?:DetalleVenta[]
}


