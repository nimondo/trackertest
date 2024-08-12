import {
  Component,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';

import { Socket } from 'ngx-socket-io';
import { PackageService } from 'src/app/Services/package.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css'],
})
export class TrackerComponent {
  errorMessage: string = '';
  loading = false;
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

  addMarker(markerData: any[]) {
    this.markers = [];
    for (const marker of markerData) {
      this.markers.push({
        position: marker.position,
        label: {
          color: marker.color,
          text: marker.name ||'Marker label ' + (this.markers.length + 1),
        },
        title: marker.name ||'Marker title ' + (this.markers.length + 1),
        options: {
          animation: google.maps.Animation.BOUNCE,
        },
        icon:
          marker.icon ||
          'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
        //icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      });
    }
  }
  package: any;
  delivery: any;
  deliveryData: any;
  markerdata: any[] = [];
  filterForm: FormGroup = new FormGroup({
    searchFilter: new FormControl<string>(''),
  });
  searchFilter: string = '';
  // filterFormSubsription!: Subscription;
  constructor(private packageService: PackageService, private socket: Socket) {}
  // ngOnDestroy(): void {
  //   // this.filterFormSubsription.unsubscribe();
  // }
  ngOnInit(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server tracker');
    });
    this.socket.on('delivery', (data: any) => {
      this.deliveryData = data;
      if (this.deliveryData.id?.includes(this.package?._id)) {
        this.getDelivery();
      }
    });
    this.socket.on('delivery_updated', (data: any) => {
      console.log('message:', data);
      this.deliveryData = data;
      if (this.deliveryData.id?.includes(this.delivery?._id)) {
        this.updateDelivery(this.deliveryData);
      }
    });
  }

  getDelivery() {
    this.packageService.get(this.package._id).subscribe({
      next: (res) => {
        this.package = res.package;
        this.delivery = res.package?.active_delivery_id;
        this.markerdata = [
          {
            position: new google.maps.LatLngAltitude({
              lat: parseFloat(this.delivery?.location?.lat),
              lng: parseFloat(this.delivery?.location?.long),
            }),
            color: 'blue',
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          },
        ];
        this.package.push({
          position: {
            lat: Number(this.package?.from_location?.lat),
            lng: Number(this.package?.from_location?.long),
          },
          color: 'red',
          name: this.package?.from_name
        });
        this.markerdata.push({
          position: {
            lat: Number(this.package.to_location?.lat),
            lng: Number(this.package?.to_location?.long),
          },
          color: 'red',
          name: this.package?.to_name
        });
        this.addMarker(this.markerdata);
      },
    });
  }
  updateDelivery(data: any) {
    this.delivery = { ...this.delivery, ...data };
    this.markerdata = [
      {
        position: new google.maps.LatLngAltitude({
          lat: parseFloat(this.delivery?.location?.lat),
          lng: parseFloat(this.delivery?.location?.long),
        }),
        color: 'blue',
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      },
    ];
    this.markerdata.push({
      position: {
        lat: Number(this.package?.from_location?.lat),
        lng: Number(this.package?.from_location?.long),
      },
      color: 'red',
      name: this.package?.from_name
    });
    this.markerdata.push({
      position: {
        lat: Number(this.package.to_location?.lat),
        lng: Number(this.package?.to_location?.long),
      },
      color: 'red',
      name: this.package?.to_name
    });
    this.addMarker(this.markerdata);
  }
  //get all Form Fields
  get search() {
    return this.filterForm.get('searchFilter');
  }

  // submit fntc
  onSubmit() {
    this.packageService.get(this.search?.value).subscribe({
      next: (res) => {
        this.package = res.packageData;
        this.delivery = res.packageData?.active_delivery_id;
        this.markerdata = [
          {
            position: new google.maps.LatLngAltitude({
              lat: parseFloat(this.delivery?.location?.lat),
              lng: parseFloat(this.delivery?.location?.long),
            }),
            color: 'blue',
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          },
        ];
        this.markerdata.push({
          position: {
            lat: Number(this.package?.from_location?.lat),
            lng: Number(this.package?.from_location?.long),
          },
          color: 'red',
          name: this.package?.from_name
        });
        this.markerdata.push({
          position: {
            lat: Number(this.package.to_location?.lat),
            lng: Number(this.package?.to_location?.long),
          },
          color: 'red',
          name: this.package?.to_name
        });
        this.addMarker(this.markerdata);
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.markers = []; // Clear markers on error
        this.package = null;
        this.delivery = null;
      },
    });
  }
}
