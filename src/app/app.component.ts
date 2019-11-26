import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  uploadedFiles: Array<File>;

  lista = null;
  prod = {
    codigo: null,
    descripcion: null,
    precio: null,
    imagen: null
  };
  constructor(private productosServicio: ProductosService) { }


  ngOnInit() {
    this.recuperarTodos();
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
  }

  recuperarTodos() {
    this.productosServicio.listar().subscribe(result => {
      this.lista = result;
    });
  }

  nuevo() {
    if (this.prod.descripcion == null || this.prod.precio == null) {
      swal.fire(
        'COMPLETE',
        'TODOS LOS CAMPOS SON REQUERIDOS',
        'error'
      );
      return;
    }
    const formData = new FormData();


    formData.append('descripcion', this.prod.descripcion);
    formData.append('precio', this.prod.precio);
    formData.append('imagen', this.uploadedFiles[0], this.uploadedFiles[0].name);

    this.productosServicio.nuevo(formData).subscribe(result => {
      swal.fire({
        toast: true,
        icon: 'success',
        title: 'Registro satisfactorio',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', swal.stopTimer)
          toast.addEventListener('mouseleave', swal.resumeTimer)
        }
      });
      this.limpiar();
      this.recuperarTodos();
    });
  }

  eliminar(codigo) {
    this.productosServicio.eliminar(codigo).subscribe(result => {
      this.recuperarTodos();
    });
    this.recuperarTodos();
  }

  actualizar() {
    if (this.prod.descripcion == null || this.prod.precio == null) {
      return;
    }
    const formData = new FormData();
    formData.append('codigo', this.prod.codigo);
    formData.append('imagen', this.uploadedFiles[0], this.uploadedFiles[0].name);
    formData.append('descripcion', this.prod.descripcion);
    formData.append('precio', this.prod.precio);
    this.productosServicio.actualizar(formData).subscribe(result => {
      this.limpiar();
      this.recuperarTodos();
    });
  }

  mostrar(codigo) {
    this.productosServicio.mostrar(codigo).subscribe(result => {
      this.prod = result[0];
    });
  }

  hayRegistros() {
    return true;
  }

  limpiar() {
    this.prod = {
      codigo: null,
      descripcion: null,
      precio: null,
      imagen: null
    };
  }
}
