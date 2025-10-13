"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingQRCodeProps {
  bookingId: string;
}

export function BookingQRCode({ bookingId }: BookingQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create QR code data - only booking ID
  const qrData = bookingId;

  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      }
    };

    generateQRCode();
  }, [qrData]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `booking-${bookingId}-qr.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const shareQRCode = async () => {
    if (canvasRef.current && navigator.share) {
      try {
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.share({
              title: `QR Code Booking ${bookingId}`,
              text: `QR Code to check-in for booking ${bookingId}`,
              files: [
                new File([blob], `booking-${bookingId}-qr.png`, {
                  type: "image/png",
                }),
              ],
            });
          }
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        // Fallback: copy to clipboard if sharing fails
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      alert("QR Code data has been copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Check-in
        </CardTitle>
        <Badge variant="outline" className="w-fit mx-auto">
          Booking #{bookingId}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* QR Code Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border rounded-lg w-[200px] h-[200px]"
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">📱 How to use:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Go to the rental station at the booked address</li>
            <li>• Open this QR code on your phone</li>
            <li>• Scan the QR code at the counter to check-in</li>
            <li>• Receive your vehicle and start your trip</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={downloadQRCode} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={shareQRCode} variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Additional information */}
        <div className="text-xs text-muted-foreground text-center">
          <p>This QR code contains your booking information</p>
          <p>Keep it secret and use it only when needed</p>
        </div>
      </CardContent>
    </Card>
  );
}
