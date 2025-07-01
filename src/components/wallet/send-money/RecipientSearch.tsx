
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  banqa_id: string;
}

interface RecipientSearchProps {
  onRecipientFound: (recipient: UserProfile) => void;
}

export const RecipientSearch = ({ onRecipientFound }: RecipientSearchProps) => {
  const { user } = useAuth();
  const [banqaId, setBanqaId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const searchUserByBanqaId = async () => {
    if (!banqaId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a Banqa ID",
        variant: "destructive"
      });
      return;
    }

    setSearchLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, banqa_id')
      .eq('banqa_id', banqaId.toUpperCase())
      .neq('id', user?.id)
      .single();

    if (error || !data) {
      toast({
        title: "User Not Found",
        description: "No user found with this Banqa ID",
        variant: "destructive"
      });
    } else {
      onRecipientFound(data);
    }
    setSearchLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="banqaId">Enter Recipient's Banqa ID</Label>
        <div className="flex gap-2">
          <Input
            id="banqaId"
            placeholder="e.g., BQ12345678"
            value={banqaId}
            onChange={(e) => setBanqaId(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && searchUserByBanqaId()}
          />
          <Button onClick={searchUserByBanqaId} disabled={searchLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Ask the recipient for their Banqa ID to send money
        </p>
      </div>
    </div>
  );
};
