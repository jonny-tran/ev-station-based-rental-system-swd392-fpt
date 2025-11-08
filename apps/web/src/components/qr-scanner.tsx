"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Camera, RotateCcw, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQRCodeValidation, setRouter } from "@/stores/checkin-session.store";

interface QRScannerProps {
  onScanSuccess?: (bookingId: string) => void;
  onScanError?: (error: string) => void;
  onRetry?: () => void;
  error?: string | null;
}

export function QRScanner({
  onScanSuccess,
  onScanError,
  onRetry,
  error,
}: QRScannerProps) {
  const router = useRouter();
  const {
    validatedBooking,
    isValidationLoading,
    validationError,
    validateQRCode,
    clearValidation,
  } = useQRCodeValidation();

  // Set router in store for navigation
  useEffect(() => {
    setRouter(router);
  }, [router]);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);

  // Use ref to store callback, avoiding infinite loop
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  // Update ref when callback changes
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    onScanErrorRef.current = onScanError;
  }, [onScanError]);

  const startCamera = async () => {
    if (isCameraActive || isInitializing) return;

    setIsInitializing(true);
    setScannedText(null);

    try {
      // Create scanner with optimized configuration
      const scanner = new Html5QrcodeScanner(
        "reader", // ID of div container
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          useBarCodeDetectorIfSupported: true,
          rememberLastUsedCamera: true,
        },
        false // verbose = false
      );

      // Render scanner with callbacks
      scanner.render(
        async (decodedText) => {
          setScannedText(decodedText);
          const bookingId = decodedText.trim();

          if (bookingId) {
            try {
              // Stop camera first
              stopCamera();

              // Validate QR code using store
              await validateQRCode(bookingId);

              // Call optional callback if provided
              onScanSuccessRef.current?.(bookingId);

              // The store will handle session creation automatically after validation
              // and navigate to the correct step1 page with inspectionId
              // No need to navigate here as the store will handle it
            } catch (error) {
              onScanErrorRef.current?.(
                error instanceof Error ? error.message : "Validation failed"
              );
            }
          }
        },
        (error) => {
          // Ignore common scan errors
        }
      );

      scannerRef.current = scanner;
      setIsCameraActive(true);
    } catch (err) {
      onScanErrorRef.current?.(
        "Unable to initialize camera. Please check camera access permissions."
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsCameraActive(false);
    setScannedText(null);
  };

  const handleRetry = () => {
    stopCamera();
    clearValidation();
    onRetry?.();
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-bold text-white">QR Code Scanner</h2>
          </div>
          <p className="text-blue-100 mt-2">
            Scan QR code from renter to start check-in
          </p>
        </div>

        {/* Scanner Area */}
        <div className="p-8">
          <div className="relative">
            <div
              id="reader"
              className="w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-300 min-h-[400px] flex items-center justify-center bg-gray-50"
            />
            {!isCameraActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center rounded-xl">
                <div className="bg-white rounded-full p-6 shadow-lg mb-6 border-4 border-blue-200">
                  <Camera className="h-16 w-16 text-blue-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl text-gray-700 font-semibold">
                    {isInitializing
                      ? "Initializing camera..."
                      : "Camera is not active"}
                  </p>
                  <p className="text-gray-500">
                    Press the button below to start scanning
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Scan Result */}
          {scannedText && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <QrCode className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    QR Code scan result:
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {scannedText}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            {!isCameraActive ? (
              <Button
                onClick={startCamera}
                disabled={isInitializing || isValidationLoading}
                size="lg"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Camera className="h-6 w-6" />
                {isInitializing
                  ? "Initializing..."
                  : isValidationLoading
                    ? "Validating..."
                    : "Start scanning"}
              </Button>
            ) : (
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                disabled={isValidationLoading}
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold border-2 border-red-300 text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Camera className="h-6 w-6" />
                Stop scanning
              </Button>
            )}
          </div>

          {/* Error Message */}
          {(error || validationError) && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-base">{error || validationError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-4"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Success Message */}
          {validatedBooking && (
            <Alert className="mt-6 border-green-200 bg-green-50">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="font-semibold mb-2">
                  QR Code validated successfully!
                </div>
                <div className="text-sm">
                  <div>Booking ID: {validatedBooking.booking.bookingId}</div>
                  <div>Renter: {validatedBooking.renter.fullName}</div>
                  <div>
                    Vehicle: {validatedBooking.vehicle.brand}{" "}
                    {validatedBooking.vehicle.model}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
