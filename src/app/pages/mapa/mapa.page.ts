import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let geo = this.route.snapshot.paramMap.get('geo');
    geo = geo.substring(4);
    var data = geo.split(',');
    this.lat = Number (data[0]);
    this.lng = Number (data[1]);
    console.log(this.lat);
    console.log(this.lng);
    
  }
  ngAfterViewInit(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiamhvcmRhbXkiLCJhIjoiY2tubzRoaDBrMTQ5ajJycGI2cGlwdGVjMiJ9.GbLQW1yVjZgaJmBtqX4jmw';
    var map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 18,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
      });
      // tslint:disable-next-line:whitespace
      map.on('load',() => {
        map.resize();
        var marker = new mapboxgl.Marker()
          .setLngLat([this.lng, this.lat])
          .addTo(map);
        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
        let labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
          break;
         }
        }
     
        map.addLayer(
        {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
        },
         
        labelLayerId
        );
        });
    // map.on('load', () => {
    // map.resize();
  // });
  }

}
