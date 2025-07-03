
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import { mockProperties } from '@/data/mockData';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState([5000, 20000]);
  const [genderPreference, setGenderPreference] = useState('any');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [virtualTour, setVirtualTour] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [propertyType, setPropertyType] = useState('any');
  const [rating, setRating] = useState(0);

  const availableAmenities = [
    'WiFi', 'AC', 'Meals', 'Parking', 'Security', 'Gym', 
    'Laundry', 'Housekeeping', 'Common Area', 'Power Backup',
    'Refrigerator', 'Microwave', 'Balcony', 'Study Room'
  ];

  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter(property => {
      // Location filter
      if (location && !property.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (property.price < priceRange[0] || property.price > priceRange[1]) {
        return false;
      }
      
      // Gender preference filter
      if (genderPreference !== 'any' && property.genderPreference !== genderPreference) {
        return false;
      }
      
      // Amenities filter
      if (amenities.length > 0) {
        const hasAllAmenities = amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Virtual tour filter
      if (virtualTour && !property.virtualTour) {
        return false;
      }
      
      // Rating filter
      if (rating > 0 && (!property.rating || property.rating < rating)) {
        return false;
      }
      
      return true;
    });

    // Sort properties
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [location, priceRange, genderPreference, amenities, virtualTour, sortBy, propertyType, rating]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity]);
    } else {
      setAmenities(amenities.filter(a => a !== amenity));
    }
  };

  const clearFilters = () => {
    setLocation('');
    setPriceRange([5000, 20000]);
    setGenderPreference('any');
    setAmenities([]);
    setVirtualTour(false);
    setSortBy('newest');
    setPropertyType('any');
    setRating(0);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-cool relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeInUp">
            Discover Your Perfect PG
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Find safe, comfortable, and affordable accommodations
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto glass-effect rounded-2xl p-6 animate-scaleIn" style={{animationDelay: '0.4s'}}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Enter location, area, or landmark..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 bg-white/90 border-0 text-gray-800 placeholder-gray-500"
                />
              </div>
              <Button className="h-12 px-8 bg-white text-gray-800 hover:bg-gray-100 font-semibold">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Results Count */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              Available Properties
            </h2>
            <p className="text-gray-600 flex items-center">
              <span className="inline-block w-2 h-2 bg-gradient-cool rounded-full mr-2"></span>
              {filteredProperties.length} properties found
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-2 border-gray-200 hover:border-gray-300"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-2 border-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="gradient-border p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gradient-cool">Advanced Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block text-gray-700">
                    Location
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="Search location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 border-2 border-gray-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Price Range (Monthly)
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={3000}
                      max={25000}
                      step={500}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span className="bg-gradient-cool-light px-2 py-1 rounded">₹{priceRange[0].toLocaleString()}</span>
                      <span className="bg-gradient-cool-light px-2 py-1 rounded">₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Gender Preference */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Gender Preference
                  </Label>
                  <Select value={genderPreference} onValueChange={setGenderPreference}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="men">Men Only</SelectItem>
                      <SelectItem value="women">Women Only</SelectItem>
                      <SelectItem value="co-living">Co-living</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Property Type
                  </Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block text-gray-700">
                    Minimum Rating
                  </Label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star === rating ? 0 : star)}
                        className={`p-1 rounded ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium mb-3 block text-gray-700">
                    Amenities
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={amenities.includes(amenity)}
                          onCheckedChange={(checked) => 
                            handleAmenityChange(amenity, checked === true)
                          }
                        />
                        <Label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Virtual Tour */}
                <div className="bg-gradient-cool-light p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="virtual-tour"
                      checked={virtualTour}
                      onCheckedChange={(checked) => setVirtualTour(checked === true)}
                    />
                    <Label htmlFor="virtual-tour" className="text-sm font-medium">
                      Virtual Tour Available
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property, index) => (
                  <div 
                    key={property.id}
                    className="animate-fadeInUp"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-cool-light rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters to see more results.
                </p>
                <Button onClick={clearFilters} className="bg-gradient-cool text-white hover:opacity-90">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
