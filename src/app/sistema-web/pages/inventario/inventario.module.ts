import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { ProductosComponent } from './pages/productos/productos.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { FormsModule } from '@angular/forms';
import { ProveedorComponent } from './pages/proveedores/proveedores.component';


@NgModule({
  declarations: [
    ProductosComponent,
    CategoriasComponent,
    ProveedorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventarioRoutingModule
  ]
})
export class InventarioModule { }
