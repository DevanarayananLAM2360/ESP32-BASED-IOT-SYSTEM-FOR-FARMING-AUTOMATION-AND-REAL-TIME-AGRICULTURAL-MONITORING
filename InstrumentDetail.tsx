import { useState } from 'react';
import { Instrument, InstrumentStatus, InstrumentLocation, StatusUpdate } from '@/types/instrument';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  User, 
  Clock, 
  ArrowLeft, 
  Activity, 
  Sparkles, 
  Send,
  AlertCircle
} from 'lucide-react';

interface InstrumentDetailProps {
  instrument: Instrument | null;
  onBack: () => void;
  onUpdateStatus: (id: string, update: StatusUpdate, staffName: string) => void;
  notFound?: boolean;
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

const locations: InstrumentLocation[] = ['OT', 'CSSD', 'Store Room'];

export function InstrumentDetail({ instrument, onBack, onUpdateStatus, notFound }: InstrumentDetailProps) {
  const [selectedLocation, setSelectedLocation] = useState<InstrumentLocation>(
    instrument?.location || 'OT'
  );

  const handleAction = (status: InstrumentStatus, actionName: string) => {
    const staffName = prompt(`Enter your name to ${actionName}:`);
    if (staffName && staffName.trim() && instrument) {
      onUpdateStatus(instrument.id, { status, location: selectedLocation }, staffName.trim());
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Instrument Not Found</h2>
        <p className="text-muted-foreground text-center mb-6">
          The instrument you're looking for doesn't exist in our system.
        </p>
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to All Instruments
        </Button>
      </div>
    );
  }

  if (!instrument) return null;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Back button */}
      <Button 
        onClick={onBack} 
        variant="ghost" 
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Instruments
      </Button>

      {/* Main card */}
      <div className="bg-card rounded-xl shadow-card-hover border border-border/50 overflow-hidden">
        {/* Header gradient */}
        <div className="h-2 gradient-header" />
        
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {instrument.name}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground font-mono">
                {instrument.id}
              </p>
            </div>
            <Badge className={`${statusStyles[instrument.status]} text-base px-4 py-1.5`}>
              {instrument.status}
            </Badge>
          </div>

          {/* QR Code - Centered */}
          <div className="flex justify-center my-8">
            <div className="p-4 bg-secondary/30 rounded-xl">
              <QRCodeDisplay instrumentId={instrument.id} size={180} />
            </div>
          </div>

          {/* Details grid */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {locationIcons[instrument.location]} {instrument.location}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Updated By</span>
              </div>
              <p className="text-lg font-semibold text-foreground truncate">
                {instrument.lastUpdatedBy}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Last Update</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatDateTime(instrument.lastUpdatedAt)}
              </p>
            </div>
          </div>

          {/* Location selector */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Select New Location
            </h3>
            <Select value={selectedLocation} onValueChange={(val) => setSelectedLocation(val as InstrumentLocation)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {locationIcons[loc]} {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Update Status
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                onClick={() => handleAction('In Use', 'mark as In Use')}
                className="bg-status-in-use hover:bg-status-in-use/90 text-primary-foreground gap-2 h-12"
                disabled={instrument.status === 'In Use'}
              >
                <Activity className="w-5 h-5" />
                Mark as In Use
              </Button>
              <Button
                onClick={() => handleAction('Dirty', 'mark as Dirty')}
                className="bg-status-dirty hover:bg-status-dirty/90 text-primary-foreground gap-2 h-12"
                disabled={instrument.status === 'Dirty'}
              >
                <Send className="w-5 h-5" />
                Mark as Dirty
              </Button>
              <Button
                onClick={() => handleAction('Sterilized', 'mark as Sterilized')}
                className="bg-status-sterilized hover:bg-status-sterilized/90 text-primary-foreground gap-2 h-12"
                disabled={instrument.status === 'Sterilized'}
              >
                <Sparkles className="w-5 h-5" />
                Mark Sterilized
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
