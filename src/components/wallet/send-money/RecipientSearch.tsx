
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
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
  const [searchAttempts, setSearchAttempts] = useState(0);

  const validateBanqaId = (id: string): boolean => {
    const banqaIdRegex = /^BQ\d{8}$/;
    return banqaIdRegex.test(id.toUpperCase());
  };

  const searchUserByBanqaId = async () => {
    const cleanBanqaId = banqaId.trim().toUpperCase();
    
    if (!cleanBanqaId) {
      toast({
        title: "Invalid Input",
        description: "Please enter a Banqa ID",
        variant: "destructive"
      });
      return;
    }

    if (!validateBanqaId(cleanBanqaId)) {
      toast({
        title: "Invalid Banqa ID Format",
        description: "Banqa ID should be in format BQ12345678",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting
    if (searchAttempts >= 5) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait a moment before searching again",
        variant: "destructive"
      });
      return;
    }

    setSearchLoading(true);
    setSearchAttempts(prev => prev + 1);
    
    console.log('Searching for user with Banqa ID:', cleanBanqaId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, banqa_id')
        .eq('banqa_id', cleanBanqaId)
        .neq('id', user?.id)
        .single();

      if (error) {
        console.error('Search error:', error);
        if (error.code === 'PGRST116') {
          toast({
            title: "User Not Found",
            description: "No user found with this Banqa ID. Please check and try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Search Error",
            description: "Unable to search for user. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      if (!data) {
        toast({
          title: "User Not Found",
          description: "No user found with this Banqa ID",
          variant: "destructive"
        });
        return;
      }

      console.log('User found:', data);
      toast({
        title: "User Found",
        description: `Found ${data.full_name}`,
        duration: 3000,
      });
      
      onRecipientFound(data);
      
    } catch (error) {
      console.error('Unexpected search error:', error);
      toast({
        title: "Search Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      searchUserByBanqaId();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="banqaId" className="text-sm font-medium">
          Enter Recipient's Banqa ID
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="banqaId"
            placeholder="e.g., BQ12345678"
            value={banqaId}
            onChange={(e) => setBanqaId(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            disabled={searchLoading}
            className="flex-1"
            maxLength={10}
          />
          <Button 
            onClick={searchUserByBanqaId} 
            disabled={searchLoading || !banqaId.trim()}
            size="default"
          >
            {searchLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground">
            Ask the recipient for their unique Banqa ID to send money
          </p>
          <p className="text-xs text-muted-foreground">
            Format: BQ followed by 8 digits (e.g., BQ12345678)
          </p>
        </div>
      </div>
    </div>
  );
};
