export type PropType = "apartment" | "villa" | "plot" | "penthouse" | "commercial" | "studio";

export interface Property {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  location: string;
  area: string;
  carpetArea?: number;
  builtUpArea?: number;
  superBuiltUpArea?: number;
  bhk: number;
  type: PropType;
  badge: "Verified" | "New" | null;
  image: string;
  builder: string;
  amenities: string[];
  description: string;
  floor: string;
  facing: string;
  possession: string;
  rating: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: string; // Refers to lucide-react icon
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  isFloorPlan?: boolean;
}

export interface PropertyVideo {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  duration_seconds?: number;
  file_size_mb?: number;
  is_primary?: boolean;
}

export interface VirtualTour {
  id: string;
  property_id: string;
  panorama_url: string;
  thumbnail_url?: string;
  title: string;
  description?: string;
  sort_order: number;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
}

export interface Seller {
  id: string;
  name: string;
  role: "Owner" | "Agent" | "Builder";
  phone: string;
  avatarUrl?: string;
  rating?: number;
  propertiesListed?: number;
  joinedDate?: string;
}

export interface LocationAdvantage {
  id: string;
  name: string;
  distance: string;
  type: "school" | "hospital" | "transport" | "mall" | "park" | "metro" | "it_park" | "highway" | "airport";
}

export interface LocationDetails {
  city: string;
  state?: string;
  pincode?: string;
  locality: string;
  address: string;
  coordinates: { lat: number; lng: number };
  advantages: LocationAdvantage[];
}

export interface ProjectDetails {
  id: string;
  projectName: string;
  builderName: string;
  launchYear?: string;
  totalUnits?: number;
  projectArea?: string;
  reraNumber?: string;
  marketingTagline?: string;
  description?: string;
}

export interface PropertyHighlight {
  id: string;
  title: string;
  value: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  builderName: string;
  reraId?: string;
  possessionDate: string;
  description: string;
}

export interface DetailedProperty extends Omit<Property, "image" | "amenities"> {
  images: PropertyImage[];
  videos?: PropertyVideo[];
  virtualTours?: VirtualTour[];
  amenities: Amenity[];
  seller: Seller;
  locationDetails: LocationDetails;
  project?: ProjectInfo;
  projectDetails?: ProjectDetails;
  highlights: PropertyHighlight[];
  propertyAge: string;
  ownershipType: "Freehold" | "Leasehold" | "Power of Attorney" | "Co-operative Society";
  furnishing: "Unfurnished" | "Semi-Furnished" | "Fully-Furnished";
  maintenanceCharges?: number;
  bathrooms: number;
  balconies: number;
  totalFloors: number;
  createdAt: string;
  updatedAt: string;
  addonOrders?: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
}
