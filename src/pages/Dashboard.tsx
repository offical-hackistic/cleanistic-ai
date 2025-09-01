import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PropertyAnalyzer } from '@/components/PropertyAnalyzer';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calculator, 
  Eye, 
  FileText, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Home,
  User,
  Settings
} from 'lucide-react';
import { apiService } from '@/services/api';
import { PropertyAnalysis, Quote, User as UserType } from '@/types/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [analyses, setAnalyses] = useState<PropertyAnalysis[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [userResponse, analysesResponse, quotesResponse] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getUserAnalyses('user-1'),
        apiService.getUserQuotes('user-1')
      ]);

      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
      }

      if (analysesResponse.success && analysesResponse.data) {
        setAnalyses(analysesResponse.data);
      }

      if (quotesResponse.success && quotesResponse.data) {
        setQuotes(quotesResponse.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = (analysis: PropertyAnalysis) => {
    setAnalyses(prev => [analysis, ...prev]);
    toast.success('New property analysis completed!');
  };

  // Analytics data
  const monthlyData = [
    { month: 'Jan', analyses: 4, revenue: 1200 },
    { month: 'Feb', analyses: 8, revenue: 2400 },
    { month: 'Mar', analyses: 12, revenue: 3600 },
    { month: 'Apr', analyses: 15, revenue: 4500 },
    { month: 'May', analyses: 18, revenue: 5400 },
    { month: 'Jun', analyses: 22, revenue: 6600 },
  ];

  const serviceData = [
    { name: 'Window Cleaning', value: 45, color: '#3b82f6' },
    { name: 'Pressure Washing', value: 30, color: '#10b981' },
    { name: 'Gutter Cleaning', value: 20, color: '#f59e0b' },
    { name: 'Roof Cleaning', value: 5, color: '#ef4444' },
  ];

  const totalRevenue = quotes.reduce((sum, quote) => sum + quote.totalPrice, 0);
  const avgEstimate = analyses.length > 0 ? analyses.reduce((sum, analysis) => sum + analysis.totalEstimate, 0) / analyses.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {user?.subscription || 'Free'} Plan
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analyzer">New Analysis</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Analyses</p>
                    <p className="text-2xl font-bold">{analyses.length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% from last month
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Quotes</p>
                    <p className="text-2xl font-bold">{quotes.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% from last month
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +25% from last month
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Estimate</p>
                    <p className="text-2xl font-bold">${Math.round(avgEstimate).toLocaleString()}</p>
                  </div>
                  <Calculator className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5% from last month
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="analyses" fill="#3b82f6" name="Analyses" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
              <div className="space-y-4">
                {analyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{analysis.address}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${analysis.totalEstimate.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(analysis.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analyzer">
            <PropertyAnalyzer 
              onAnalysisComplete={handleAnalysisComplete}
              className="max-w-4xl mx-auto"
            />
          </TabsContent>

          <TabsContent value="analyses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Property Analyses</h3>
              <Button onClick={() => setActiveTab('analyzer')}>
                <Calculator className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>

            <div className="grid gap-6">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{analysis.address}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {Math.round(analysis.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold">{analysis.features.windows}</div>
                      <div className="text-sm text-muted-foreground">Windows</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold">{analysis.propertyData.size.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Sq Ft</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded">
                      <div className="text-2xl font-bold">${analysis.totalEstimate.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Estimate</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Generate Quote</Button>
                    <Button variant="outline" size="sm">Download Report</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quotes</h3>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Quote
              </Button>
            </div>

            <div className="grid gap-4">
              {quotes.map((quote) => (
                <Card key={quote.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{quote.customerInfo.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {quote.customerInfo.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        quote.status === 'accepted' ? 'default' :
                        quote.status === 'sent' ? 'secondary' :
                        quote.status === 'declined' ? 'destructive' :
                        'outline'
                      }>
                        {quote.status}
                      </Badge>
                      <div className="text-xl font-bold mt-2">
                        ${quote.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">View Quote</Button>
                    <Button variant="outline" size="sm">Send to Customer</Button>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
