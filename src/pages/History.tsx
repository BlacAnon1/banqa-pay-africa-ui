
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download } from 'lucide-react';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const transactions = [
    { id: 'TXN001', service: 'Electricity', provider: 'Ikeja Electric', amount: '₦15,500', date: '2024-12-25', status: 'completed', reference: 'IKE123456789' },
    { id: 'TXN002', service: 'Airtime', provider: 'MTN', amount: '₦2,000', date: '2024-12-24', status: 'completed', reference: 'MTN987654321' },
    { id: 'TXN003', service: 'DSTV', provider: 'DSTV', amount: '₦8,500', date: '2024-12-23', status: 'completed', reference: 'DST456789123' },
    { id: 'TXN004', service: 'Internet', provider: 'Spectranet', amount: '₦12,000', date: '2024-12-22', status: 'failed', reference: 'SPE789123456' },
    { id: 'TXN005', service: 'Water', provider: 'Lagos Water', amount: '₦3,200', date: '2024-12-21', status: 'completed', reference: 'LWC321654987' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground">View and manage your payment history</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service, provider, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{transaction.service}</h3>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 
                                   transaction.status === 'failed' ? 'destructive' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.provider}</p>
                    <p className="text-xs text-muted-foreground">Ref: {transaction.reference}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-lg">{transaction.amount}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    <p className="text-xs text-muted-foreground">ID: {transaction.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
