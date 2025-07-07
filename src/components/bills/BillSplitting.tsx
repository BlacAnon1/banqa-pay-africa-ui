
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Trash2, Send, Calculator, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  contact: string; // email or phone
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

interface BillShare {
  id: string;
  title: string;
  totalAmount: number;
  participants: Participant[];
  createdAt: Date;
  dueDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export const BillSplitting: React.FC = () => {
  const [billShares, setBillShares] = useState<BillShare[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBill, setNewBill] = useState({
    title: '',
    amount: 0,
    description: '',
    dueDate: ''
  });
  const [participants, setParticipants] = useState<Omit<Participant, 'id' | 'status'>[]>([]);

  const addParticipant = () => {
    setParticipants([...participants, { name: '', contact: '', amount: 0 }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: keyof Omit<Participant, 'id' | 'status'>, value: string | number) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const distributeEqually = () => {
    if (participants.length === 0 || newBill.amount === 0) return;
    
    const amountPerPerson = newBill.amount / participants.length;
    const updated = participants.map(p => ({ ...p, amount: amountPerPerson }));
    setParticipants(updated);
  };

  const getTotalAssigned = () => {
    return participants.reduce((sum, p) => sum + p.amount, 0);
  };

  const createBillShare = () => {
    if (!newBill.title || newBill.amount <= 0 || participants.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields and add participants",
        variant: "destructive"
      });
      return;
    }

    if (Math.abs(getTotalAssigned() - newBill.amount) > 0.01) {
      toast({
        title: "Amount Mismatch",
        description: "Total assigned amount must equal the bill amount",
        variant: "destructive"
      });
      return;
    }

    const billShare: BillShare = {
      id: Date.now().toString(),
      title: newBill.title,
      totalAmount: newBill.amount,
      participants: participants.map((p, i) => ({
        ...p,
        id: `participant-${i}`,
        status: 'pending' as const
      })),
      createdAt: new Date(),
      dueDate: newBill.dueDate ? new Date(newBill.dueDate) : undefined,
      status: 'active'
    };

    setBillShares([billShare, ...billShares]);
    setIsCreating(false);
    setNewBill({ title: '', amount: 0, description: '', dueDate: '' });
    setParticipants([]);

    toast({
      title: "Bill Share Created",
      description: "Invitations will be sent to all participants"
    });
  };

  const sendReminders = (billId: string) => {
    toast({
      title: "Reminders Sent",
      description: "Payment reminders sent to all pending participants"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bill Splitting</h2>
          <p className="text-muted-foreground">Share bills with friends and family</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Split New Bill
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Bill Share</CardTitle>
            <CardDescription>
              Split a bill among multiple people and track payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bill Title</label>
                <Input
                  value={newBill.title}
                  onChange={(e) => setNewBill({...newBill, title: e.target.value})}
                  placeholder="e.g., Apartment Electricity Bill"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Amount (₦)</label>
                <Input
                  type="number"
                  value={newBill.amount || ''}
                  onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
                  placeholder="Enter total amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Textarea
                value={newBill.description}
                onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                placeholder="Additional details about the bill"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
              <Input
                type="date"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Participants</label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={distributeEqually}>
                    <Calculator className="h-4 w-4 mr-1" />
                    Split Equally
                  </Button>
                  <Button size="sm" onClick={addParticipant}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Person
                  </Button>
                </div>
              </div>

              {participants.map((participant, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg">
                  <div className="col-span-4">
                    <Input
                      placeholder="Name"
                      value={participant.name}
                      onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      placeholder="Email or Phone"
                      value={participant.contact}
                      onChange={(e) => updateParticipant(index, 'contact', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={participant.amount || ''}
                      onChange={(e) => updateParticipant(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeParticipant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {participants.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No participants added yet</p>
                  <Button onClick={addParticipant} className="mt-2">
                    Add First Participant
                  </Button>
                </div>
              )}

              {participants.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    Total Assigned: ₦{getTotalAssigned().toLocaleString()}
                  </span>
                  <span className="text-sm">
                    Remaining: ₦{(newBill.amount - getTotalAssigned()).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={createBillShare} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Create & Send Invites
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {billShares.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bill Shares Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first bill share to split costs with others.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Split Your First Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          billShares.map((billShare) => (
            <Card key={billShare.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{billShare.title}</CardTitle>
                    <CardDescription>
                      ₦{billShare.totalAmount.toLocaleString()} • {billShare.participants.length} participants
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={billShare.status === 'active' ? 'default' : 'secondary'}>
                      {billShare.status}
                    </Badge>
                    {billShare.dueDate && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Due {billShare.dueDate.toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {billShare.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{participant.name}</span>
                        <span className="text-sm text-gray-600 ml-2">{participant.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₦{participant.amount.toLocaleString()}</span>
                        <Badge 
                          variant={
                            participant.status === 'paid' ? 'default' :
                            participant.status === 'overdue' ? 'destructive' : 'secondary'
                          }
                        >
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendReminders(billShare.id)}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Payment Reminders
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
