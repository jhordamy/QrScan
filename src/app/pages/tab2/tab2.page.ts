import { Component } from '@angular/core';
import { DatalocalService } from 'src/app/services/datalocal.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public datalocal: DatalocalService) {}
  enviarCorreo(){
    console.log('Enviando Correo..');

  }
  abrirRegistro(registro){
    this.datalocal.abrirRegistro(registro);
  }

}
