import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Send,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';
import { PropertyAnalysis, Quote } from '@/types/api';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export const AdminPanel = () => {
  const [analyses, setAnalyses] = useState<PropertyAnalysis[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [analysesResponse, quotesResponse] = await Promise.all([
        apiService.getUserAnalyses('admin'),
        apiService.getUserQuotes('admin')
      ]);

      if (analysesResponse.success && analysesResponse.data) {
        setAnalyses(analysesResponse.data);
      }

      if (quotesResponse.success && quotesResponse.data) {
        setQuotes(quotesResponse.data);
      }
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      ));
      toast.success(`Quote status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update quote status');
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      setAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      toast.success('Analysis deleted successfully');
    } catch (error) {
      toast.error('Failed to delete analysis');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
      toast.success('Quote deleted successfully');
    } catch (error) {
      toast.error('Failed to delete quote');
    }
  };

  // Filter data based on search and status
  const filteredAnalyses = analyses.filter(analysis =>
    analysis.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerInfo.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalRevenue = quotes.filter(q => q.status === 'accepted').reduce((sum, quote) => sum + quote.totalPrice, 0);
  const conversionRate = quotes.length > 0 ? (quotes.filter(q => q.status === 'accepted').length / quotes.length) * 100 : 0;
  const avgQuoteValue = quotes.length > 0 ? quotes.reduce((sum, quote) => sum + quote.totalPrice, 0) / quotes.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">
            Manage property analyses and customer quotes
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="text-2xl font-bold">{analyses.length}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Quotes</p>
                  <p className="text-2xl font-bold">{quotes.filter(q => q.status === 'sent').length}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
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
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
              <div className="space-y-3">
                {analyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium text-sm">{analysis.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      ${analysis.totalEstimate.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Quotes</h3>
              <div className="space-y-3">
                {quotes.slice(0, 5).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <div className="font-medium text-sm">{quote.customerInfo.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        quote.status === 'accepted' ? 'default' :
                        quote.status === 'sent' ? 'secondary' :
                        quote.status === 'declined' ? 'destructive' :
                        'outline'
                      } className="text-xs">
                        {quote.status}
                      </Badge>
                      <div className="text-sm font-semibold">
                        ${quote.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analyses" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size (sq ft)</TableHead>
                  <TableHead>Windows</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnalyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell className="font-medium">{analysis.address}</TableCell>
                    <TableCell>{new Date(analysis.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>{analysis.propertyData.size.toLocaleString()}</TableCell>
                    <TableCell>{analysis.features.windows}</TableCell>
                    <TableCell>${analysis.totalEstimate.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {Math.round(analysis.confidence * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.customerInfo.name}</div>
                        <div className="text-sm text-muted-foreground">{quote.customerInfo.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{quote.customerInfo.address}</TableCell>
                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${quote.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusUpdate(quote.id, value as Quote['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Quote
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send to Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteQuote(quote.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
