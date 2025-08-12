import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../interfaces/proveedores.interfaces';
declare var bootstrap: any;
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedorComponent  implements OnInit{

  proveedores: Proveedor[] = [];
  editarProveedor:boolean=false;
  proveedorSeleccionado:Proveedor = {
    direccion:'',email:'',nombre:'',razon_social:'',telefono:''
  }
  modal: any;

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerProveedores();
    const modalElement = document.getElementById('modalProveedor');
    this.modal = new bootstrap.Modal(modalElement);
  }

  obtenerProveedores() {
    this.proveedorService.obtenerProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  abrirModal(proveedor?: Proveedor) {
    if(proveedor){
      this.proveedorSeleccionado = { ...proveedor};
       this.editarProveedor=true 
    }else{
      this.proveedorSeleccionado = { nombre: '', direccion: '', telefono: '', email: '', razon_social: '', ruc: '' };
      this.editarProveedor=false;
      
    }
     this.modal.show();
   
    
  }

  guardarProveedor() {
    if (this.proveedorSeleccionado.proveedor_id) {
      const {ruc,...proveedorParaActualizar} = this.proveedorSeleccionado;
      this.proveedorService.actualizarProveedor(proveedorParaActualizar).subscribe(() => {
        this.obtenerProveedores();
        this.modal.hide();
      });
    } else {
      this.proveedorService.agregarProveedor(this.proveedorSeleccionado).subscribe(() => {
        this.obtenerProveedores();
        this.modal.hide();
      });
    }
  }

  eliminarProveedor(id?: number) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.obtenerProveedores();
      });
    }
  }
}
