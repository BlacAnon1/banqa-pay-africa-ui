
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveChatWidget } from '@/components/support/LiveChatWidget';
import { SupportHeader } from '@/components/support/SupportHeader';
import { QuickContactCards } from '@/components/support/QuickContactCards';
import { SupportFAQ } from '@/components/support/SupportFAQ';
import { SupportTickets } from '@/components/support/SupportTickets';
import { SupportTabsContent } from '@/components/support/SupportTabsContent';

const Support = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartChat = () => setIsChatOpen(true);
  const handleToggleChat = () => setIsChatOpen(!isChatOpen);

  const tabsContent = SupportTabsContent({ onStartChat: handleStartChat });

  return (
    <div className="space-y-6">
      <SupportHeader />
      
      <QuickContactCards onStartChat={handleStartChat} />

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <SupportFAQ />
        </TabsContent>

        <TabsContent value="tickets">
          <SupportTickets />
        </TabsContent>

        <TabsContent value="chat">
          {tabsContent.chat}
        </TabsContent>

        <TabsContent value="phone">
          {tabsContent.phone}
        </TabsContent>

        <TabsContent value="email">
          {tabsContent.email}
        </TabsContent>
      </Tabs>

      <LiveChatWidget 
        isOpen={isChatOpen} 
        onToggle={handleToggleChat} 
      />
    </div>
  );
};

export default Support;
