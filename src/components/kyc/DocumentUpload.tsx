
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type DocumentType = Database['public']['Enums']['document_type'];
type KYCStatus = Database['public']['Enums']['kyc_status'];

interface KYCDocument {
  id: string;
  document_type: DocumentType;
  document_url: string;
  verification_status: KYCStatus;
  document_number?: string;
  created_at: string;
}

const DocumentUpload = () => {
  const { user } = useAuth();
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | ''>('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'national_id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'selfie', label: 'Selfie with ID' },
  ];

  const getStatusIcon = (status: KYCStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'under_review':
      case 'in_progress':
        return <Clock className="h-5 w-5 text-secondary" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, or PDF file.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType || !user) {
      toast({
        title: "Missing information",
        description: "Please select a document type and file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage (you'll need to create a bucket)
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${selectedDocumentType}_${Date.now()}.${fileExt}`;
      
      // For now, we'll simulate the upload and store a placeholder URL
      const documentUrl = `https://placeholder-bucket.supabase.co/documents/${fileName}`;

      // Save document record to database
      const { error } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: selectedDocumentType as DocumentType,
          document_number: documentNumber || null,
          document_url: documentUrl,
          verification_status: 'in_progress' as KYCStatus
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is being reviewed.",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedDocumentType('');
      setDocumentNumber('');
      
      // Refresh documents list
      fetchDocuments();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Fetch documents on component mount
  React.useEffect(() => {
    fetchDocuments();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Document Upload</CardTitle>
          <CardDescription>
            Upload your identity documents for verification. All documents are securely stored and reviewed by our compliance team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={(value: DocumentType) => setSelectedDocumentType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number (Optional)</Label>
              <Input
                id="documentNumber"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Enter document number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Document</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, PDF up to 5MB
                </p>
              </label>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !selectedDocumentType || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Track the status of your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.verification_status)}
                    <div>
                      <p className="font-medium">
                        {documentTypes.find(t => t.value === doc.document_type)?.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">
                      {doc.verification_status.replace('_', ' ')}
                    </p>
                    {doc.document_number && (
                      <p className="text-sm text-muted-foreground">
                        {doc.document_number}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
