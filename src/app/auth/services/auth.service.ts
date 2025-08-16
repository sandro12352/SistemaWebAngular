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

    constructor(private http: HttpClient) {
    // al iniciar el servicio, revisa si hay usuario en localStorage
    const user = localStorage.getItem('usuario');
    if (user) {
      this.usuarioSubject.next(JSON.parse(user));
    }
  }

  validarLogin(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${envs.api}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.usuarioSubject.next(res.usuario); // ✅ actualiza el BehaviorSubject
      })
    );
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }
}
