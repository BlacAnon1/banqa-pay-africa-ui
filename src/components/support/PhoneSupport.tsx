
import { useState } from 'react';
import { Phone, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PhoneSupport = () => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');

  const supportNumbers = [
    {
      country: 'Nigeria',
      number: '+234 700 BANQA (22672)',
      local: '0700 22672',
      flag: '🇳🇬'
    },
    {
      country: 'Kenya',
      number: '+254 700 BANQA',
      local: '0700 BANQA',
      flag: '🇰🇪'
    },
    {
      country: 'Ghana',
      number: '+233 700 BANQA',
      local: '0700 BANQA',
      flag: '🇬🇭'
    }
  ];

  const handleCall = (number: string) => {
    setCallStatus('calling');
    // In a real app, this would integrate with WebRTC or redirect to phone app
    window.location.href = `tel:${number}`;
    
    setTimeout(() => {
      setCallStatus('idle');
    }, 3000);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: 'Africa/Lagos',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isBusinessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Monday to Friday, 8 AM to 8 PM WAT
    return day >= 1 && day <= 5 && hour >= 8 && hour < 20;
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isBusinessHours() ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <div>
                <p className="font-medium">
                  {isBusinessHours() ? 'We\'re Available Now' : 'Currently Closed'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current time: {getCurrentTime()} WAT
                </p>
              </div>
            </div>
            <Badge variant={isBusinessHours() ? 'default' : 'secondary'}>
              {isBusinessHours() ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Support Numbers */}
      <div className="space-y-3">
        {supportNumbers.map((support, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{support.flag}</span>
                  <div>
                    <h3 className="font-semibold">{support.country}</h3>
                    <p className="text-sm text-muted-foreground">{support.number}</p>
                    <p className="text-xs text-muted-foreground">Local: {support.local}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleCall(support.number)}
                  disabled={callStatus === 'calling'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {callStatus === 'calling' ? 'Calling...' : 'Call Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span className="font-medium">8:00 AM - 8:00 PM WAT</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span className="font-medium">10:00 AM - 4:00 PM WAT</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span className="text-muted-foreground">Closed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Queue Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Average Wait Time</p>
              <p className="text-sm text-muted-foreground">
                {isBusinessHours() ? '2-3 minutes' : 'Next business day'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
