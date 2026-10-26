import { Instrument, InstrumentStatus, InstrumentLocation } from '@/types/instrument';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Clock } from 'lucide-react';

interface InstrumentCardProps {
  instrument: Instrument;
  onClick?: () => void;
}

const statusStyles: Record<InstrumentStatus, string> = {
  'Available': 'status-available',
  'In Use': 'status-in-use',
  'Dirty': 'status-dirty',
  'Sterilized': 'status-sterilized',
};

const locationIcons: Record<InstrumentLocation, string> = {
  'OT': '🏥',
  'CSSD': '🧪',
  'Store Room': '📦',
};

export function InstrumentCard({ instrument, onClick }: InstrumentCardProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div 
      className="group bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden border border-border/50 animate-fade-in"
      onClick={onClick}
    >
      {/* Header with gradient accent */}
      <div className="h-1 gradient-header" />
      
      <div className="p-5">
        {/* Top section with name and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-foreground text-lg truncate group-hover:text-primary transition-colors">
              {instrument.name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              {instrument.id}
            </p>
          </div>
          <Badge className={`${statusStyles[instrument.status]} shrink-0 font-medium`}>
            {instrument.status}
          </Badge>
        </div>

        {/* QR Code */}
        <div className="flex justify-center my-4 p-3 bg-secondary/30 rounded-lg">
          <QRCodeDisplay instrumentId={instrument.id} size={100} />
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="mr-1">{locationIcons[instrument.location]}</span>
            <span className="font-medium text-foreground">{instrument.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span className="truncate">{instrument.lastUpdatedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(instrument.lastUpdatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
