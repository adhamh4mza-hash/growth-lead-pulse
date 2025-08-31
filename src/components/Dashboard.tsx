import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, DollarSign, RefreshCw } from "lucide-react";

interface DashboardData {
  personalizedMessages: number;
  hoursSaved: number;
  moneySaved: number;
}

interface DashboardProps {
  data: DashboardData;
  onStartNew: () => void;
}

export const Dashboard = ({ data, onStartNew }: DashboardProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text">
          Lead Enrichment Complete! 🎉
        </h1>
        <p className="text-muted-foreground text-lg">
          Your personalized messages have been generated successfully
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personalized Messages */}
        <Card className="glass-card transition-smooth hover:glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personalized Messages
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              {formatNumber(data.personalizedMessages)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages generated for your leads
            </p>
          </CardContent>
        </Card>

        {/* Hours Saved */}
        <Card className="glass-card transition-smooth hover:glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Saved
            </CardTitle>
            <Clock className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {formatNumber(data.hoursSaved)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time saved using AGA automation
            </p>
          </CardContent>
        </Card>

        {/* Money Saved */}
        <Card className="glass-card transition-smooth hover:glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Money Saved
            </CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              ${formatNumber(data.moneySaved)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cost savings vs manual personalization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">If you selected "Send to Instantly Campaign":</h4>
              <p className="text-muted-foreground">
                Your personalized messages have been automatically imported into your Instantly campaign. 
                You can now review and launch your outreach sequence.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">If you selected "Email CSV":</h4>
              <p className="text-muted-foreground">
                Check your email inbox for a CSV file containing all your personalized messages. 
                You can import this into any CRM or email platform.
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <Button 
              onClick={onStartNew}
              className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Process More Leads
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};