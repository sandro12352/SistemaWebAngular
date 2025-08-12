import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from '../../../auth/interfaces/usuarios.interface';
import { Trabajador } from '../../../auth/interfaces/trabajadores.interfaces';
import { TrabajdorService } from '../../../auth/services/trabajdor.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {

  usuario!:Usuario;
  trabajadores:Trabajador[] = [];

  constructor(
    private router: Router,
    private trabajadorService:TrabajdorService,
  ) {}

   ngOnInit(): void {
      this.trabajadorService.getTrabajadores().subscribe(resp=>{
        this.trabajadores = resp;
      })

     const usuarioGuardado = localStorage.getItem('usuario');
     if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
   

  }

  getNombreTrabajador(trabajador_id: number): string {
  const trabajador = this.trabajadores?.find(t => t.trabajador_id === trabajador_id);
  return trabajador 
    ? `${trabajador.nombre} ${trabajador.apellidos || ''}` 
    : '';
}


  logout() {
    
    this.router.navigate(['/login']);
  }
}
