import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Link, FileText, Send, Mail } from "lucide-react";

interface FormData {
  leadSource: 'apollo' | 'csv' | '';
  apolloUrl: string;
  csvFile: File | null;
  numberOfLeads: number;
  outputFormats: {
    instantlyCampaign: boolean;
    emailCsv: boolean;
  };
  campaignId: string;
  email: string;
}

interface DashboardData {
  personalizedMessages: number;
  hoursSaved: number;
  moneySaved: number;
}

interface LeadEnrichmentFormProps {
  onSubmissionComplete: (data: DashboardData) => void;
}

export const LeadEnrichmentForm = ({ onSubmissionComplete }: LeadEnrichmentFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    leadSource: '',
    apolloUrl: '',
    csvFile: null,
    numberOfLeads: 500,
    outputFormats: {
      instantlyCampaign: false,
      emailCsv: false,
    },
    campaignId: '',
    email: '',
  });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setFormData(prev => ({ ...prev, csvFile: file }));
        toast({
          title: "File uploaded",
          description: `${file.name} has been selected`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, csvFile: file }));
      toast({
        title: "File selected",
        description: `${file.name} has been uploaded`,
      });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.leadSource) {
      toast({
        title: "Missing lead source",
        description: "Please select either Apollo URL or CSV upload",
        variant: "destructive",
      });
      return false;
    }

    if (formData.leadSource === 'apollo') {
      if (!formData.apolloUrl) {
        toast({
          title: "Missing Apollo URL",
          description: "Please provide an Apollo URL",
          variant: "destructive",
        });
        return false;
      }
      if (formData.numberOfLeads < 500) {
        toast({
          title: "Invalid lead count",
          description: "Minimum number of leads is 500",
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.leadSource === 'csv' && !formData.csvFile) {
      toast({
        title: "Missing CSV file",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.outputFormats.instantlyCampaign && !formData.outputFormats.emailCsv) {
      toast({
        title: "Missing output format",
        description: "Please select at least one output format",
        variant: "destructive",
      });
      return false;
    }

    if (formData.outputFormats.instantlyCampaign && !formData.campaignId) {
      toast({
        title: "Missing campaign ID",
        description: "Please provide an Instantly campaign ID",
        variant: "destructive",
      });
      return false;
    }

    if (formData.outputFormats.emailCsv && !formData.email) {
      toast({
        title: "Missing email",
        description: "Please provide an email address for CSV delivery",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const submissionData = new FormData();
      submissionData.append('leadSource', formData.leadSource);
      
      if (formData.leadSource === 'apollo') {
        submissionData.append('apolloUrl', formData.apolloUrl);
        submissionData.append('numberOfLeads', formData.numberOfLeads.toString());
      } else if (formData.csvFile) {
        submissionData.append('csvFile', formData.csvFile);
      }
      
      submissionData.append('outputFormats', JSON.stringify(formData.outputFormats));
      
      if (formData.outputFormats.instantlyCampaign) {
        submissionData.append('campaignId', formData.campaignId);
      }
      
      if (formData.outputFormats.emailCsv) {
        submissionData.append('email', formData.email);
      }

      const response = await fetch('https://adham131.app.n8n.cloud/webhook-test/v1-aga', {
        method: 'POST',
        body: submissionData,
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const result = await response.json();
      
      // Mock dashboard data based on form inputs
      const dashboardData: DashboardData = {
        personalizedMessages: formData.leadSource === 'apollo' ? formData.numberOfLeads : 1000,
        hoursSaved: Math.round((formData.leadSource === 'apollo' ? formData.numberOfLeads : 1000) * 0.1),
        moneySaved: Math.round((formData.leadSource === 'apollo' ? formData.numberOfLeads : 1000) * 5.5),
      };

      toast({
        title: "Success!",
        description: "Lead enrichment process completed successfully",
      });

      onSubmissionComplete(dashboardData);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card max-w-2xl mx-auto transition-smooth">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">Lead Enrichment & Personalization</CardTitle>
        <p className="text-muted-foreground">
          Upload your leads and let AGA create personalized messages that convert
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lead Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="leadSource" className="text-sm font-medium">
              Lead Information Source
            </Label>
            <Select
              value={formData.leadSource}
              onValueChange={(value: 'apollo' | 'csv') => 
                setFormData(prev => ({ ...prev, leadSource: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your lead source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apollo">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Apollo URL
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV Upload
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apollo URL Fields */}
          {formData.leadSource === 'apollo' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="apolloUrl" className="text-sm font-medium">
                  Apollo URL
                </Label>
                <Input
                  id="apolloUrl"
                  type="url"
                  value={formData.apolloUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, apolloUrl: e.target.value }))}
                  placeholder="https://app.apollo.io/..."
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfLeads" className="text-sm font-medium">
                  Number of Leads to Personalize
                </Label>
                <Input
                  id="numberOfLeads"
                  type="number"
                  min={500}
                  value={formData.numberOfLeads}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfLeads: parseInt(e.target.value) || 500 }))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Minimum: 500 leads</p>
              </div>
            </>
          )}

          {/* CSV Upload */}
          {formData.leadSource === 'csv' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload CSV File</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {formData.csvFile ? formData.csvFile.name : 'Drag and drop your CSV file here'}
                  </p>
                  <p className="text-xs text-muted-foreground">or</p>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label htmlFor="csvFile" className="cursor-pointer">
                      Browse Files
                    </label>
                  </Button>
                  <input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Output Format Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Desired Output Format</Label>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="instantly"
                  checked={formData.outputFormats.instantlyCampaign}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      outputFormats: { ...prev.outputFormats, instantlyCampaign: !!checked }
                    }))
                  }
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="instantly" className="text-sm font-medium flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send to Instantly Campaign
                  </Label>
                  {formData.outputFormats.instantlyCampaign && (
                    <Input
                      placeholder="Campaign ID"
                      value={formData.campaignId}
                      onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="email"
                  checked={formData.outputFormats.emailCsv}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      outputFormats: { ...prev.outputFormats, emailCsv: !!checked }
                    }))
                  }
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email CSV
                  </Label>
                  {formData.outputFormats.emailCsv && (
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 text-base font-medium bg-gradient-primary hover:opacity-90 transition-smooth glow-effect"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Your Leads...
              </>
            ) : (
              'Start Lead Enrichment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
