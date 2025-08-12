import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envs } from '../../../../config/envs';
import { Producto } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private http:HttpClient
  ) { }

  getProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${envs.api}/productos`);
  }


  crearProducto(producto:Producto):Observable<Producto>{
    return this.http.post<Producto>(`${envs.api}/productos`,producto);
  }

   actualizarProducto(producto: Producto): Observable<Producto> {
      return this.http.put<Producto>(`${envs.api}/productos/${producto.producto_id}`, producto);
    }

  eliminarProducto(id:number):Observable<Producto>{
    return this.http.delete<Producto>(`${envs.api}/productos/${id}`);
  }

}
