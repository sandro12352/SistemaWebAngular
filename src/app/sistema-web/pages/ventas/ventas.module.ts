import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { RegistrarVentaComponent } from './pages/registrar-venta/registrar-venta.component';
import { VerVentasComponent } from './pages/ver-ventas/ver-ventas.component';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListadoVentasComponent } from './components/listado-ventas/listado-ventas.component';


@NgModule({
  declarations: [
    RegistrarVentaComponent,
    VerVentasComponent,
    DetalleVentaComponent,
    ListadoVentasComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
