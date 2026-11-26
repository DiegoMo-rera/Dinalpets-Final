import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  http = inject(HttpClient);
  productos: any[] = [];

  // --- Modo Administrador (JWT) y Carrito ---
  esAdmin: boolean = false;
  mostrarLogin: boolean = false;
  productoEnEdicion: any = null;
  carrito: any[] = [];
  mostrarCarrito: boolean = false;

  imagenesBanner: string[] = [
    'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1920&q=80'
  ];
  
  imagenActual: string = this.imagenesBanner[0];
  indiceActual: number = 0;
  temporizador: any;

  ngOnInit() {
    this.cargarProductos();
    this.cargarCarritoGuardado();
    this.verificarSesion(); // Revisa si ya hay un token JWT guardado
    this.iniciarCarruselAutomatico();
  }

  // --- Lógica de Autenticación con JWT ---
  verificarSesion() {
    const token = localStorage.getItem('tokenDinalpets');
    this.esAdmin = !!token;
  }

  toggleAdmin() {
    if (this.esAdmin) {
      // Cerrar sesión y borrar el token
      localStorage.removeItem('tokenDinalpets');
      this.esAdmin = false;
      this.productoEnEdicion = null;
      alert('Sesión de administrador cerrada.');
    } else {
      // Abrir la ventana de Login
      this.mostrarLogin = true;
    }
  }

  cerrarModalLogin() {
    this.mostrarLogin = false;
  }

  iniciarSesion() {
    const inUser = document.getElementById('loginUsuario') as HTMLInputElement;
    const inPass = document.getElementById('loginPassword') as HTMLInputElement;

    if (!inUser?.value || !inPass?.value) {
      alert('Por favor, ingresa usuario y contraseña.');
      return;
    }

    const credenciales = {
      usuario: inUser.value,
      password: inPass.value
    };

    this.http.post<any>('http://localhost:8080/api/Auth/login', credenciales).subscribe({
      next: (res) => {
        localStorage.setItem('tokenDinalpets', res.token);
        this.esAdmin = true;
        this.mostrarLogin = false;
        alert('¡Bienvenido Administrador! Token JWT activado.');
      },
      error: (err) => {
        console.error('Error de login:', err);
        alert('Usuario o contraseña incorrectos.');
      }
    });
  }

  // Arma la cabecera con el token JWT para las peticiones protegidas
  obtenerHeadersJWT() {
    const token = localStorage.getItem('tokenDinalpets') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- Conexión con la Base de Datos (.NET) ---
  cargarProductos() {
    this.http.get<any[]>('http://localhost:8080/api/Productos').subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error("Error al cargar productos", err)
    });
  }

  guardarProducto() {
    const inNombre = document.getElementById('cajaNombre') as HTMLInputElement;
    const inDesc = document.getElementById('cajaDescripcion') as HTMLInputElement;
    const inPrecio = document.getElementById('cajaPrecio') as HTMLInputElement;
    const inImg = document.getElementById('cajaImg') as HTMLInputElement;

    if (!inNombre || !inNombre.value) {
      alert('Por favor, escribe al menos el nombre del producto.');
      return;
    }

    if (this.productoEnEdicion) {
      const idCorrecto = this.productoEnEdicion.id || this.productoEnEdicion.Id || this.productoEnEdicion.idProducto;
      const productoActualizado = {
        ...this.productoEnEdicion, 
        nombre: inNombre.value,
        descripcion: inDesc.value || '',
        precio: parseFloat(inPrecio.value) || 0,
        imagen: inImg.value || ''
      };

      this.http.put(`http://localhost:8080/api/Productos/${idCorrecto}`, productoActualizado, this.obtenerHeadersJWT())
        .subscribe({
          next: () => {
            alert('¡Producto actualizado en la base de datos!');
            this.cargarProductos(); 
            this.productoEnEdicion = null;
            this.limpiarFormulario(inNombre, inDesc, inPrecio, inImg);
          },
          error: (err) => {
            console.error("Error al actualizar:", err);
            alert('No autorizado o error al actualizar. Verifica tu sesión.');
          }
        });

    } else {
      const nuevoProducto = {
        nombre: inNombre.value,
        descripcion: inDesc.value || '',
        precio: parseFloat(inPrecio.value) || 0,
        imagen: inImg.value || ''
      };

      this.http.post('http://localhost:8080/api/Productos', nuevoProducto, this.obtenerHeadersJWT())
        .subscribe({
          next: () => {
            alert('¡Producto guardado en la base de datos!');
            this.cargarProductos();
            this.limpiarFormulario(inNombre, inDesc, inPrecio, inImg);
          },
          error: (err) => {
            console.error("Error al crear:", err);
            alert('No autorizado o error al crear el producto.');
          }
        });
    }
  }

  limpiarFormulario(n: any, d: any, p: any, i: any) {
    if(n) n.value = ''; if(d) d.value = ''; if(p) p.value = ''; if(i) i.value = '';
  }

  eliminarProducto(producto: any) {
    const idCorrecto = producto.id || producto.Id || producto.idProducto;
    if (confirm(`¿Estás seguro de que quieres eliminar permanentemente "${producto.nombre || producto.Nombre}"?`)) {
      this.http.delete(`http://localhost:8080/api/Productos/${idCorrecto}`, this.obtenerHeadersJWT())
        .subscribe({
          next: () => {
            alert('Producto eliminado de la base de datos.');
            this.cargarProductos();
          },
          error: (err) => {
            console.error("Error al eliminar:", err);
            alert('No autorizado o no se pudo eliminar el producto.');
          }
        });
    }
  }

  prepararEdicion(producto: any) {
    this.productoEnEdicion = producto;
    setTimeout(() => {
      const inNombre = document.getElementById('cajaNombre') as HTMLInputElement;
      const inDesc = document.getElementById('cajaDescripcion') as HTMLInputElement;
      const inPrecio = document.getElementById('cajaPrecio') as HTMLInputElement;
      const inImg = document.getElementById('cajaImg') as HTMLInputElement;

      if (inNombre) inNombre.value = producto.nombre || producto.Nombre || '';
      if (inDesc) inDesc.value = producto.descripcion || producto.Descripcion || '';
      if (inPrecio) inPrecio.value = producto.precio || producto.Precio || '';
      if (inImg) inImg.value = producto.imagen || producto.Imagen || '';
      
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 10);
  }

  // --- Memoria Persistente del Carrito ---
  guardarCarritoEnNavegador() {
    localStorage.setItem('carritoDinalpets', JSON.stringify(this.carrito));
  }

  cargarCarritoGuardado() {
    const carritoGuardado = localStorage.getItem('carritoDinalpets');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  // --- Lógica del Carrito ---
  toggleCarrito() { this.mostrarCarrito = !this.mostrarCarrito; }
  
  agregarAlCarrito(producto: any) { 
    this.carrito.push(producto); 
    this.guardarCarritoEnNavegador();
    this.mostrarCarrito = true; 
  }
  
  eliminarDelCarrito(indice: number) { 
    this.carrito.splice(indice, 1); 
    this.guardarCarritoEnNavegador();
  }
  
  get totalCarrito(): number {
    return this.carrito.reduce((suma, item) => suma + (item.precio || item.Precio || 0), 0);
  }

  procederAlPago() {
    alert('¡Gracias por tu compra en Dinalpets! Procesando pedido...');
    this.carrito = [];
    localStorage.removeItem('carritoDinalpets');
    this.mostrarCarrito = false;
  }

  // --- Lógica del Carrusel ---
  iniciarCarruselAutomatico() { this.temporizador = setInterval(() => { this.avanzarImagen(); }, 4000); }
  reiniciarTemporizador() { clearInterval(this.temporizador); this.iniciarCarruselAutomatico(); }
  avanzarImagen() { this.indiceActual = (this.indiceActual + 1) % this.imagenesBanner.length; this.imagenActual = this.imagenesBanner[this.indiceActual]; }
  anteriorImagen() { this.indiceActual = (this.indiceActual - 1 + this.imagenesBanner.length) % this.imagenesBanner.length; this.imagenActual = this.imagenesBanner[this.indiceActual]; this.reiniciarTemporizador(); }
  siguienteImagen() { this.avanzarImagen(); this.reiniciarTemporizador(); }
}