import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { RegistrarVentaComponent } from './pages/registrar-venta/registrar-venta.component';
import { VerVentasComponent } from './pages/ver-ventas/ver-ventas.component';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegistrarVentaComponent,
    VerVentasComponent,
    DetalleVentaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
