
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
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

  const availableAmenities = [
    'WiFi', 'AC', 'Meals', 'Parking', 'Security', 'Gym', 
    'Laundry', 'Housekeeping', 'Common Area', 'Power Backup'
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
  }, [location, priceRange, genderPreference, amenities, virtualTour, sortBy]);

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
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Explore Properties
            </h1>
            <p className="text-gray-600">
              {filteredProperties.length} properties found
            </p>
          </div>
          
          {/* Mobile filter toggle */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                    Location
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="Search location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Price Range
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
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Gender Preference */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Gender Preference
                  </Label>
                  <Select value={genderPreference} onValueChange={setGenderPreference}>
                    <SelectTrigger>
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

                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtual-tour"
                    checked={virtualTour}
                    onCheckedChange={(checked) => setVirtualTour(checked === true)}
                  />
                  <Label htmlFor="virtual-tour" className="text-sm">
                    Virtual Tour Available
                  </Label>
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
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
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
