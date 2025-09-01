export interface PropertyAnalysis {
  id: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  propertyData: {
    size: number;
    type: 'residential' | 'commercial';
    stories: number;
    yearBuilt?: number;
    lotSize?: number;
  };
  features: {
    windows: number;
    doors: number;
    skylights: number;
    gutterFeet: number;
    roofArea: number;
    deckArea?: number;
    drivewaySqFt?: number;
  };
  services: ServiceEstimate[];
  totalEstimate: number;
  confidence: number;
  timestamp: string;
  images: AnalyzedImage[];
}

export interface AnalyzedImage {
  id: string;
  url: string;
  thumbnail: string;
  analysis: {
    windows: number;
    doors: number;
    skylights: number;
    confidence: number;
    angle: 'front' | 'back' | 'side' | 'aerial';
  };
}

export interface ServiceEstimate {
  service: 'window_cleaning' | 'pressure_washing' | 'gutter_cleaning' | 'roof_cleaning';
  price: number;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  details: {
    baseRate: number;
    difficulty: number;
    accessibility: number;
    equipment: string[];
    timeEstimate: number; // minutes
  };
}

export interface PropertyLookupResult {
  address: string;
  zillowId?: string;
  melissaData?: {
    propertyType: string;
    squareFootage: number;
    lotSize: number;
    yearBuilt: number;
    bedrooms: number;
    bathrooms: number;
  };
  assessorData?: {
    taxValue: number;
    lastSale?: {
      date: string;
      price: number;
    };
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  subscription: 'free' | 'pro' | 'enterprise';
  analysisCount: number;
  analysisLimit: number;
  preferences: {
    defaultServices: string[];
    priceAdjustments: Record<string, number>;
    autoQuote: boolean;
  };
}

export interface Quote {
  id: string;
  propertyAnalysisId: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  services: ServiceEstimate[];
  totalPrice: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'completed';
  validUntil: string;
  createdAt: string;
  notes?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
