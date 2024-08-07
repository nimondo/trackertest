// src/app/Utils/validators.ts

import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

export function validateCoordinates(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const coords = value.split(',');
  if (coords.length !== 2) return { invalidFormat: true };

  const lat = parseFloat(coords[0]);
  const long = parseFloat(coords[1]);

  if (isNaN(lat) || isNaN(long)) return { invalidNumber: true };
  if (lat < -90 || lat > 90) return { invalidLatitude: true };
  if (long < -180 || long > 180) return { invalidLongitude: true };

  return null;
}
