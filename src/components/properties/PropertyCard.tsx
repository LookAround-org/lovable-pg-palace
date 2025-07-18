
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, User, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  genderPreference: 'men' | 'women' | 'co-living';
  amenities: string[];
  virtualTour?: string;
  hostName: string;
  hostAvatar?: string;
  rating?: number;
  reviewCount?: number;
}

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isInWishlist = wishlist.includes(property.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property.id);
    }
  };

  const getGenderBadgeColor = (gender: string) => {
    switch (gender) {
      case 'men': return 'bg-blue-100 text-blue-800';
      case 'women': return 'bg-pink-100 text-pink-800';
      case 'co-living': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`property-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/property/${property.id}`}>
          <img
            src={property.images[0] || '/placeholder.svg'}
            alt={property.title}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </Link>
        
        {/* Virtual Tour Badge - BLURRED */}
        {property.virtualTour && (
          <div className="absolute top-3 left-3 relative">
            <Badge className="bg-accent text-white blur-sm opacity-50">
              360° Tour
            </Badge>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-3 w-3 text-gray-600" />
            </div>
          </div>
        )}
        
        {/* Wishlist Button */}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 p-2 h-8 w-8 bg-white/80 hover:bg-white wishlist-heart ${
              isInWishlist ? 'active' : ''
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <Link to={`/property/${property.id}`}>
          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-charcoal mb-1 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          {/* Price - BLURRED */}
          <div className="mb-3 relative">
            <div className="blur-sm">
              <span className="text-2xl font-bold text-primary">
                ₹{property.price.toLocaleString()}
              </span>
              <span className="text-gray-600 text-sm ml-1">/month</span>
            </div>
            <div className="absolute left-0 top-0 flex items-center">
              <div className="bg-white/80 rounded px-2 py-1 flex items-center">
                <Clock className="h-3 w-3 text-gray-600 mr-1" />
                <span className="text-xs font-medium text-gray-800">Soon</span>
              </div>
            </div>
          </div>

          {/* Gender Preference */}
          <div className="mb-3">
            <Badge className={getGenderBadgeColor(property.genderPreference)}>
              {property.genderPreference === 'co-living' ? 'Co-living' : 
               property.genderPreference === 'men' ? 'Men Only' : 'Women Only'}
            </Badge>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* Host Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              {property.hostAvatar ? (
                <img src={property.hostAvatar} alt={property.hostName} className="w-full h-full rounded-full" />
              ) : (
                <User className="h-3 w-3 text-white" />
              )}
            </div>
            <span className="text-sm text-gray-600">{property.hostName}</span>
          </div>
          
          {property.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{property.rating}</span>
              {property.reviewCount && (
                <span className="text-xs text-gray-500">({property.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
