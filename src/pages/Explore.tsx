
import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, SlidersHorizontal, MapPin, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DatabaseProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  price_single: number;
  price_double: number;
  price_triple: number;
  property_type: string;
  sharing_type: string;
  move_in: string;
  amenities: string[];
  images: string[];
  available: boolean;
  views: number;
  rating: number;
  host_name: string;
  host_avatar: string;
  created_at: string;
  updated_at: string;
  host_id: string;
}

interface PropertyCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  property_type: string;
  sharing_type: string;
  move_in: string;
  amenities: string[];
  images: string[];
  available: boolean;
  views: number;
  rating: number;
  host_name: string;
  host_avatar: string;
  created_at: string;
  updated_at: string;
  hostId: string;
  hostName: string;
  genderPreference: 'co-living' | 'men' | 'women';
  virtualTour?: string;
  reviewCount: number;
}

const Explore = () => {
  const [properties, setProperties] = useState<DatabaseProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<DatabaseProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([5000, 25000]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('bangalore');

  const amenityOptions = ['WiFi', 'AC', 'Laundry', 'Meals', 'Security', 'Parking', 'Gym'];

  const cities = [
    { value: 'bangalore', label: 'Bangalore', available: true },
    { value: 'hyderabad', label: 'Hyderabad', available: false },
    { value: 'chennai', label: 'Chennai', available: false }
  ];

  // Extract area names from location strings
  const extractAreaName = (location: string) => {
    // Common patterns for extracting area names
    const patterns = [
      /^([^,]+)/, // Everything before first comma
      /(\w+\s*\w*)\s*,/, // Word(s) before comma
      /^([\w\s]+?)(?:\s*-|\s*,)/, // Everything before dash or comma
    ];
    
    for (const pattern of patterns) {
      const match = location.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Fallback: return first two words
    const words = location.split(/[\s,]+/);
    return words.slice(0, 2).join(' ');
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, priceRange, selectedLocation, selectedType, selectedAmenities, searchTerm, selectedCity]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('properties')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // City filter - only show properties if city is available
    if (selectedCity !== 'bangalore') {
      filtered = []; // No properties for coming soon cities
      setFilteredProperties(filtered);
      return;
    }

    // Search filter - search in both title and extracted area name
    if (searchTerm) {
      filtered = filtered.filter(property => {
        const areaName = extractAreaName(property.location);
        return property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
               areaName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Price filter - DISABLED
    // filtered = filtered.filter(property =>
    //   property.price_single >= priceRange[0] && property.price_single <= priceRange[1]
    // );

    // Location filter - use extracted area names
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(property => {
        const areaName = extractAreaName(property.location);
        return areaName.toLowerCase().includes(selectedLocation.toLowerCase());
      });
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(property =>
        property.property_type === selectedType
      );
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(property =>
        selectedAmenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    }
  };

  // Get unique area names for location filter
  const locations = [...new Set(properties.map(p => extractAreaName(p.location)))];

  // Transform database property to PropertyCard format
  const transformProperty = (property: DatabaseProperty): PropertyCardProps => ({
    id: property.id,
    title: property.title,
    description: property.description,
    location: extractAreaName(property.location),
    price: property.price_single,
    property_type: property.property_type,
    sharing_type: property.sharing_type,
    move_in: property.move_in,
    amenities: property.amenities,
    images: property.images,
    available: property.available,
    views: property.views,
    rating: property.rating,
    host_name: property.host_name,
    host_avatar: property.host_avatar,
    created_at: property.created_at,
    updated_at: property.updated_at,
    hostId: property.host_id,
    hostName: property.host_name,
    genderPreference: 'co-living' as const,
    virtualTour: undefined,
    reviewCount: Math.floor(Math.random() * 50) + 1,
  });

  const currentCity = cities.find(city => city.value === selectedCity);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect PG
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover comfortable and affordable accommodations near you
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h2>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <MapPin className="h-3 w-3 mr-1" />
              {currentCity?.label}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </h3>

                  {/* City Selection */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">City</h4>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem 
                            key={city.value} 
                            value={city.value}
                            disabled={!city.available}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{city.label}</span>
                              {!city.available && (
                                <span className="text-xs text-gray-500 ml-2">Coming Soon</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range - DISABLED */}
                  <div className="mb-6 relative">
                    <div className="blur-sm">
                      <h4 className="font-medium mb-3">Price Range</h4>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={5000}
                        max={30000}
                        step={1000}
                        className="mb-2"
                        disabled={true}
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0].toLocaleString()}</span>
                        <span>₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-800">Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Area</h4>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={selectedCity !== 'bangalore'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Property Type</h4>
                    <Select value={selectedType} onValueChange={setSelectedType} disabled={selectedCity !== 'bangalore'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="PG/Hostel">PG/Hostel</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Room">Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium mb-3">Amenities</h4>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                            disabled={selectedCity !== 'bangalore'}
                          />
                          <label htmlFor={amenity} className="text-sm font-medium">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            {selectedCity !== 'bangalore' ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon to {currentCity?.label}!</h3>
                  <p className="text-gray-600">
                    We're working hard to bring our services to {currentCity?.label}. Stay tuned for updates!
                  </p>
                </CardContent>
              </Card>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={transformProperty(property)} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters to find more properties.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
