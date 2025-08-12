import { Injectable } from '@angular/core';
import { envs } from '../../../../config/envs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../interfaces/proveedores.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(
    private http:HttpClient
  ) { }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${envs.api}/proveedores`);
  }

  agregarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${envs.api}/proveedores`, proveedor);
  }

  actualizarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${envs.api}/proveedores/${proveedor.proveedor_id}`, proveedor);
  }

  eliminarProveedor(id: number): Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${envs.api}/proveedores/${id}`);
  }

}
