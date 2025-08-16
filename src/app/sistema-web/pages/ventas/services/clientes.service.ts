import { Injectable } from '@angular/core';
import { Cliente } from '../interfaces/cliente.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { envs } from '../../../../config/envs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private http:HttpClient
  ) { }

  getClientes():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${envs.api}/clientes`);
  }


  crearCliente(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(`${envs.api}/clientes`,cliente)
  }

  buscarCliente(valor: string): Observable<Cliente> {
    let params: any = {};

    // Detectar si es DNI o teléfono
    if (/^\d{8}$/.test(valor)) {
      // 8 dígitos → DNI
      params.dni = valor;
    } 
    if (/^\d{9}$/.test(valor)) {
      // 9 dígitos → Teléfono (ejemplo, ajusta a tu caso)
      params.telefono = valor;
    } 

    return this.http.get<Cliente>(`${envs.api}/clientes/buscar`, { params });
  }



}
