import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Battery, Gauge } from "lucide-react";
import { BookingVehicleDetails } from "@/packages/types/booking";

interface BookingVehicleInfoProps {
  vehicle: BookingVehicleDetails;
}

export function BookingVehicleInfo({ vehicle }: BookingVehicleInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">
            {vehicle.brand} {vehicle.model}
          </p>
          <p className="text-sm text-muted-foreground">
            License plate: {vehicle.licensePlate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Battery className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Battery</p>
            <p className="text-sm text-muted-foreground">
              {vehicle.batteryLevel}% ({vehicle.batteryCapacity}Wh)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Gauge className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">Mileage</p>
            <p className="text-sm text-muted-foreground">
              {vehicle.mileage.toLocaleString()} km
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
