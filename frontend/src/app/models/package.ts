import { Location } from './location';

export class Package {
  _id: string;
  // user: User
  active_delivery_id: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_address: string;
  from_location: Location;
  to_name: string;
  to_location: Location;
  to_address: string;

  constructor() {
    this._id = '';
    this.active_delivery_id = '';
    this.description = '';
    this.width = 0;
    this.height = 0;
    this.depth = 0;
    this.from_name = '';
    this.from_address = '';
    this.from_location = new Location();
    this.to_name = '';
    this.to_location = new Location();
    this.to_address = '';
  }
}
