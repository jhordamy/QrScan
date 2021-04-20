export class Registro{
    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public create: Date;

    constructor(format: string, text: string){
        this.format = format;
        this.text = text;
        this.create = new Date();
        this.identificarTipo();
    }
    private identificarTipo() {
        const inicioTexto = this.text.substring(0, 4);
        switch (inicioTexto){
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            case 'geo':
                this.type = 'mapa';
                this.icon = 'pin';
                break;
            default:
                this.type = 'mapa';
                this.icon = 'create';
                break;
        }
    }
}
