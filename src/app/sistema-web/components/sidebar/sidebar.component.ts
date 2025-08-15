import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../auth/interfaces/usuarios.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
 
  
  isVisible = true;
  isAnimating = false;
  rol!:string;
  usuario!:Usuario;

  


   ngOnInit(): void {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.rol = this.usuario.rol;
      console.log(this.rol)
  }
  }

  toggleSidebar() {
  if (this.isVisible) {
    this.isVisible = false;
  } else {
    this.isVisible = true;
  }
}







}
