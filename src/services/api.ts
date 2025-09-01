import { PropertyAnalysis, PropertyLookupResult, User, Quote, APIResponse, AnalyzedImage, ServiceEstimate } from '@/types/api';

// Simulated database
const mockDatabase = {
  users: new Map<string, User>(),
  analyses: new Map<string, PropertyAnalysis>(),
  quotes: new Map<string, Quote>(),
};

// Initialize with sample data
const sampleUser: User = {
  id: 'user-1',
  email: 'demo@cleanistic.ai',
  name: 'Demo User',
  company: 'Cleanistic Demo',
  subscription: 'pro',
  analysisCount: 15,
  analysisLimit: 100,
  preferences: {
    defaultServices: ['window_cleaning', 'pressure_washing'],
    priceAdjustments: {},
    autoQuote: true,
  },
};

mockDatabase.users.set(sampleUser.id, sampleUser);

class APIService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Computer Vision Analysis Simulation
  async analyzeImages(files: File[]): Promise<APIResponse<AnalyzedImage[]>> {
    await this.delay(2000); // Simulate AI processing

    const analyzedImages: AnalyzedImage[] = files.map((file, index) => ({
      id: this.generateId(),
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      analysis: {
        windows: Math.floor(Math.random() * 20) + 8, // 8-28 windows
        doors: Math.floor(Math.random() * 4) + 1, // 1-5 doors
        skylights: Math.floor(Math.random() * 3), // 0-3 skylights
        confidence: 0.95 + Math.random() * 0.04, // 95-99% confidence
        angle: ['front', 'back', 'side', 'aerial'][index % 4] as any,
      },
    }));

    return {
      success: true,
      data: analyzedImages,
    };
  }

  // Property Lookup Simulation
  async lookupProperty(address: string): Promise<APIResponse<PropertyLookupResult>> {
    await this.delay(1500);

    // Simulate address variations and data sources
    const mockData: PropertyLookupResult = {
      address: address,
      zillowId: `zillow-${this.generateId()}`,
      melissaData: {
        propertyType: 'Single Family Residential',
        squareFootage: Math.floor(Math.random() * 2000) + 1200, // 1200-3200 sq ft
        lotSize: Math.floor(Math.random() * 8000) + 2000, // 2000-10000 sq ft
        yearBuilt: Math.floor(Math.random() * 50) + 1970, // 1970-2020
        bedrooms: Math.floor(Math.random() * 4) + 2, // 2-6 bedrooms
        bathrooms: Math.floor(Math.random() * 3) + 1, // 1-4 bathrooms
      },
      assessorData: {
        taxValue: Math.floor(Math.random() * 400000) + 200000, // $200k-$600k
        lastSale: {
          date: '2023-06-15',
          price: Math.floor(Math.random() * 500000) + 250000,
        },
      },
    };

    return {
      success: true,
      data: mockData,
    };
  }

  // Service Pricing Calculator
  private calculateServicePricing(
    service: string,
    propertyData: any,
    features: any
  ): ServiceEstimate {
    const baseRates = {
      window_cleaning: 8, // per window
      pressure_washing: 0.15, // per sq ft
      gutter_cleaning: 12, // per linear foot
      roof_cleaning: 0.25, // per sq ft of roof
    };

    const difficultyMultiplier = 1 + (features.stories - 1) * 0.3;
    const accessibilityMultiplier = features.skylights > 0 ? 1.2 : 1.0;

    let basePrice = 0;
    let timeEstimate = 60;
    let equipment: string[] = [];

    switch (service) {
      case 'window_cleaning':
        basePrice = features.windows * baseRates.window_cleaning;
        timeEstimate = features.windows * 3;
        equipment = ['Squeegees', 'Extension poles', 'Cleaning solution'];
        break;
      case 'pressure_washing':
        basePrice = propertyData.size * baseRates.pressure_washing;
        timeEstimate = propertyData.size * 0.5;
        equipment = ['Pressure washer', 'Surface cleaners', 'Chemicals'];
        break;
      case 'gutter_cleaning':
        basePrice = features.gutterFeet * baseRates.gutter_cleaning;
        timeEstimate = features.gutterFeet * 2;
        equipment = ['Ladder', 'Gutter scoop', 'Blower'];
        break;
      case 'roof_cleaning':
        basePrice = features.roofArea * baseRates.roof_cleaning;
        timeEstimate = features.roofArea * 1;
        equipment = ['Soft wash system', 'Safety equipment', 'Chemicals'];
        break;
    }

    const finalPrice = Math.round(basePrice * difficultyMultiplier * accessibilityMultiplier);

    return {
      service: service as any,
      price: finalPrice,
      frequency: 'one_time',
      details: {
        baseRate: basePrice,
        difficulty: difficultyMultiplier,
        accessibility: accessibilityMultiplier,
        equipment,
        timeEstimate,
      },
    };
  }

  // Complete Property Analysis
  async analyzeProperty(
    address: string,
    images: File[],
    services: string[] = ['window_cleaning', 'pressure_washing', 'gutter_cleaning']
  ): Promise<APIResponse<PropertyAnalysis>> {
    try {
      // Step 1: Analyze images
      const imageAnalysis = await this.analyzeImages(images);
      if (!imageAnalysis.success || !imageAnalysis.data) {
        throw new Error('Image analysis failed');
      }

      // Step 2: Property lookup
      const propertyLookup = await this.lookupProperty(address);
      if (!propertyLookup.success || !propertyLookup.data) {
        throw new Error('Property lookup failed');
      }

      // Step 3: Aggregate features from all images
      const totalFeatures = imageAnalysis.data.reduce(
        (acc, img) => ({
          windows: acc.windows + img.analysis.windows,
          doors: acc.doors + img.analysis.doors,
          skylights: acc.skylights + img.analysis.skylights,
        }),
        { windows: 0, doors: 0, skylights: 0 }
      );

      // Estimate additional features based on property data
      const propertySize = propertyLookup.data.melissaData?.squareFootage || 2000;
      const stories = Math.ceil(propertySize / 1200); // Estimate stories

      const features = {
        ...totalFeatures,
        gutterFeet: Math.round(Math.sqrt(propertySize) * 4), // Perimeter estimate
        roofArea: Math.round(propertySize * 1.3), // Roof typically 30% larger
        deckArea: Math.floor(Math.random() * 400), // Random deck area
        drivewaySqFt: Math.floor(Math.random() * 800) + 200,
      };

      const propertyData = {
        size: propertySize,
        type: 'residential' as const,
        stories,
        yearBuilt: propertyLookup.data.melissaData?.yearBuilt,
        lotSize: propertyLookup.data.melissaData?.lotSize,
      };

      // Step 4: Calculate service estimates
      const serviceEstimates = services.map(service =>
        this.calculateServicePricing(service, propertyData, { ...features, stories })
      );

      const totalEstimate = serviceEstimates.reduce((sum, service) => sum + service.price, 0);

      const analysis: PropertyAnalysis = {
        id: this.generateId(),
        address,
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
        propertyData,
        features,
        services: serviceEstimates,
        totalEstimate,
        confidence: imageAnalysis.data.reduce((sum, img) => sum + img.analysis.confidence, 0) / imageAnalysis.data.length,
        timestamp: new Date().toISOString(),
        images: imageAnalysis.data,
      };

      // Store in mock database
      mockDatabase.analyses.set(analysis.id, analysis);

      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // User Management
  async getCurrentUser(): Promise<APIResponse<User>> {
    await this.delay(500);
    return {
      success: true,
      data: sampleUser,
    };
  }

  // Quote Generation
  async generateQuote(
    analysisId: string,
    customerInfo: Quote['customerInfo']
  ): Promise<APIResponse<Quote>> {
    await this.delay(1000);

    const analysis = mockDatabase.analyses.get(analysisId);
    if (!analysis) {
      return {
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'Property analysis not found',
        },
      };
    }

    const quote: Quote = {
      id: this.generateId(),
      propertyAnalysisId: analysisId,
      customerId: this.generateId(),
      customerInfo,
      services: analysis.services,
      totalPrice: analysis.totalEstimate,
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      createdAt: new Date().toISOString(),
    };

    mockDatabase.quotes.set(quote.id, quote);

    return {
      success: true,
      data: quote,
    };
  }

  // Get user's analyses
  async getUserAnalyses(userId: string): Promise<APIResponse<PropertyAnalysis[]>> {
    await this.delay(800);
    const analyses = Array.from(mockDatabase.analyses.values());
    return {
      success: true,
      data: analyses,
    };
  }

  // Get user's quotes
  async getUserQuotes(userId: string): Promise<APIResponse<Quote[]>> {
    await this.delay(800);
    const quotes = Array.from(mockDatabase.quotes.values());
    return {
      success: true,
      data: quotes,
    };
  }
}

export const apiService = new APIService();
