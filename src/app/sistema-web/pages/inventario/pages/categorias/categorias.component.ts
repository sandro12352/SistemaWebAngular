import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria.interface';
declare var bootstrap: any;
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{
   
  categorias:Categoria[] = [];
  nuevaCategoria:string ='';
  categoriaSeleccionada: Categoria = { categoria_id: 0, nombre: '' };
  constructor(
    private categoriaService:CategoriasService
  ){}

   ngOnInit(): void {
     this.categoriaService.getCategorias()
     .subscribe(resp=>{
      this.categorias = resp
    
     })
    }
  registrarCategoria() {
    this.categoriaService.crearCategoria(this.nuevaCategoria)
      .subscribe(() => {
        this.cargarCategorias();
        this.nuevaCategoria = '';
      });
  }

  editarCategoria(categoria: Categoria){
      this.categoriaSeleccionada = { ...categoria }; // Copia para evitar cambios directos
      const modal = new bootstrap.Modal(document.getElementById('editarCategoriaModal')!);
      modal.show();
  }

  guardarCambios() {
    this.categoriaService.actualizarCategoria(this.categoriaSeleccionada)
      .subscribe(() => {
        // Actualizar lista si es necesario
        this.cargarCategorias(); // Ejemplo
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarCategoriaModal')!);
        modal?.hide();
      });
  }
  
  eliminarCategoria(categoria: Categoria) {
 if (confirm('¿Eliminar producto?') && categoria) {
      this.categoriaService.eliminarCategoria(categoria)
      .subscribe(()=>{this.cargarCategorias()});
    }
}

  cargarCategorias() {
    this.categoriaService.getCategorias()
      .subscribe(resp => this.categorias = resp);
  }

}
