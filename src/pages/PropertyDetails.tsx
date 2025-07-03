
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Heart, User, Star, Phone, Mail, ArrowLeft, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { mockProperties } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHostInfo, setShowHostInfo] = useState(false);
  
  const property = mockProperties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate('/explore')}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(property.id);

  const handleWishlistToggle = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add properties to your wishlist.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(property.id);
      toast({
        title: "Removed from wishlist",
        description: "Property has been removed from your wishlist.",
      });
    } else {
      addToWishlist(property.id);
      toast({
        title: "Added to wishlist",
        description: "Property has been added to your wishlist.",
      });
    }
  };

  const handleRevealHostInfo = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to view host contact information.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setShowHostInfo(true);
    toast({
      title: "Contact information revealed",
      description: "You can now contact the host directly.",
    });
  };

  const getGenderBadgeColor = (gender: string) => {
    switch (gender) {
      case 'men': return 'bg-blue-100 text-blue-800';
      case 'women': return 'bg-pink-100 text-pink-800';
      case 'co-living': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success text-white';
      case 'limited': return 'bg-warning text-white';
      case 'full': return 'bg-destructive text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img
                  src={property.images[currentImageIndex] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Virtual Tour Badge */}
                {property.virtualTour && (
                  <Badge className="absolute top-4 left-4 bg-accent text-white">
                    <Eye className="h-3 w-3 mr-1" />
                    360° Tour Available
                  </Badge>
                )}
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 p-2 h-10 w-10 bg-white/80 hover:bg-white wishlist-heart ${
                    isInWishlist ? 'active' : ''
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                </Button>
                
                {/* Image navigation */}
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1
                      )}
                    >
                      ←
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1
                      )}
                    >
                      →
                    </Button>
                    
                    {/* Image dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Title and Location */}
                  <div>
                    <h1 className="text-3xl font-bold text-charcoal mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-primary">
                        ₹{property.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <Badge className={getStatusBadgeColor(property.availabilityStatus)}>
                      {property.availabilityStatus === 'available' ? 'Available' :
                       property.availabilityStatus === 'limited' ? 'Limited Availability' : 'Full'}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getGenderBadgeColor(property.genderPreference)}>
                      {property.genderPreference === 'co-living' ? 'Co-living' : 
                       property.genderPreference === 'men' ? 'Men Only' : 'Women Only'}
                    </Badge>
                    <Badge variant="outline">
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} Room
                    </Badge>
                    {property.virtualTour && (
                      <Badge variant="outline">Virtual Tour</Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {property.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{property.rating}</span>
                      </div>
                      {property.reviewCount && (
                        <span className="text-gray-600">({property.reviewCount} reviews)</span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this place</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">House Rules</h3>
                <div className="space-y-2">
                  {property.houseRules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-gray-700">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Profile */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                    {property.hostAvatar ? (
                      <img 
                        src={property.hostAvatar} 
                        alt={property.hostName} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{property.hostName}</h3>
                    <p className="text-gray-600">Property Host</p>
                  </div>

                  {property.rating && (
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-gray-600">
                        ({property.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {!showHostInfo ? (
                      <Button 
                        onClick={handleRevealHostInfo}
                        className="w-full"
                      >
                        Reveal Host Info
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {property.hostPhone && (
                          <a href={`tel:${property.hostPhone}`}>
                            <Button variant="outline" className="w-full">
                              <Phone className="h-4 w-4 mr-2" />
                              {property.hostPhone}
                            </Button>
                          </a>
                        )}
                        {property.hostEmail && (
                          <a href={`mailto:${property.hostEmail}`}>
                            <Button variant="outline" className="w-full">
                              <Mail className="h-4 w-4 mr-2" />
                              Email Host
                            </Button>
                          </a>
                        )}
                        {property.hostPhone && (
                          <a 
                            href={`https://wa.me/${property.hostPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button className="w-full bg-green-500 hover:bg-green-600">
                              WhatsApp
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <Link to={`/host/${property.hostId}`}>
                    <Button variant="ghost" className="w-full">
                      View All Properties by Host
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-500">Map placeholder</span>
                </div>
                <p className="text-gray-600 text-sm">
                  {property.location}
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleWishlistToggle}
                variant="outline" 
                className="w-full"
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              
              {property.virtualTour && (
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Take Virtual Tour
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
