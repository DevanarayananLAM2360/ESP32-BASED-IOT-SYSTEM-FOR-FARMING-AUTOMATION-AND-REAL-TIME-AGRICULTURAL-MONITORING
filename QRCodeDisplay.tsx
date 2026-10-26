import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  instrumentId: string;
  size?: number;
}

export function QRCodeDisplay({ instrumentId, size = 120 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;
      
      try {
        const baseUrl = window.location.origin + window.location.pathname;
        const qrUrl = `${baseUrl}?id=${instrumentId}`;
        
        await QRCode.toCanvas(canvasRef.current, qrUrl, {
          width: size,
          margin: 2,
          color: {
            dark: '#0a5c7a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setError(false);
      } catch (err) {
        console.error('QR generation error:', err);
        setError(true);
      }
    };

    generateQR();
  }, [instrumentId, size]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded-md"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground">QR Error</span>
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="rounded-md shadow-sm"
    />
  );
}
