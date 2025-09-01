import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, MapPin, Calculator, CheckCircle, X, Eye, Home } from 'lucide-react';
import { apiService } from '@/services/api';
import { PropertyAnalysis } from '@/types/api';
import { toast } from 'sonner';

interface PropertyAnalyzerProps {
  onAnalysisComplete?: (analysis: PropertyAnalysis) => void;
  className?: string;
}

export const PropertyAnalyzer: React.FC<PropertyAnalyzerProps> = ({ 
  onAnalysisComplete,
  className = ''
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [progress, setProgress] = useState(0);
  const [address, setAddress] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [selectedServices, setSelectedServices] = useState([
    'window_cleaning',
    'pressure_washing',
    'gutter_cleaning'
  ]);

  const services = [
    { id: 'window_cleaning', label: 'Window Cleaning', icon: Eye },
    { id: 'pressure_washing', label: 'Pressure Washing', icon: Home },
    { id: 'gutter_cleaning', label: 'Gutter Cleaning', icon: Home },
    { id: 'roof_cleaning', label: 'Roof Cleaning', icon: Home },
  ];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files');
      return;
    }

    // Limit to 10 files
    if (validFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(validFiles);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!address.trim()) {
      toast.error('Please enter a property address');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    setStep('analyzing');
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await apiService.analyzeProperty(address, selectedFiles, selectedServices);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        setAnalysis(result.data);
        setStep('results');
        onAnalysisComplete?.(result.data);
        toast.success('Analysis completed successfully!');
      } else {
        throw new Error(result.error?.message || 'Analysis failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setStep('upload');
      setProgress(0);
      toast.error(error instanceof Error ? error.message : 'Analysis failed');
    }
  }, [address, selectedFiles, selectedServices, onAnalysisComplete]);

  const resetAnalysis = useCallback(() => {
    setStep('upload');
    setProgress(0);
    setAnalysis(null);
    setSelectedFiles([]);
    setAddress('');
  }, []);

  if (step === 'results' && analysis) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold">Analysis Complete</h3>
            </div>
            <Button variant="outline" onClick={resetAnalysis}>
              New Analysis
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Property Details
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-medium">{analysis.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{analysis.propertyData.size.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Stories:</span>
                  <span className="font-medium">{analysis.propertyData.stories}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium text-green-600">
                    {Math.round(analysis.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Detected Features
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Windows:</span>
                  <span className="font-medium">{analysis.features.windows}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doors:</span>
                  <span className="font-medium">{analysis.features.doors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skylights:</span>
                  <span className="font-medium">{analysis.features.skylights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gutter Length:</span>
                  <span className="font-medium">{analysis.features.gutterFeet} ft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Service Estimates
            </h4>
            <div className="space-y-3">
              {analysis.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {service.service.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Est. time: {service.details.timeEstimate} minutes
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    ${service.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Estimate:</span>
                <span className="text-primary">${analysis.totalEstimate.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" className="w-full">
              Generate Quote
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              Download Report
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (step === 'analyzing') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <Camera className="h-12 w-12 mx-auto text-primary animate-pulse" />
            <h3 className="text-xl font-semibold">Analyzing Property</h3>
            <p className="text-muted-foreground">
              Our AI is processing your images and property data...
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {progress < 30 ? 'Processing images...' :
               progress < 60 ? 'Analyzing property features...' :
               progress < 90 ? 'Calculating estimates...' :
               'Finalizing analysis...'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Images</div>
              <div className="font-medium">{selectedFiles.length} uploaded</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Services</div>
              <div className="font-medium">{selectedServices.length} selected</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Property Analyzer</h3>
          <p className="text-muted-foreground">
            Upload photos and get instant estimates for cleaning services
          </p>
        </div>

        <Tabs defaultValue="address" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="address" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Property Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder="Enter property address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="space-y-2">
              <Label>Property Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer space-y-2 block">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <div className="font-medium">Click to upload images</div>
                    <div className="text-sm text-muted-foreground">
                      Max 10 images, JPG/PNG only
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Images ({selectedFiles.length})</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Services</Label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedServices.includes(service.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-center gap-2">
                      <service.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{service.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={startAnalysis} 
          size="lg" 
          className="w-full"
          disabled={!address.trim() || selectedFiles.length === 0 || selectedServices.length === 0}
        >
          <Calculator className="mr-2 h-5 w-5" />
          Start Analysis
        </Button>
      </div>
    </Card>
  );
};
