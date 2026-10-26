import { Stethoscope, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onScanClick: () => void;
  instrumentCount: number;
}

export function Header({ onScanClick, instrumentCount }: HeaderProps) {
  return (
    <header className="gradient-header text-primary-foreground shadow-lg">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2.5 rounded-xl">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                🩺 Tracksure
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">
                Real-Time Instrument Tracking
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-primary-foreground/70">Tracking</p>
              <p className="text-xl font-bold">{instrumentCount} Instruments</p>
            </div>
            <Button 
              onClick={onScanClick}
              variant="secondary"
              className="gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 shadow-button"
            >
              <ScanLine className="w-5 h-5" />
              Scan QR
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
