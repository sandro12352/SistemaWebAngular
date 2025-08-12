
export interface Cliente {
  cliente_id?: number;
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email?: string | null;
  direccion: string;
  creado_en?: string;
}