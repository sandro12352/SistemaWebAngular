import { Component, OnInit } from '@angular/core';
import { Venta } from '../../interfaces/venta.interface';
import { VentasService } from '../../services/ventas.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { ClientesService } from '../../services/clientes.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DetalleVenta } from '../../interfaces/detalleVenta.interface';
declare var bootstrap: any;


@Component({
  selector: 'app-ver-ventas',
  templateUrl: './ver-ventas.component.html',
  styleUrl: './ver-ventas.component.css'
})
export class VerVentasComponent implements OnInit {
    private modalInstance: any = null;

    mediosPago: string[] = [
    'Efectivo', 
    'Tarjeta', 
    'Transferencia', 
    'Yape', 
    'Plin', 
    'Qr', 
    'Otros'
  ];


  // variables
    ventas: Venta[] = [];                // todas las ventas recibidas del backend
    ventasFiltradas: Venta[] = [];   
    clientes:Cliente[]=[];   // resultado luego de aplicar filtros
    ventaSeleccionada: Venta | undefined;
    pagina = 1;
    pageSize = 9;
    filtro = { q: '', desde: '', hasta: '', estado: '' };
    detalleVenta : DetalleVenta[] = [];

  constructor(
    private ventaService:VentasService,
    private clienteService:ClientesService,
    private router:Router
  ){}
  ngOnInit(): void {
   this.cargarVentas();

   this.clienteService.getClientes().subscribe(clientes=>{
    this.clientes = clientes;
   })
  }


 


  cargarVentas() {
    this.ventaService.getVentas().subscribe(data => {
      this.ventas = data;
      this.ventasFiltradas = [...data].reverse();
    });
  }

   


  aplicarFiltros() {
    const q = this.filtro.q.trim().toLowerCase();
    const desde = this.filtro.desde ? new Date(this.filtro.desde) : null;
    const hasta = this.filtro.hasta ? new Date(this.filtro.hasta) : null;
    const estado = this.filtro.estado;
    


    this.ventasFiltradas = this.ventas.filter(venta => {
      // Buscar por venta_id convertido a texto
      const busqueda = venta.venta_id?.toString().includes(q) || ((venta.cliente!.nombre).toLowerCase().includes(q)) 

      const filtroDesde = !desde || new Date(venta.fecha_venta) >= desde;
      const filtroHasta = !hasta || new Date(venta.fecha_venta) <= hasta;
      const filtroEstado = !estado || venta.estado === estado;

      return busqueda && filtroDesde && filtroHasta && filtroEstado;
    }); 
    
    this.ventasFiltradas.reverse();
    // Reiniciar página al filtrar
    this.pagina = 1;
    }

  ventasPaginadas() {
    const start = (this.pagina - 1) * this.pageSize;
    return (this.ventasFiltradas || []).slice(start, start + this.pageSize);
  }

  paginasArray() {
    const n = this.totalPaginas();
    return Array.from({length: n}, (_, i) => i + 1);
  }

  totalPaginas() {
    return Math.max(1, Math.ceil((this.ventasFiltradas?.length || 0) / this.pageSize));
  }

  cambiarPagina(p: number) {
    if (p < 1 || p > this.totalPaginas()) return;
    this.pagina = p;
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
    return (this.ventasFiltradas || []).filter(v => v.estado === 'pagado').reduce((s, v) => s + (v.total || 0), 0);
  }

  // acciones
  verDetalle(venta:Venta) {
    this.ventaSeleccionada = venta;
    const modalElement = document.getElementById('modalDetalleVenta');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  recibirPago(venta:Venta , medio?:string) {
    this.ventaSeleccionada = venta;
    if (!venta || !medio) return;
      venta.tipo_pago = medio.toLowerCase();

      Swal.fire({
        icon: 'success',
        title: `Medio de pago: ${medio}`,
        timer: 1500,
        showConfirmButton: false
      });
      venta.estado = 'pagado'
      this.ventaService.actualizarVenta(venta).subscribe();

  }


  marcarEnviado(venta: Venta) {
  Swal.fire({
    title: '¿Está seguro?',
    text: "Esta venta será marcada como enviada.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, enviar'
  }).then((result) => {
    if (result.isConfirmed) {
      venta.estado = 'enviado';
      this.ventaService.actualizarVenta(venta).subscribe();

      Swal.fire({
        title: 'Enviado',
        text: 'La venta ha sido marcada como enviada.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

  anularVenta(venta:Venta) { 
    Swal.fire({
      title: "Estas seguro de anular?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        venta.estado = 'cancelado';
        this.ventaService.actualizarVenta(venta).subscribe(()=>
        console.log(venta));
        
      }
    });
  }
  exportarCSV() { /* preparar CSV y descargar */ }


  GuardarVenta(venta:Venta) { 
      this.ventaService.actualizarVenta(venta).subscribe(()=>{
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
      })

  }
  
  limpiarFiltros() {
    this.filtro = { q: '', desde: '', hasta: '', estado: '' };
    this.aplicarFiltros();
  }

}
