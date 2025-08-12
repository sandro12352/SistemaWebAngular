import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajador } from '../interfaces/trabajadores.interfaces';
import { envs } from '../../config/envs';

@Injectable({
  providedIn: 'root'
})
export class TrabajdorService {

  constructor(
    private http:HttpClient
  ) { }

  getTrabajadores():Observable<Trabajador[]>{
    return this.http.get<Trabajador[]>(`${envs.api}/trabajadores`)
  }


}
