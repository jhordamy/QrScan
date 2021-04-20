import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Registro } from 'src/app/modelo/registro.model';
import { DatalocalService } from 'src/app/services/datalocal.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public  link = [];
  opts = {
    allowSlidePrev: false,
    allowSlideNext: false,
    };

    constructor(
      private barcodeScanner: BarcodeScanner,
      private datalocal: DatalocalService) {}

    ionViewWillEnter(){
      this.scan();
      console.log('viewWillEnter', 'Se ejecuta antes que cargue la pagina');
    }

    scan(){
      this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);
        if (!barcodeData.cancelled){
          this.datalocal.guardarRegistro(barcodeData.format, barcodeData.text);
        }
       }).catch(err => {
           console.log('Error', err);
           // this.datalocal.guardarRegistro('QR_CODE', 'http://ikenary.com');
           this.datalocal.guardarRegistro('QR_CODE','geo:-3.985837,-79.353839');
           // this.datalocal.guardarRegistro('QR_CODE', 'Hola Bienvenido');
       });
    }

}
