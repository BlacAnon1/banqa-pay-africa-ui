
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const SupportTickets = () => {
  const tickets = [
    { id: 'TKT001', subject: 'Payment not reflected', status: 'open', date: '2024-12-25', priority: 'high' },
    { id: 'TKT002', subject: 'Unable to add funds', status: 'resolved', date: '2024-12-23', priority: 'medium' },
    { id: 'TKT003', subject: 'Account verification', status: 'pending', date: '2024-12-20', priority: 'low' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>Track your support requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant={ticket.status === 'resolved' ? 'default' : 
                            ticket.status === 'open' ? 'destructive' : 'secondary'}
                  >
                    {ticket.status}
                  </Badge>
                  <Badge variant="outline">
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {ticket.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
