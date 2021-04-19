import { Injectable } from '@angular/core';
import { Registro } from '../modelo/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Injectable({
  providedIn: 'root'
})
export class DatalocalService {
  registros: Registro [] = [];
  constructor(
    private storage: Storage,
    private nav: NavController,
    private iab: InAppBrowser
   ) {
    this.cargarStorage();
    // this.storage.get('registros'). then(reg => {
    // this.arrayRegistros = reg || [];
    // });
  }

  async cargarStorage(){
    await this.storage.create();
    this.registros = (await this.storage.get('registros')) || [];
  }

  async guardarRegistro(format: string, text: string){
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format, text);
    this.registros.unshift(nuevoRegistro);
    console.log(this.registros);
    this.storage.set('registros', this.registros);

    this.abrirRegistro(nuevoRegistro);

  }
  abrirRegistro(reg: Registro){
    this.nav.navigateForward('tabs/tab2');
    switch (reg.type){
      case 'http':
        this.iab.create(reg.text);
        break;

      case 'mapa':
        this.nav.navigateForward(`/tabs/mapa + ${reg.text}`);
        // this.nav.navigateForward('tabs/mapa' + reg.text);
        console.log(reg.text, reg.type);
        break;
      default:
        // implement un mensaje en pantalla
        console.log(reg.text, reg.type);
        break;
  }

  }
}
