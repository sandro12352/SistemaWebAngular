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



  buscarPorDni(dni:string):Observable<Cliente>{
    return this.http.get<Cliente>(`${envs.api}/clientes/${dni}`)
  }
}
