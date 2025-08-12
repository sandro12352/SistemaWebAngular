import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envs } from '../../../../config/envs';
import { Venta } from '../interfaces/venta.interface';
import { DetalleVenta } from '../interfaces/detalleVenta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(
    private http:HttpClient
  ) { }

  getVentas():Observable<Venta[]>{
    return this.http.get<Venta[]>(`${envs.api}/ventas`)
  }


  crearVenta(venta:Venta):Observable<Venta>{
    return this.http.post<Venta>(`${envs.api}/ventas`,venta);
  }


  crearDetallesVenta(detalles: DetalleVenta[]): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(`${envs.api}/detalleVentas`, detalles);
  }

  actualizarVenta(venta:Venta):Observable<Venta>{
    return this.http.put<Venta>(`${envs.api}/ventas/${venta.venta_id}`,venta)
  }

}
