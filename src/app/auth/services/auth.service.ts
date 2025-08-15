import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { envs } from '../../config/envs';
import { Usuario } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

    constructor(
    private http:HttpClient
  ) { }
  


  validarLogin(email: string, password: string): Observable<Usuario> {
    
    return this.http.post<Usuario>(`${envs.api}/auth/login`, { email, password }).pipe(
      tap((res:any) =>{
        localStorage.setItem('usuario', JSON.stringify(res.usuario))
      } ) // almacena el usuario al hacer login
    );
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  cerrarSesion() {
    this.usuarioSubject.next(null);
  }
  
}
