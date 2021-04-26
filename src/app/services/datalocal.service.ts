import { Injectable } from '@angular/core';
import { Registro } from '../modelo/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';



@Injectable({
  providedIn: 'root'
})
export class DatalocalService {
  registros: Registro [] = [];
  constructor(
    private storage: Storage,
    private nav: NavController,
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
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
    console.log(reg.type);
    switch (reg.type){
      case 'http':
        this.iab.create(reg.text, '_system');
        break;

      case 'mapa':
        this.nav.navigateForward(`/tabs/mapa/${reg.text}`);        
        break;      
   }
  }
  enviarCorreo (){
    const arrayTemp = [];
    const titulos = 'Tipo,formato,creado,texto\n';
    arrayTemp.push (titulos);
    this.registros.forEach (reg =>{
      var texto = reg.text;
      texto = texto.replace (',', '|');
      let linea = `${reg.type},${reg.format},${reg.create},${texto}\n`;
      arrayTemp.push(linea);
    })
    console.log(arrayTemp.join(''));
    const texto = arrayTemp.join('');
    this.crearArchivo (texto);        
  }
  crearArchivo(texto:string){
    this.file.checkFile (this.file.dataDirectory, 'historial.csv').then (existe =>{
      console.log('Existe Archivo');
      return this.escribirArchivo (texto);
      
    }).catch (err =>{
      console.log('No Existe Archivo, vamos a crearlo');
      return this.file.createFile (this.file.dataDirectory, 'historial.csv', false).then (creado =>{
        this.escribirArchivo (texto);
      }).catch (err2 =>{
        console.log('No se pudo crear el archivo!');
        
      })
    });
  }
  async escribirArchivo(texto:string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'historial.csv', texto);

    // Enviar el correo
    const archivo = `${this.file.dataDirectory}/historial.csv`;

    let email = {
      to: 'masacheladyelizabeth@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Historial de QrScan',
      body: '<strong>QRSCAN</strong><br>Este es el resumen de los escaneos',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
