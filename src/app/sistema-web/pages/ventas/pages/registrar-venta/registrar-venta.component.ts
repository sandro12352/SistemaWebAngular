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

  loadingCliente = false;

  usuario!:Usuario;
  registrarClienteForm:FormGroup;
  valorBusqueda ?: string;
  mensajeError: string | null = null;
  ErrorBusqueda?:string;
  cliente: Cliente | null = null;
  busquedaRealizada: boolean = false;
  nuevoCliente: Cliente = { dni: '', nombre: '', email: '', direccion: '' ,apellidos:'',telefono:'',departamento:''};

  // Productos
  productos: Producto[] = [];
  productoSeleccionadoId: number =1;
  cantidadSeleccionada: number = 1;
  canalVentaSeleccionado:string = '';

  productosVenta: (Producto & { cantidad: number })[] = [];
  precioVentaSeleccionado?:number;
  comentarioVenta?:string;


  //Departamentos
  departamentos: string[] = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
    'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
    'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
  ];


  constructor(
    private clienteService: ClientesService,
    private productoService: ProductosService,
    private ventaService: VentasService,
    private fb:FormBuilder,
  ) {
    this.registrarClienteForm = this.fb.group({
      dni:['',[Validators.maxLength(8),Validators.minLength(8)]],
      nombre:['',[Validators.required]],
      apellidos:['',[Validators.required]],
      telefono:['',[Validators.required,Validators.maxLength(9),Validators.minLength(9)]],
      email:['',[Validators.email]],
      direccion:['',[Validators.required]],
      departamento: ['', Validators.required],
    })

    this.registrarClienteForm.get('departamento')?.valueChanges.subscribe(dep => {
      const dniControl = this.registrarClienteForm.get('dni');

      if (dep && dep.toLowerCase() !== 'lima') {
        // Departamentos distintos de Lima → DNI requerido
        dniControl?.setValidators([Validators.required, Validators.maxLength(8), Validators.minLength(8)]);
      } else {
        // Lima → DNI opcional
        dniControl?.setValidators([Validators.maxLength(8), Validators.minLength(8)]);
      }

      dniControl?.updateValueAndValidity(); // refrescar validadores
    });
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
  // Reiniciar estados
  this.cliente = null;
  this.ErrorBusqueda = '';
  this.busquedaRealizada = false;

  if (!this.valorBusqueda || this.valorBusqueda.trim() === '') {
    this.ErrorBusqueda = 'Debe agregar un DNI o teléfono';
    return;
  }

  this.loadingCliente = true;

  this.clienteService.buscarCliente(this.valorBusqueda).subscribe({
    next: (resp) => {
      this.loadingCliente = false;
      if (resp) {
        this.cliente = { ...resp };
      } else {
        this.ErrorBusqueda = 'Cliente no encontrado. "Registrar cliente".';
      }
      this.busquedaRealizada = true;
    },
    error: () => {
      this.loadingCliente = false;
      this.ErrorBusqueda = 'Ocurrió un error al buscar el cliente.';
      this.busquedaRealizada = true;
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
    dni: this.registrarClienteForm.value.dni?.trim() === '' ? null : this.registrarClienteForm.value.dni,
    email: this.registrarClienteForm.value.email?.trim() === '' ? null : this.registrarClienteForm.value.email
  };

  this.clienteService.crearCliente(this.nuevoCliente).subscribe({
    next: (cliente) => {
      this.cliente = cliente;
      this.valorBusqueda='';
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
    if (!producto) return;

    // Verificar contra stock temporal (el que ya vamos reduciendo en memoria)
   if (this.cantidadSeleccionada > producto.stock || this.cantidadSeleccionada <= 0) return;

      // Si no escribe precio, usar el precio original
    const precioUnitario = this.precioVentaSeleccionado && this.precioVentaSeleccionado > 0
      ? this.precioVentaSeleccionado/this.cantidadSeleccionada
      : producto.valor_venta;

    const yaExiste = this.productosVenta.find(p => p.producto_id === producto.producto_id);
    if (yaExiste) {
      yaExiste.cantidad += this.cantidadSeleccionada;
    } else {
      this.productosVenta.push({ ...producto, cantidad: this.cantidadSeleccionada,valor_venta:precioUnitario });
    }
    

     // Reducir stock temporal
      producto.stock -= this.cantidadSeleccionada;
    // Restablecer selección
   
    this.cantidadSeleccionada = 1;
  }

  quitarProducto(index: number) {
    const productoVenta = this.productosVenta[index]; // El producto que está en el carrito
  if (!productoVenta) return;

  // Buscar en el listado de productos y devolver el stock
  const productoOriginal = this.productos.find(p => p.producto_id === productoVenta.producto_id);
  if (productoOriginal) {
    productoOriginal.stock += productoVenta.cantidad; // Devolver la cantidad eliminada
  }

  // Eliminar del carrito
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
           const productosActualizados= this.productosVenta.map(p => ({
            producto_id: p.producto_id!,
            stock: p.stock - p.cantidad
          }));
        
          
            this.productoService.actualizarProductos(productosActualizados)
              .subscribe({
                next: () => {
                  console.log('Stock actualizado correctamente');
                },
                error: (err) => {
                  console.error('Error actualizando stock', err);
                }
              });


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
    this.valorBusqueda = '';
    this.canalVentaSeleccionado = '';
    this.cliente = null; 
    this.precioVentaSeleccionado = 0;
    this.comentarioVenta = '';
  }


}
