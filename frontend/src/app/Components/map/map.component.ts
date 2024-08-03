import {
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  loading = false;
  @Input() markerData!: any;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  markers: any[] = [];
  mapZoom = 12;
  point = {
    lat: 6.13365,
    lng: 1.22311,
  };
  mapCenter: google.maps.LatLng = new google.maps.LatLng(this.point);
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  openInfoWindow(marker: MapMarker) {
    // this is called when the marker is clicked.
    this.infoWindow.open(marker);
  }
  ngOnAfterViewInit() {
    console.log(this.markers);
    this.addMarker(this.markerData);
  }
  ngOnInit() {
    console.log(this.markers);
  }
  addMarker(markerData: any[]) {
    console.log('marketer', markerData);
    for (const marker of markerData) {
      this.markers.push({
        position: marker.position,
        label: {
          color: marker.color,
          text: 'Marker label ' + (this.markers.length + 1),
        },
        title: 'Marker title ' + (this.markers.length + 1),
        options: { animation: google.maps.Animation.BOUNCE },
      });
    }
  }
}
