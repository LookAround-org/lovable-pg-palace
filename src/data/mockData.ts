
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  virtualTour?: string;
  genderPreference: 'men' | 'women' | 'co-living';
  amenities: string[];
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  hostPhone?: string;
  hostEmail?: string;
  availabilityStatus: 'available' | 'limited' | 'full';
  houseRules: string[];
  propertyType: 'single' | 'shared' | 'private';
  rating?: number;
  reviewCount?: number;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Co-living Space',
    description: 'Fully furnished co-living space with modern amenities in the heart of Koramangala. Perfect for working professionals.',
    location: 'Koramangala, Bangalore',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80'
    ],
    virtualTour: 'https://example.com/tour1',
    genderPreference: 'co-living',
    amenities: ['WiFi', 'AC', 'Laundry', 'Parking', 'Security', 'Gym'],
    hostId: 'host1',
    hostName: 'Rajesh Kumar',
    hostPhone: '+91 9876543210',
    hostEmail: 'rajesh@example.com',
    availabilityStatus: 'available',
    houseRules: ['No smoking', 'No parties', 'Maintain cleanliness'],
    propertyType: 'shared',
    rating: 4.5,
    reviewCount: 23,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Ladies PG with Meals',
    description: 'Safe and secure PG for women with homemade meals and excellent facilities.',
    location: 'Indiranagar, Bangalore',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    genderPreference: 'women',
    amenities: ['WiFi', 'Meals', 'Housekeeping', 'Security', 'Common Area'],
    hostId: 'host2',
    hostName: 'Priya Sharma',
    hostPhone: '+91 9876543211',
    hostEmail: 'priya@example.com',
    availabilityStatus: 'limited',
    houseRules: ['No male visitors after 8 PM', 'Inform before going out late'],
    propertyType: 'shared',
    rating: 4.2,
    reviewCount: 18,
    coordinates: { lat: 12.9716, lng: 77.6412 },
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Premium Boys Hostel',
    description: 'Luxurious hostel for men with all modern amenities and excellent connectivity.',
    location: 'Whitefield, Bangalore',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e5fa5e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    virtualTour: 'https://example.com/tour3',
    genderPreference: 'men',
    amenities: ['WiFi', 'AC', 'Gym', 'Parking', 'Pool', 'Gaming Room'],
    hostId: 'host3',
    hostName: 'Amit Patel',
    hostPhone: '+91 9876543212',
    hostEmail: 'amit@example.com',
    availabilityStatus: 'available',
    houseRules: ['No smoking inside', 'Maintain gym equipment'],
    propertyType: 'private',
    rating: 4.7,
    reviewCount: 31,
    coordinates: { lat: 12.9698, lng: 77.7500 },
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'Shared Accommodation',
    description: 'Affordable shared rooms perfect for students and young professionals.',
    location: 'HSR Layout, Bangalore',
    price: 7000,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2370&q=80'
    ],
    genderPreference: 'co-living',
    amenities: ['WiFi', 'Water Supply', 'Power Backup', 'Common Kitchen'],
    hostId: 'host4',
    hostName: 'Suresh Reddy',
    hostPhone: '+91 9876543213',
    hostEmail: 'suresh@example.com',
    availabilityStatus: 'available',
    houseRules: ['Clean after cooking', 'Respect others privacy'],
    propertyType: 'shared',
    rating: 4.0,
    reviewCount: 12,
    coordinates: { lat: 12.9082, lng: 77.6476 },
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    title: 'Executive PG',
    description: 'Premium accommodation for executives with luxury amenities and prime location.',
    location: 'MG Road, Bangalore',
    price: 18000,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    virtualTour: 'https://example.com/tour5',
    genderPreference: 'co-living',
    amenities: ['WiFi', 'AC', 'Meals', 'Housekeeping', 'Concierge', 'Business Center'],
    hostId: 'host5',
    hostName: 'Deepika Singh',
    hostPhone: '+91 9876543214',
    hostEmail: 'deepika@example.com',
    availabilityStatus: 'limited',
    houseRules: ['Professional environment', 'No loud music after 10 PM'],
    propertyType: 'private',
    rating: 4.8,
    reviewCount: 45,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    createdAt: '2024-01-25'
  },
  {
    id: '6',
    title: 'Budget Friendly PG',
    description: 'Clean and safe accommodation at affordable prices with basic amenities.',
    location: 'Electronic City, Bangalore',
    price: 6000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e5fa5e17?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    genderPreference: 'men',
    amenities: ['WiFi', 'Water Supply', 'Security', 'Common Kitchen'],
    hostId: 'host6',
    hostName: 'Ravi Kumar',
    hostPhone: '+91 9876543215',
    hostEmail: 'ravi@example.com',
    availabilityStatus: 'available',
    houseRules: ['No drinking', 'Be back by midnight'],
    propertyType: 'shared',
    rating: 3.8,
    reviewCount: 8,
    coordinates: { lat: 12.8456, lng: 77.6603 },
    createdAt: '2024-01-05'
  }
];

export const featuredProperties = mockProperties.slice(0, 3);
export const trendingProperties = mockProperties.slice(2, 5);
