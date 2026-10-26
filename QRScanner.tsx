import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { X, Camera, Loader2 } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (instrumentId: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      setIsStarting(true);
      setError(null);

      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            // Extract instrument ID from URL
            const url = new URL(decodedText);
            const id = url.searchParams.get('id');
            if (id) {
              onScan(id);
              handleClose();
            }
          },
          () => {
            // Ignore errors during scanning
          }
        );
      } catch (err) {
        console.error('Scanner error:', err);
        setError('Unable to access camera. Please ensure camera permissions are granted.');
      } finally {
        setIsStarting(false);
      }
    };

    startScanner();

    return () => {
      handleClose();
    };
  }, [isOpen]);

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Scan QR Code</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {isStarting && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p>Starting camera...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-6 max-w-md">
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-4">
              {error}
            </div>
            <Button onClick={handleClose} variant="outline">
              Close Scanner
            </Button>
          </div>
        )}

        <div 
          ref={containerRef}
          id="qr-reader" 
          className="w-full max-w-sm rounded-xl overflow-hidden"
          style={{ display: error ? 'none' : 'block' }}
        />

        {!isStarting && !error && (
          <p className="mt-6 text-muted-foreground text-center max-w-xs">
            Point your camera at an instrument's QR code to view its details
          </p>
        )}
      </div>
    </div>
  );
}
