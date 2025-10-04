export interface RentalLocation {
  locationId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  contactNumber: string;
  openingHours: string;
  closingHours: string;
  latitude?: number;
  longitude?: number;
}
