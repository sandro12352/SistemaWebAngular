import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envs } from '../../../../config/envs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private http:HttpClient,
  ) { }

  getCategorias():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${envs.api}/categorias`)
  }


  crearCategoria(nombre:string):Observable<Categoria>{
    return this.http.post<Categoria>(`${envs.api}/categorias`,{nombre})
  }

  actualizarCategoria(categoria:Categoria):Observable<Categoria>{
    return this.http.put<Categoria>(`${envs.api}/categorias/${categoria.categoria_id}`,
      categoria)
  }

  eliminarCategoria(categoria:Categoria):Observable<Categoria>{
    return this.http.delete<Categoria>(`${envs.api}/categorias/${categoria.categoria_id}`)
  }
}
