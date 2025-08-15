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
  ) {}

   ngOnInit(): void {
     const usuarioGuardado = localStorage.getItem('usuario');
     if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
   

  }
  

  


  logout() {
    
    this.router.navigate(['/login']);
  }
}
