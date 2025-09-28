import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { RentalLocation } from "@packages";

interface BookingLocationInfoProps {
  rentalLocation: RentalLocation;
}

export function BookingLocationInfo({
  rentalLocation,
}: BookingLocationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Địa điểm thuê xe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium">{rentalLocation.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {rentalLocation.address}, {rentalLocation.city},{" "}
            {rentalLocation.country}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{rentalLocation.contactNumber}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{rentalLocation.openingHours}</span>
          </div>
          <Button variant="outline" size="sm" className="mt-3">
            <Navigation className="h-4 w-4 mr-2" />
            Chỉ đường
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
