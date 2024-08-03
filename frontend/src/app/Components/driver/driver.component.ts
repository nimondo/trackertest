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
import {
  interval,
  Subscription,
} from 'rxjs';
import { DeliveryService } from 'src/app/Services/delivery.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent {
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
          text: 'Marker label ' + (this.markers.length + 1),
        },
        title: 'Marker title ' + (this.markers.length + 1),
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
  packages: any;
  delivery: any;
  markerdata: any[] = [];
  filterForm: FormGroup = new FormGroup({
    searchFilter: new FormControl<string>(''),
  });
  searchFilter: string = '';
  filterFormSubsription!: Subscription;
  constructor(
    private deliveryService: DeliveryService,
    private socket: Socket
  ) {}
  ngOnDestroy(): void {
    // this.filterFormSubsription.unsubscribe();
  }

  //get all Form Fields
  get search() {
    return this.filterForm.get('searchFilter');
  }
  ngOnInit(): void {
    this.setCurrentLocation();
    let subscribe = interval(20000).subscribe((val) => {
      this.setCurrentLocation();
      // console.log('test', val);
    });
    if (['delivered', 'failed'].includes(this.delivery?.status)) {
      subscribe.unsubscribe();
    }

    this.socket.on('connect', () => {
      console.log('Connected to server 2');
    });

    // this.filterFormSubsription = this.filterForm.valueChanges
    //   .pipe(debounceTime(400))
    //   .subscribe((changes) => {
    //     this.searchFilter = changes.searchFilter;
    //     this.deliveryService.get(this.searchFilter).subscribe({
    //       next: (res) => {
    //         console.log('changes', res);
    //         this.packages = res.delivery?.package_id;
    //         this.delivery = res.delivery;
    //       },
    //     });
    //   });
  }
  // submit fntc
  onSubmit() {
    this.deliveryService.get(this.search?.value).subscribe({
      next: (res) => {
        this.packages = res.delivery?.package_id;
        this.delivery = res.delivery;
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
        for (const packageData of this.packages) {
          this.markerdata.push({
            position: {
              lat: Number(packageData?.from_location?.lat),
              lng: Number(packageData?.from_location?.long),
            },
            color: 'red',
          });
          this.markerdata.push({
            position: {
              lat: Number(packageData.to_location?.lat),
              lng: Number(packageData?.to_location?.long),
            },
            color: 'red',
          });
        }
        this.addMarker(this.markerdata);
      },
    });
  }
  onPickedUp(id: string = '') {
    if (id) {
      this.updateData(
        id,
        { status: 'picked-up', pickup_time: new Date() },
        'status_changed'
      );
    }
  }
  onInTransit(id: string) {
    this.updateData(
      id,
      { status: 'in-transit', start_time: new Date() },
      'status_changed'
    );
  }
  onDelivered(id: string) {
    this.updateData(
      id,
      { status: 'delivered', end_time: new Date() },
      'status_changed'
    );
  }
  onFailed(id: string) {
    this.updateData(
      id,
      { status: 'failed', start_time: new Date() },
      'status_changed'
    );
  }
  updateData(id: string, data: any, operation: string) {
    this.deliveryService.Update(id, data).subscribe({
      next: (res) => {
        if (operation == 'location_changed') {
          this.socket.emit('location_changed', { id: id, ...data });
          this.socket.on('delivery_updated', (data: any) => {
            console.log('message:', data);
          });
        } else {
          this.socket.emit('status_changed', { id: id, ...data });
          this.socket.on('delivery_updated', (data: any) => {
            console.log('message:', data);
          });
        }

        // this.socket.fromEvent<any>('editDelivery').subscribe({
        //   next: (data) => {
        //     console.log('data', data);
        //   },
        // });

        this.delivery = { ...this.delivery, ...data };

        // console.log('after update', this.delivery);
      },
    });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.point.lat = position.coords.latitude;
          this.point.lng = position.coords.longitude;
          this.updateMarker(this.point);
        },
        (error) => {
          this.point.lat = 6.13365;
          this.point.lng = 1.22311;
          this.updateMarker(this.point);
        }
      );
    } else {
      this.point.lat = 6.13365;
      this.point.lng = 1.22311;
      this.updateMarker(this.point);
    }
  }

  updateMarker(point: any) {
    if (this.markerdata.length == 0) {
      this.markerdata = [
        {
          position: new google.maps.LatLngAltitude(point),
          color: 'blue',
          icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        },
      ];
    } else {
      this.markerdata[0].position = new google.maps.LatLngAltitude(point);
    }
    this.addMarker(this.markerdata);
    if (this.delivery?._id) {
      this.updateData(
        this.delivery._id,
        {
          location: {
            lat: point.lat,
            long: point.lng,
          },
        },
        'location_changed'
      );
    }
  }
}
