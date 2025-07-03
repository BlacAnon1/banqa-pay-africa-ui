
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import KYCOnboarding from '@/components/profile/KYCOnboarding';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
import DocumentUpload from '@/components/kyc/DocumentUpload';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Set active tab based on route or navigation state
    if (location.pathname === '/profile/complete') {
      setActiveTab('complete');
    } else if (location.pathname === '/kyc/documents') {
      setActiveTab('documents');
    } else if (location.state?.tab) {
      setActiveTab(location.state.tab);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 banqa-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">B</span>
          </div>
          <p className="text-primary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Profile Overview
            </TabsTrigger>
            <TabsTrigger value="complete" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              Complete Profile
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
              KYC Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <KYCOnboarding />
          </TabsContent>
          
          <TabsContent value="complete">
            <ProfileCompletion />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
