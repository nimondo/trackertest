import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Socket } from 'ngx-socket-io';
import { ErrorsStateMatcher } from 'src/app/Error-state-matcher';
import { AuthService } from 'src/app/Services/auth.service';
import { DeliveryService } from 'src/app/Services/delivery.service';
import { PackageService } from 'src/app/Services/package.service';
import {
  validateCoordinates,
} from 'src/app/utils/validators'; // Import the new validator
import { v4 as uuid4 } from 'uuid';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent {
  packages!: any;
  userId: any = "";
  constructor(
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private _snackBar: MatSnackBar,
    private socket: Socket,
    private authService: AuthService
  ) {}

  getAllPackages() {
    this.packageService.getAll().subscribe((response: any) => {
      this.packages = response.data.data;
      console.log(this.packages);
    });
  }
  ngOnInit(): void {
    this.getAllPackages();
    this.userId = this.authService.getUserId();
  }

  //Declaration
  // check the form is submitted or not yet
  isSubmited: boolean = false;
  // hide attribute for the password input
  hide: boolean = true;

  //form group
  form: FormGroup = new FormGroup({
    package_id: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required, validateCoordinates]), // Use the validator here
    // status: new FormControl('', [Validators.required]),
  });

  //get all Form Fields
  get package_id() {
    return this.form.get('package_id');
  }
  get location() {
    return this.form.get('location');
  }
  // get status() {
  //   return this.form.get('status');
  // }
  // match errors in the submition of form
  matcher = new ErrorsStateMatcher();

  // submit fntc
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.isSubmited = true;
    if (!this.form.invalid) {
      const deliveryData = {
        _id: uuid4(),
        package_id: this.package_id?.value,
        userId: this.userId,
        location: {
          lat: parseFloat(this.location?.value.split(',')[0]),
          long: parseFloat(this.location?.value.split(',')[1]),
        },
        status: 'open',
      };
      console.log('data', deliveryData);
      this.deliveryService.Create(deliveryData).subscribe((delivery) => {
        console.log('delivery', delivery);
        this.socket.emit('addDelivery', {
          id: deliveryData._id,
          data: delivery,
        });
        for (const package_id of deliveryData.package_id) {
          console.log('delivery id', package_id, deliveryData._id);
          this.packageService
            .Update(package_id, { active_delivery_id: deliveryData._id })
            .subscribe(() => {
              this._snackBar.open(
                'Your delivery has been created successfully',
                '✔️'
              );
              setTimeout(() => (window.location.href = '/admin'), 2000);
            });
        }
      });
      // setTimeout(() => {
      //   window.location.href = '/admin';
      //   this._snackBar.open(
      //     'Your delivery has been created successfully',
      //     '✔️'
      //   );
      // }, 2000);
    } else {
      console.log(this.form);
      this._snackBar.open('Enter valid information !!!', '❌');
    }
  }
}
