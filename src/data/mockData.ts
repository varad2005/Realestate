import { BlogPost } from '@/types';



export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Rise of Smart Homes in India: What to Expect in 2026",
    excerpt: "Smart home technology is becoming standard in new developments. Here's a look at the most requested features from today's homebuyers.",
    date: "Jun 15, 2026",
    author: "Rohan Sharma",
    imageUrl: "1560448204-e02f11c3d0e2",
    category: "Trends"
  },
  {
    id: 2,
    title: "Understanding RERA: A Guide for First-Time Homebuyers",
    excerpt: "Navigate the complex world of real estate regulations with our comprehensive guide to the Real Estate (Regulation and Development) Act.",
    date: "Jun 10, 2026",
    author: "Priya Desai",
    imageUrl: "1570129477492-45c003edd2be",
    category: "Legal"
  },
  {
    id: 3,
    title: "Top 5 Emerging Neighborhoods in Pune for Investment",
    excerpt: "Looking for high ROI? These five localities in Pune are seeing rapid infrastructure development and price appreciation.",
    date: "Jun 02, 2026",
    author: "Vikram Singh",
    imageUrl: "1567767292278-a4f21aa2d36e",
    category: "Investment"
  },
  {
    id: 4,
    title: "Rental Yield vs Capital Appreciation: How to Choose",
    excerpt: "Should you invest for immediate rental income or long-term value growth? We break down the math for real estate investors.",
    date: "May 28, 2026",
    author: "Neha Gupta",
    imageUrl: "1560518883-ce09059eeffa",
    category: "Finance"
  }
];

export const BUYER_STEPS = [
  { step: 1, title: "Search Property", desc: "Filter thousands of verified listings to find your ideal match." },
  { step: 2, title: "Visit & Compare", desc: "Schedule physical or virtual tours and compare your favorites." },
  { step: 3, title: "Get Loan", desc: "Get fast-tracked pre-approval for home loans from our partner banks." },
  { step: 4, title: "Close Deal", desc: "Complete the legal paperwork seamlessly with our expert assistance." }
];

export const OWNER_STEPS = [
  { step: 1, title: "Upload Property", desc: "Add photos and details of your property in under 5 minutes." },
  { step: 2, title: "Get Leads", desc: "Receive inquiries from verified and genuine buyers or tenants." },
  { step: 3, title: "Close Deal", desc: "Negotiate and finalize the sale or rent securely." }
];

export const LOCALITY_TRENDS = [
  { id: 1, name: "Koregaon Park", city: "Pune", priceSqft: 14500, yoy: "+8.5%", trend: "up", propertiesCount: 342, rentalYield: "3.2%" },
  { id: 2, name: "Kalyani Nagar", city: "Pune", priceSqft: 11200, yoy: "+6.1%", trend: "up", propertiesCount: 215, rentalYield: "3.5%" },
  { id: 3, name: "Viman Nagar", city: "Pune", priceSqft: 9500, yoy: "+4.8%", trend: "up", propertiesCount: 560, rentalYield: "4.1%" },
  { id: 4, name: "Hinjewadi", city: "Pune", priceSqft: 7200, yoy: "+9.2%", trend: "up", propertiesCount: 890, rentalYield: "4.5%" },
  { id: 5, name: "Baner", city: "Pune", priceSqft: 8800, yoy: "+7.4%", trend: "up", propertiesCount: 450, rentalYield: "3.8%" },
  { id: 6, name: "Wakad", city: "Pune", priceSqft: 7500, yoy: "+5.5%", trend: "up", propertiesCount: 610, rentalYield: "4.0%" },
];

export const LOCALITY_REVIEWS = [
  { id: 1, locality: "Koregaon Park", rating: 4.8, user: "Ananya S.", status: "Resident", text: "Amazing lifestyle with great cafes and parks. Extremely safe at night.", date: "2 weeks ago" },
  { id: 2, locality: "Viman Nagar", rating: 4.5, user: "Rahul M.", status: "Tenant", text: "Very close to the airport and IT parks. Traffic can be a bit heavy during peak hours.", date: "1 month ago" },
  { id: 3, locality: "Hinjewadi", rating: 4.2, user: "Priya D.", status: "Owner", text: "Excellent rental demand due to tech parks. Infrastructure is improving rapidly.", date: "3 weeks ago" }
];

export const DISCOVER_CAROUSEL = [
  { id: 1, title: "Most Searched", subtitle: "Mostly searched by Buyers", image: "1545324418-cc1a3fa10c00", link: "/buy" },
  { id: 2, title: "Most Rated", subtitle: "Top Rated Localities", image: "1600585154340-be6161a56a0c", link: "/buy?furnishing=Fully-Furnished" },
  { id: 3, title: "Most Appreciated", subtitle: "Over 28.6% YOY", image: "1486406146926-c627a92ad1ab", link: "/buy?propertyType=villa" },
  { id: 4, title: "Affordable Segment", subtitle: "Budget Friendly", image: "1449844908441-8829872d2607", link: "/buy?maxPrice=10000000" },
  { id: 5, title: "Mid Segment", subtitle: "Premium Living", image: "1460317581233-0dbe01804c86", link: "/buy?minPrice=10000000&maxPrice=30000000" }
];

export const TOP_GAINERS_CITIES = {
  Pune: [
    { id: 1, name: "Hingne Khurd", sub: "Pune South", yoy: "60.4%", priceRange: "₹11,950/ sqft", up: true },
    { id: 2, name: "Pune Satara Road", sub: "Pune South", yoy: "40.3%", priceRange: "₹12,350/ sqft", up: true },
    { id: 3, name: "Gahunje", sub: "Pune West", yoy: "39.0%", priceRange: "₹11,050/ sqft", up: true },
    { id: 4, name: "Sainikwadi", sub: "Pune East", yoy: "36.4%", priceRange: "₹12,000/ sqft", up: true }
  ],
  Bangalore: [
    { id: 1, name: "Whitefield", sub: "East Bangalore", yoy: "25.4%", priceRange: "₹8,950/ sqft", up: true },
    { id: 2, name: "Electronic City", sub: "South Bangalore", yoy: "15.3%", priceRange: "₹6,350/ sqft", up: true },
  ]
};

export const TRANSACTIONS = [
  { id: 1, locality: "Baner", sub: "Pune West", count: 145, avgRate: "₹9,200/ sqft" },
  { id: 2, locality: "Wakad", sub: "Pune West", count: 112, avgRate: "₹7,500/ sqft" },
  { id: 3, locality: "Kharadi", sub: "Pune East", count: 98, avgRate: "₹8,400/ sqft" },
  { id: 4, locality: "Hinjewadi", sub: "Pune West", count: 86, avgRate: "₹6,800/ sqft" }
];


