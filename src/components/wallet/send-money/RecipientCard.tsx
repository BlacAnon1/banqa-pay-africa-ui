
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  banqa_id: string;
}

interface RecipientCardProps {
  recipient: UserProfile;
}

export const RecipientCard = ({ recipient }: RecipientCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Sending to:</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{recipient.full_name}</p>
            <p className="text-sm text-muted-foreground">Banqa ID: {recipient.banqa_id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
