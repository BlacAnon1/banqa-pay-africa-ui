
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface VirtualCard {
  id: string;
  cardName: string;
  maskedNumber: string;
  expiryMonth: number;
  expiryYear: number;
  balance: number;
  spendingLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  isActive: boolean;
  autoTopupEnabled: boolean;
  autoTopupThreshold: number;
  autoTopupAmount: number;
}

export const useVirtualCards = () => {
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedCards = data?.map(card => ({
        id: card.id,
        cardName: card.card_name,
        maskedNumber: card.masked_card_number,
        expiryMonth: card.expiry_month,
        expiryYear: card.expiry_year,
        balance: card.balance,
        spendingLimit: card.spending_limit,
        dailyLimit: card.daily_limit,
        monthlyLimit: card.monthly_limit,
        isActive: card.is_active,
        autoTopupEnabled: card.auto_topup_enabled,
        autoTopupThreshold: card.auto_topup_threshold,
        autoTopupAmount: card.auto_topup_amount
      })) || [];

      setCards(processedCards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (cardName: string) => {
    if (!user) return;

    try {
      // Generate card details (in production, this would use a secure card provider API)
      const cardNumber = generateCardNumber();
      const cvv = generateCVV();
      
      const { data, error } = await supabase
        .from('virtual_cards')
        .insert({
          user_id: user.id,
          card_name: cardName,
          card_number_encrypted: await encryptCardNumber(cardNumber),
          masked_card_number: `**** **** **** ${cardNumber.slice(-4)}`,
          expiry_month: new Date().getMonth() + 1,
          expiry_year: new Date().getFullYear() + 5,
          cvv_encrypted: await encryptCVV(cvv),
          balance: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Card Created",
        description: `${cardName} has been created successfully`
      });

      fetchCards();
    } catch (error) {
      console.error('Error creating card:', error);
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "destructive"
      });
    }
  };

  const topUpCard = async (cardId: string, amount: number) => {
    if (!user) return;

    try {
      // In production, this would integrate with wallet balance
      const { error } = await supabase
        .from('virtual_cards')
        .update({ 
          balance: amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', cardId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Card Topped Up",
        description: `₦${amount.toLocaleString()} added to your card`
      });

      fetchCards();
    } catch (error) {
      console.error('Error topping up card:', error);
      toast({
        title: "Error",
        description: "Failed to top up card",
        variant: "destructive"
      });
    }
  };

  const generateCardNumber = (): string => {
    // Generate a mock card number starting with 5399 (BanqaCard prefix)
    return '5399' + Math.random().toString().slice(2, 14);
  };

  const generateCVV = (): string => {
    return Math.floor(Math.random() * 900 + 100).toString();
  };

  const encryptCardNumber = async (cardNumber: string): Promise<string> => {
    // In production, use proper encryption
    return btoa(cardNumber);
  };

  const encryptCVV = async (cvv: string): Promise<string> => {
    // In production, use proper encryption
    return btoa(cvv);
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  return { cards, loading, createCard, topUpCard, refetch: fetchCards };
};
