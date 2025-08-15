import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/productos.interface';
import { CategoriasService } from '../../services/categorias.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Proveedor } from '../../interfaces/proveedores.interfaces';

declare var bootstrap: any;
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit{
    
    productos: Producto[] = [];
    categorias:Categoria[]=[];
    proveedores:Proveedor[]=[];
    isLoading = true;
    productoEditando: Producto = this.nuevoProducto()

  constructor(
    private productoService:ProductosService,
    private categoriaService:CategoriasService,
    private proveedorService:ProveedorService,
  ){}

  ngOnInit(): void {
     this.proveedorService.obtenerProveedores()
      .subscribe(res=>{
        this.proveedores=res;
      });
     this.categoriaService.getCategorias()
      .subscribe(res=>{
        this.isLoading = false;
        this.categorias = res;
      });
     
      this.productoService.getProductos()
      .subscribe(res=>{
        this.productos = res;
      });
     
  }


   nuevoProducto(): Producto {
    return {
      proveedor_id: 0,
      categoria_id: 0,
      nombre: '',
      valor_compra: 0,
      valor_venta: 0,
      fecha_compra: '',
      stock: 0,
      descripcion: '',
    };
  }

  

   guardarProducto() {
    if (this.productoEditando.producto_id) {
      // Editar existente
      const index = this.productos.findIndex(p => p.producto_id === this.productoEditando.producto_id);
      this.productoService.actualizarProducto(this.productoEditando)
      .subscribe(()=>{
        this.cargarProductos();
        bootstrap.Modal.getInstance(document.getElementById('productoModal')).hide();
      })
    } else {
      // Crear nuevo
      this.productoService.crearProducto(this.productoEditando)
      .subscribe(()=>{
        this.cargarProductos();
        this.productoEditando = this.nuevoProducto();
      });
    }

    bootstrap.Modal.getInstance(document.getElementById('productoModal')).hide();
  }

  editarProducto(p: Producto) {
    this.productoEditando = { ...p };
    console.log(p.categoria_id,p.producto_id)
    new bootstrap.Modal(document.getElementById('productoModal')).show();
  }

  eliminarProducto(id: number | undefined) {
    if (confirm('¿Eliminar producto?') && id) {
      this.productoService.eliminarProducto(id)
      .subscribe(()=>{this.cargarProductos()});
    }
  }

  abrirFormulario() {
      this.productoEditando = this.nuevoProducto();
      new bootstrap.Modal(document.getElementById('productoModal')).show();
    }


    cargarProductos(){
      this.productoService.getProductos()
      .subscribe(res=>{
        this.productos=res;
      })
    }
 } 
