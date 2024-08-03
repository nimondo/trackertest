import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { DeliveryService } from 'src/app/Services/delivery.service';
import { PackageService } from 'src/app/Services/package.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  packages!: any;
  deliveries!: any;
  pageSize!: number;
  totalItems!: number;
  pageSizeDelivery!: number;
  totalItemsDelivery!: number;
  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService
  ) {
    this.getAllPackages();
    this.getAllDeliveries();
  }

  getAllPackages() {
    this.packageService.getAll().subscribe((response: any) => {
      this.totalItems = response.data.totalPackages;
      this.pageSize = response.data.rowsPerPage;
      this.packages = response.data.data;
    });
  }
  getAllDeliveries() {
    this.deliveryService.getAll().subscribe((response: any) => {
      this.totalItemsDelivery = response.data.totalPackages;
      this.pageSizeDelivery = response.data.rowsPerPage;
      this.deliveries = response.data.data;
    });
  }
  onPageChanged(event: PageEvent) {
    this.packageService.getAll(event.pageIndex).subscribe({
      next: (res) => {
        this.totalItems = res.data.totalPackages;
        this.pageSize = res.data.rowsPerPage;
        this.packages = res.data.data;
      },
    });
  }
  onPageChangedDelivery(event: PageEvent) {
    this.deliveryService.getAll(event.pageIndex).subscribe({
      next: (res) => {
        this.totalItemsDelivery = res.data.totalPackages;
        this.pageSizeDelivery = res.data.rowsPerPage;
        this.deliveries = res.data.data;
      },
    });
  }
}
