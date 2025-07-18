
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type DatabaseProperty = Tables<'properties'>;

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

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [wishlistProperties, setWishlistProperties] = useState<DatabaseProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && wishlist.length > 0) {
      fetchWishlistProperties();
    } else {
      setWishlistProperties([]);
      setLoading(false);
    }
  }, [user, wishlist]);

  const fetchWishlistProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching wishlist properties for IDs:', wishlist);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', wishlist)
        .eq('available', true);

      if (error) {
        console.error('Error fetching wishlist properties:', error);
        throw error;
      }

      console.log('Fetched wishlist properties:', data);
      setWishlistProperties(data || []);
    } catch (error) {
      console.error('Error fetching wishlist properties:', error);
      setWishlistProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform database property to PropertyCard format
  const transformProperty = (property: DatabaseProperty): PropertyCardProps => ({
    id: property.id,
    title: property.title,
    description: property.description || '',
    location: property.location,
    price: property.price_single,
    property_type: property.property_type,
    sharing_type: property.sharing_type,
    move_in: property.move_in,
    amenities: property.amenities || [],
    images: property.images || [],
    available: property.available,
    views: property.views,
    rating: property.rating || 0,
    host_name: property.host_name,
    host_avatar: property.host_avatar || '',
    created_at: property.created_at,
    updated_at: property.updated_at,
    hostId: property.host_id,
    hostName: property.host_name,
    genderPreference: 'co-living' as const,
    virtualTour: undefined,
    reviewCount: Math.floor(Math.random() * 50) + 1,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-600 mb-6">Save your favorite properties and access them anytime</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">
              {wishlist.length === 0 
                ? 'No saved properties yet' 
                : `${wishlist.length} saved ${wishlist.length === 1 ? 'property' : 'properties'}`
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start exploring and save properties you love</p>
            <Link to="/explore">
              <Button>Explore Properties</Button>
            </Link>
          </div>
        ) : wishlistProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Properties not found</h2>
            <p className="text-gray-600 mb-6">Some of your saved properties might no longer be available</p>
            <Link to="/explore">
              <Button>Explore New Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProperties.map((property, index) => (
              <div 
                key={property.id}
                className="animate-fadeInUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <PropertyCard property={transformProperty(property)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
