import { Location } from './location';

// enum State {
//   open = 'open',
//   pickedUp = 'picked-up',
//   inTransit = 'in-transit',
//   delivered = 'delivered',
//   failed = 'failed',
// }
export class Delivery {
  _id: string;
  // user: string;
  package_id: Array<string>;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: Location;
  status: string;

  constructor() {
    this._id = '';
    // user: string;
    this.package_id = [];
    this.pickup_time = new Date();
    this.start_time = new Date();
    this.end_time = new Date();
    this.location = new Location();
    this.status = '';
  }
}
