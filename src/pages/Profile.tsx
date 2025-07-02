
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import KYCOnboarding from '@/components/profile/KYCOnboarding';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
import DocumentUpload from '@/components/kyc/DocumentUpload';

const Profile = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <p className="text-emerald-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Profile Overview</TabsTrigger>
            <TabsTrigger value="complete">Complete Profile</TabsTrigger>
            <TabsTrigger value="documents">KYC Documents</TabsTrigger>
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
