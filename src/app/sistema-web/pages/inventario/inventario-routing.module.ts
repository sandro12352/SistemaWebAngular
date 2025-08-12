import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ProveedorComponent } from './pages/proveedores/proveedores.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {path:'productos',component:ProductosComponent},
      {path:'categorias',component:CategoriasComponent},
      {path:'proveedores',component:ProveedorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
