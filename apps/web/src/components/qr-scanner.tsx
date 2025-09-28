"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Camera, RotateCcw, QrCode } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (bookingId: string) => void;
  onScanError: (error: string) => void;
  onRetry: () => void;
  error?: string | null;
}

export function QRScanner({
  onScanSuccess,
  onScanError,
  onRetry,
  error,
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);

  // Sử dụng ref để lưu callback, tránh infinite loop
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  // Cập nhật ref khi callback thay đổi
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
      // Tạo scanner với cấu hình tối ưu
      const scanner = new Html5QrcodeScanner(
        "reader", // ID của div container
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

      // Render scanner với callbacks
      scanner.render(
        (decodedText) => {
          console.log("QR Code detected:", decodedText);
          setScannedText(decodedText);
          const bookingId = decodedText.trim();
          if (bookingId) {
            onScanSuccessRef.current(bookingId);
          }
        },
        (error) => {
          // Chỉ log lỗi quan trọng, bỏ qua lỗi thường gặp
          if (
            error &&
            !error.includes("NotFoundException") &&
            !error.includes("No QR code found")
          ) {
            console.log("QR scan error:", error);
          }
        }
      );

      scannerRef.current = scanner;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Failed to initialize QR scanner:", err);
      onScanErrorRef.current(
        "Không thể khởi tạo camera. Vui lòng kiểm tra quyền truy cập camera."
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
    onRetry();
  };

  // Cleanup khi component unmount
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
            Quét mã QR từ renter để bắt đầu check-in
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
                      ? "Đang khởi tạo camera..."
                      : "Camera chưa được bật"}
                  </p>
                  <p className="text-gray-500">
                    Nhấn nút bên dưới để bắt đầu quét
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
                    Kết quả quét QR Code:
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
                disabled={isInitializing}
                size="lg"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Camera className="h-6 w-6" />
                {isInitializing ? "Đang khởi tạo..." : "Bắt đầu quét"}
              </Button>
            ) : (
              <Button
                onClick={stopCamera}
                variant="outline"
                size="lg"
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold border-2 border-red-300 text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Camera className="h-6 w-6" />
                Dừng quét
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-base">{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-4"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Built with ❤️ using html5-qrcode</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Scanning is done locally on your device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
