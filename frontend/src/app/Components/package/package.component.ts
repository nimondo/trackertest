import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorsStateMatcher } from 'src/app/Error-state-matcher';
import { AuthService } from 'src/app/Services/auth.service';
import { PackageService } from 'src/app/Services/package.service';
import {
  validateCoordinates,
} from 'src/app/utils/validators'; // Import the new validator
import { v4 as uuid4 } from 'uuid';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
})
export class PackageComponent {
  userId: any = "";
  constructor(
    private packageService: PackageService,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
   
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  //Declaration
  // check the form is submitted or not yet
  isSubmited: boolean = false;
  // hide attribute for the password input
  hide: boolean = true;

  //form group
  form: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    width: new FormControl('', [Validators.required]),
    depth: new FormControl('', [Validators.required]),
    from_name: new FormControl('', [Validators.required]),
    from_address: new FormControl('', [Validators.required]),
    from_location: new FormControl('', [
      Validators.required,
      validateCoordinates,
    ]),
    to_name: new FormControl('', [Validators.required]),
    to_address: new FormControl('', [Validators.required]),
    to_location: new FormControl('', [
      Validators.required,
      validateCoordinates,
    ]),
  });

  //get all Form Fields
  get description() {
    return this.form.get('description');
  }
  get weight() {
    return this.form.get('weight');
  }
  get height() {
    return this.form.get('height');
  }
  get width() {
    return this.form.get('width');
  }
  get depth() {
    return this.form.get('depth');
  }

  get from_name() {
    return this.form.get('from_name');
  }
  get from_address() {
    return this.form.get('from_address');
  }
  get from_location() {
    return this.form.get('from_location');
  }

  get to_name() {
    return this.form.get('to_name');
  }
  get to_address() {
    return this.form.get('to_address');
  }
  get to_location() {
    return this.form.get('to_location');
  }

  // match errors in the submition of form
  matcher = new ErrorsStateMatcher();

  // submit fntc
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.isSubmited = true;
    if (!this.form.invalid) {
      const packageData = {
        _id: uuid4(),
        // active_delivery_id: (string guid)
        description: this.description?.value,
        weight: parseInt(this.weight?.value),
        width: parseInt(this.width?.value),
        height: parseInt(this.height?.value),
        depth: parseInt(this.depth?.value),
        from_name: this.from_name?.value,
        from_address: this.from_address?.value,
        from_location: {
          lat: parseFloat(this.from_location?.value.split(',')[0]),
          long: parseFloat(this.from_location?.value.split(',')[1]),
        },
        to_name: this.to_name?.value,
        to_address: this.to_address?.value,
        to_location: {
          lat: parseFloat(this.to_location?.value.split(',')[0]),
          long: parseFloat(this.to_location?.value.split(',')[1]),
        },
        customer_id: this.userId,
      };
      console.log('package', packageData);
      this.packageService.Create(packageData).subscribe(() => {
        this._snackBar.open('Your package has been created successfully', '✔️');
        setTimeout(() => (window.location.href = '/admin'), 2000);
      });
    } else {
      console.log(this.form);
      this._snackBar.open('Enter a valid informations !!!', '❌');
    }
  }
}
