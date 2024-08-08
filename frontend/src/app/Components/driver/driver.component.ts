import {
  Component,
  OnDestroy,
  OnInit,
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
import { debounceTime } from 'rxjs/operators';
import { DeliveryService } from 'src/app/Services/delivery.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  loading = false;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  markers: any[] = [];
  mapZoom = 12;
  defaultPoint = { lat: 6.13365, lng: 1.22311 };
  mapCenter: google.maps.LatLng = new google.maps.LatLng(this.defaultPoint);
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

  packages: any;
  delivery: any;
  markerData: any[] = [];
  filterForm: FormGroup = new FormGroup({
    searchFilter: new FormControl<string>(''),
  });
  searchFilter: string = '';
  filterFormSubscription!: Subscription;
  intervalSubscription!: Subscription;

  constructor(
    private deliveryService: DeliveryService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.setCurrentLocation();
    this.intervalSubscription = interval(20000).subscribe(() => {
      this.setCurrentLocation();
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.setupFormListener();
  }

  ngOnDestroy(): void {
    if (this.filterFormSubscription) {
      this.filterFormSubscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  openInfoWindow(marker: MapMarker): void {
    this.infoWindow.open(marker);
  }

  addMarker(markerData: any[]): void {
    this.markers = markerData.map((marker, index) => ({
      position: marker.position,
      label: {
        color: marker.color,
        text: 'Marker label ' + (index + 1),
      },
      title: 'Marker title ' + (index + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
      icon: marker.icon || 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
    }));
  }

  onSubmit(): void {
    this.deliveryService.get(this.search?.value).subscribe({
      next: (res) => {
        this.packages = res?.package_id;
        this.delivery = res;

        const lat = parseFloat(this.delivery?.location?.lat);
        const lng = parseFloat(this.delivery?.location?.long);
        this.markerData = [
          {
            position: new google.maps.LatLng({ lat, lng }),
            color: 'blue',
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          },
        ];

        this.packages.forEach((packageData: any) => {
          const fromLat = Number(packageData?.from_location?.lat);
          const fromLng = Number(packageData?.from_location?.long);
          const toLat = Number(packageData.to_location?.lat);
          const toLng = Number(packageData?.to_location?.long);

          this.markerData.push({
            position: { lat: fromLat, lng: fromLng },
            color: 'red',
          });
          this.markerData.push({
            position: { lat: toLat, lng: toLng },
            color: 'red',
          });
        });
        this.addMarker(this.markerData);
        this.errorMessage = '';
        
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.markers = []; // Clear markers on error
        this.packages = null;
        this.delivery = null;
      },
    });
  }

  onPickedUp(id: string): void {
    this.updateStatus(id, "status_changed", {status:'picked-up', pickup_time: new Date() });
  }

  onInTransit(id: string): void {
    this.updateStatus(id, "status_changed",  { status:'in-transit',start_time: new Date() });
  }

  onDelivered(id: string): void {
    this.updateStatus(id, "status_changed",  {status:'delivered', end_time: new Date() });
  }

  onFailed(id: string): void {
    this.updateStatus(id, "status_changed", { status:'failed',start_time: new Date() });
  }

  private updateStatus(id: string, operation: string, additionalData: any): void {
    const data = {  ...additionalData };
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
        this.delivery = { ...this.delivery, ...data };
      },
    });
  }

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const point = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.defaultPoint = point;
          this.updateMarker(this.defaultPoint);
        },
        () => {
          this.updateMarker(this.defaultPoint);
        }
      );
    } else {
      this.updateMarker(this.defaultPoint);
    }
  }

  private updateMarker(point: { lat: number; lng: number }): void {
    this.markerData = [
      {
        position: new google.maps.LatLng(point),
        color: 'blue',
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      },
    ];
    this.addMarker(this.markerData);
    if (this.delivery?._id) {
      this.updateStatus(this.delivery._id, 'location_changed', {
        location: {
          lat: point.lat,
          long: point.lng,
        },
      });
    }
  }

  private setupFormListener(): void {
    this.filterFormSubscription = this.filterForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe((changes) => {
        this.searchFilter = changes.searchFilter;
        this.deliveryService.get(this.searchFilter).subscribe({
          next: (res) => {
            this.packages = res?.package_id;
            this.delivery = res;
          },
        });
      });
  }

  get search(): FormControl<string> {
    return this.filterForm.get('searchFilter') as FormControl<string>;
  }
}
