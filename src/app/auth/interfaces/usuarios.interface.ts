import { Trabajador } from "./trabajadores.interfaces";

export enum RolUsuario {
  Admin = 'admin',
  Ventas = 'ventas',
  Marketing = 'marketing',
}

export interface Usuario {
  usuario_id?: number;
  trabajador_id?: number;
  email: string;
  contrasena: string;
  rol: RolUsuario;
  trabajador:Trabajador
  creado_en?: Date;
}