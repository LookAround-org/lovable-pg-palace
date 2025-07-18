
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Heart, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { mockProperties } from '@/data/mockData';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  console.log('Wishlist page - User:', user?.email, 'Wishlist IDs:', wishlist);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Login Required
          </h2>
          <p className="text-gray-500 mb-6">
            Please login to view your wishlist
          </p>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter properties based on wishlist IDs
  const wishlistProperties = mockProperties.filter(property => {
    const isInWishlist = wishlist.includes(property.id);
    console.log('Property:', property.id, property.title, 'In wishlist:', isInWishlist);
    return isInWishlist;
  });

  console.log('Filtered wishlist properties:', wishlistProperties.length, wishlistProperties.map(p => ({ id: p.id, title: p.title })));

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlistProperties.length} saved properties
          </p>
        </div>

        {/* Content */}
        {wishlistProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProperties.map((property, index) => (
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
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start adding properties you like to see them here
            </p>
            <Link to="/explore">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Explore Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
