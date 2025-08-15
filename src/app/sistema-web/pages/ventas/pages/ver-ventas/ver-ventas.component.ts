import { Component, OnInit } from '@angular/core';
import { Venta } from '../../interfaces/venta.interface';
import { VentasService } from '../../services/ventas.service';
declare var bootstrap: any;


@Component({
  selector: 'app-ver-ventas',
  templateUrl: './ver-ventas.component.html',
  styleUrl: './ver-ventas.component.css'
})
export class VerVentasComponent implements OnInit {
    


  // variables
    ventas: Venta[] = [];                // todas las ventas recibidas del backend
    ventasFiltradas: Venta[] = [];   
   

  constructor(
    private ventaService:VentasService,
  ){}
  ngOnInit(): void {
   this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe(data => {
      this.ventas = data;
      this.ventasFiltradas = [...data].reverse();
    });
  }

  totalMostrado() {
     let suma = 0;
  (this.ventasFiltradas || []).forEach(v => {
    const total = Number(v.total);
    suma += total ;
  });
  return suma;
  }

  totalPagado() {
    return (this.ventasFiltradas || []).filter(v => v.estado === 'pagado').reduce((s, v) => s + (Number(v.total) || 0), 0);
  }

  
  exportarCSV() { /* preparar CSV y descargar */ }


 

}
