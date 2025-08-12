import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuarios.interface';
import { envs } from '../../config/envs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http:HttpClient
  ) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${envs.api}/usuarios`)
  }

  


}
