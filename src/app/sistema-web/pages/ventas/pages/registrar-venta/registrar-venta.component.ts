import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../../inventario/interfaces/productos.interface';
import { ProductosService } from '../../../inventario/services/productos.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { ClientesService } from '../../services/clientes.service';
import { VentasService } from '../../services/ventas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Venta } from '../../interfaces/venta.interface';
import { Usuario } from '../../../../../auth/interfaces/usuarios.interface';
import { DetalleVenta } from '../../interfaces/detalleVenta.interface';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-registrar-venta',
  templateUrl: './registrar-venta.component.html',
  styleUrl: './registrar-venta.component.css'
})
export class RegistrarVentaComponent implements OnInit{
   @ViewChild('modalCarga', { static: false }) modalCargaRef!: ElementRef;
  @ViewChild('modalExito', { static: false }) modalExitoRef!: ElementRef;

  mostrarToast = false;

  usuario!:Usuario;
  registrarClienteForm:FormGroup;
  dniCliente: string = '';
  mensajeError: string | null = null;
  mensajeErrorDni?:string;
  cliente: Cliente | null = null;
  busquedaRealizada: boolean = false;
  nuevoCliente: Cliente = { dni: '', nombre: '', email: '', direccion: '' ,apellidos:'',telefono:''};

  // Productos
  productos: Producto[] = [];
  productoSeleccionadoId: number =1;
  cantidadSeleccionada: number = 1;
  canalVentaSeleccionado:string = '';

  productosVenta: (Producto & { cantidad: number })[] = [];
  precioVentaSeleccionado?:number;
  comentarioVenta?:string;

  constructor(
    private clienteService: ClientesService,
    private productoService: ProductosService,
    private ventaService: VentasService,
    private fb:FormBuilder,
  ) {
    this.registrarClienteForm = this.fb.group({
      dni:['',[Validators.required,Validators.maxLength(8),Validators.minLength(8)]],
      nombre:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      telefono:['',[Validators.required,Validators.maxLength(9),Validators.minLength(9)]],
      email:['',[Validators.email]],
      direccion:['',[Validators.required]]
    })
  }

  ngOnInit(): void { 
   
      const usuarioGuardado = localStorage.getItem('usuario');
     if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos()
      .subscribe(data => this.productos = data);
  }

  buscarCliente() {
    if (!this.dniCliente || this.dniCliente.trim() === '') {
    this.mensajeErrorDni = 'Debe agregar un DNI';
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
    this.busquedaRealizada = true;
    this.cliente = null;
    return;
  }
    this.clienteService.buscarPorDni(this.dniCliente).subscribe({
      next: (resp) => {
        console.log(this.dniCliente)
        this.cliente = resp;
        this.busquedaRealizada = true;
      },
      error: () => {
        this.cliente = null;
         this.mostrarToast = true;
         setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
        this.busquedaRealizada = true;
        this.mensajeErrorDni = 'Cliente no encontrado."Registrar cliente".';
      }
    });
  }

  guardarCliente() {
  if (this.registrarClienteForm.invalid) {
    this.registrarClienteForm.markAllAsTouched();
    return;
  }

  this.nuevoCliente = {
  ...this.registrarClienteForm.value,
  email: this.registrarClienteForm.value.email?.trim() === '' ? null : this.registrarClienteForm.value.email
};
  this.clienteService.crearCliente(this.nuevoCliente).subscribe({
    next: (cliente) => {
      this.cliente = cliente;
      this.dniCliente = cliente.dni;
      this.busquedaRealizada = true;
      this.registrarClienteForm.reset();

      const modalElement = document.getElementById('modalCliente');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    },
    error:(error)=>{

      this.mensajeError = error.error.error; // Mostrar mensaje del backend
      
    }
  });
  }


  get stockDisponible(): number {
  const prod = this.productos.find(p => p.producto_id === +this.productoSeleccionadoId);
  return prod ? prod.stock : 0;
  }

  agregarProducto() {
    const producto = this.productos.find(p => p.producto_id === +this.productoSeleccionadoId);
    if (!producto || this.cantidadSeleccionada > producto.stock || this.cantidadSeleccionada <= 0) return;

      // Si no escribe precio, usar el precio original
    const precioUnitario = this.precioVentaSeleccionado && this.precioVentaSeleccionado > 0
      ? this.precioVentaSeleccionado
      : producto.valor_venta;

    const yaExiste = this.productosVenta.find(p => p.producto_id === producto.producto_id);
    if (yaExiste) {
      yaExiste.cantidad += this.cantidadSeleccionada;
    } else {
      this.productosVenta.push({ ...producto, cantidad: this.cantidadSeleccionada,valor_venta:precioUnitario });
    }

    // Restablecer selección
   
    this.cantidadSeleccionada = 1;
  }

  quitarProducto(index: number) {
    this.productosVenta.splice(index, 1);
  }

  calcularTotal(): number {
    return this.productosVenta.reduce((acc, p) => acc + p.valor_venta * p.cantidad, 0);
  } 

  registrarVenta() {
    if (!this.cliente || this.productosVenta.length === 0) return;

       

    const venta:Venta = {
      cliente_id:this.cliente.cliente_id!,
      usuario_id:this.usuario.usuario_id!,
      fecha_venta:new Date(),
      igv:this.calcularIGV(),
      total: this.calcularTotal(),
      estado:'pendiente',
      canal_venta:this.canalVentaSeleccionado,
      comentario:this.comentarioVenta,
    };

   
    this.ventaService.crearVenta(venta).subscribe({
      next:(ventaRegistrada)=>{

      const detallesVenta: DetalleVenta[] = this.productosVenta.map(prod => ({
        venta_id:  ventaRegistrada.venta_id!,
        producto_id: prod.producto_id!,
        cantidad: prod.cantidad,
        precio_vendido: +prod.valor_venta,
        subtotal: prod.cantidad * prod.valor_venta,
      }));
     
      
      this.ventaService.crearDetallesVenta(detallesVenta).subscribe({
        next:res=>{
             Swal.fire({
              title: 'Registrando Venta...',
              text: 'Espere unos segundos.',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

            // Paso 2: Simular un retraso de 2 segundos y luego mostrar mensaje de éxito
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: '¡Venta registrada con éxito!',
                text: 'Gracias..',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#53cd48ff'
              });
            }, 2000);
            
            this.limpiarRegistro();
          
          
            
        },
         error: err => {
          console.error('Error al registrar detalles de venta', err);
          alert('Error al registrar la venta');
        }
      })
      

        
      }
    })


    
  }

  calcularIGV(): number {
  const total = this.calcularTotal();
  return parseFloat((total * 0.18).toFixed(2)); // ejemplo con 18%
  }

  limpiarRegistro(){
    this.productosVenta = [];
    this.registrarClienteForm.reset();
    this.dniCliente = '';
    this.canalVentaSeleccionado = '';
    this.cliente = null; 
    this.precioVentaSeleccionado = 0;
    this.comentarioVenta = '';
  }


}
