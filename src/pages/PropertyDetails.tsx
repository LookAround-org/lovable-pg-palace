import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Heart, User, Star, Phone, Mail, ArrowLeft, Eye, Calendar, Users, Home, Play, Loader2, Utensils, Sofa, Car, Train, ShoppingBag, Hospital, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price_single: number;
  price_double: number;
  price_triple: number;
  property_type: string;
  sharing_type: string;
  move_in: string;
  amenities: string[] | null;
  images: string[] | null;
  available: boolean;
  views: number;
  rating: number | null;
  host_name: string;
  host_avatar: string | null;
  host_phone: string | null;
  host_id: string;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHostInfo, setShowHostInfo] = useState(false);
  const [selectedSharingType, setSelectedSharingType] = useState<'single' | 'double' | 'triple'>('single');
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);

  // Dummy data for new features
  const propertyFeatures = {
    foodIncluded: true,
    furnishing: 'Fully Furnished',
    furniture: [
      'Single Bed with Mattress',
      'Study Table & Chair',
      'Wardrobe',
      'Side Table',
      'Mirror',
      'Ceiling Fan',
      'Window Curtains'
    ],
    nearbyFacilities: [
      { name: 'Metro Station', distance: '0.5 km', icon: Train },
      { name: 'Shopping Mall', distance: '2 km', icon: ShoppingBag },
      { name: 'Hospital', distance: '1.5 km', icon: Hospital },
      { name: 'Bus Stop', distance: '200 m', icon: Car },
      { name: 'ATM', distance: '300 m', icon: MapPin },
      { name: 'Grocery Store', distance: '500 m', icon: ShoppingBag }
    ]
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchReviews();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } else {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 21) return '2 weeks ago';
    if (diffDays < 30) return '3 weeks ago';
    if (diffDays < 60) return '1 month ago';
    if (diffDays < 90) return '2 months ago';
    if (diffDays < 120) return '3 months ago';
    if (diffDays < 150) return '4 months ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
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
    setShowTermsDialog(true);
  };

  const handleTermsAcceptance = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms acceptance required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }
    setShowHostInfo(true);
    setShowTermsDialog(false);
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

  // Pricing data based on sharing type with refundable deposit - BLURRED
  const pricingData = {
    single: { 
      price: property.price_single, 
      deposit: 5000, 
      refundableDeposit: 4000,
      maintenance: 1000 
    },
    double: { 
      price: property.price_double, 
      deposit: 4000, 
      refundableDeposit: 3200,
      maintenance: 800 
    },
    triple: { 
      price: property.price_triple, 
      deposit: 3000, 
      refundableDeposit: 2500,
      maintenance: 600 
    }
  };

  // Image data - using the property images or fallback images
  const propertyImages = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  ];

  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button and Virtual Tour button for mobile */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {/* Virtual Tour Button - Mobile Top Right - BLURRED */}
          <div className="relative md:hidden">
            <Button 
              disabled
              className="bg-gray-400 hover:bg-gray-400 text-white shadow-lg opacity-50 cursor-not-allowed"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              360° Tour
            </Button>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img
                  src={propertyImages[currentImageIndex] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Virtual Tour Badge - BLURRED */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gray-400 text-white opacity-50">
                    <Clock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Badge>
                </div>
                
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
                {propertyImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === 0 ? propertyImages.length - 1 : currentImageIndex - 1
                      )}
                    >
                      ←
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === propertyImages.length - 1 ? 0 : currentImageIndex + 1
                      )}
                    >
                      →
                    </Button>
                    
                    {/* Image dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {propertyImages.map((_, index) => (
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

                  {/* Food & Furnishing Info - BLURRED */}
                  <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg blur-sm">
                      <div className="flex items-center space-x-3">
                        <Utensils className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-800">Food Included</p>
                          <p className="text-sm text-gray-600">
                            {propertyFeatures.foodIncluded ? 'Yes, meals provided' : 'Not included'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Sofa className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-800">Furnishing</p>
                          <p className="text-sm text-gray-600">{propertyFeatures.furnishing}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                        <p className="text-xs text-gray-600">We'll notify you after the update</p>
                      </div>
                    </div>
                  </div>

                  {/* Sharing Type Selector - BLURRED */}
                  <div className="mb-6 relative">
                    <div className="blur-sm">
                      <h3 className="text-lg font-semibold mb-3">Select Sharing Type</h3>
                      <div className="flex space-x-3">
                        {(['single', 'double', 'triple'] as const).map((type) => (
                          <Button
                            key={type}
                            variant={selectedSharingType === type ? 'default' : 'outline'}
                            className={selectedSharingType === type ? 'bg-gradient-cool text-white' : ''}
                            disabled
                          >
                            {type === 'single' ? 'Single' : type === 'double' ? 'Double' : 'Triple'} Sharing
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-800">Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Status - BLURRED */}
                  <div className="flex items-center justify-between relative">
                    <div className="blur-sm">
                      <span className="text-3xl font-bold text-primary">
                        ₹{pricingData[selectedSharingType].price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <div className="absolute left-0 top-0 flex items-center justify-center">
                      <div className="text-center bg-white/80 rounded px-3 py-1">
                        <Clock className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-800">Coming Soon</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-white">
                      {property.available ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>

                  {/* Tags - BLUR Virtual Tour badge */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      Co-living
                    </Badge>
                    <Badge variant="outline">
                      {property.property_type}
                    </Badge>
                    <div className="relative">
                      <Badge variant="outline" className="blur-sm opacity-50">Virtual Tour</Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                    <div className="relative">
                      <Badge className="bg-green-100 text-green-800 blur-sm opacity-50">
                        <Utensils className="h-3 w-3 mr-1" />
                        Food Included
                      </Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  {property.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{property.rating}</span>
                      </div>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  )}

                  {/* Quick Info Cards - BLUR sharing type and property type */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="relative">
                      <div className="text-center p-3 bg-gradient-cool-light rounded-lg blur-sm">
                        <Users className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                        <p className="text-sm font-medium">Sharing Type</p>
                        <p className="text-xs text-gray-600 capitalize">{selectedSharingType}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gradient-cool-light rounded-lg">
                      <Home className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                      <p className="text-sm font-medium">Property Type</p>
                      <p className="text-xs text-gray-600">{property.property_type}</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-cool-light rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                      <p className="text-sm font-medium">Move-in</p>
                      <p className="text-xs text-gray-600">{property.move_in}</p>
                    </div>
                  </div>

                  {/* Pricing Details with Refundable Deposit - BLURRED */}
                  <div className="mt-6 relative">
                    <div className="p-4 bg-gray-50 rounded-lg blur-sm">
                      <h3 className="text-lg font-semibold mb-3">Pricing Details ({selectedSharingType} sharing)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Rent:</span>
                          <span className="font-medium">₹{pricingData[selectedSharingType].price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="font-medium">₹{pricingData[selectedSharingType].deposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 ml-4">- Refundable Amount:</span>
                          <span className="text-green-600 font-medium">₹{pricingData[selectedSharingType].refundableDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maintenance:</span>
                          <span className="font-medium">₹{pricingData[selectedSharingType].maintenance.toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total Move-in Cost:</span>
                          <span className="text-primary">₹{(pricingData[selectedSharingType].price + pricingData[selectedSharingType].deposit + pricingData[selectedSharingType].maintenance).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                        <p className="text-xs text-gray-600">We'll notify you after the update</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this place</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description || 'No description available for this property.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Furniture List - BLURRED */}
            <Card className="relative">
              <CardContent className="p-6 blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sofa className="h-5 w-5 mr-2" />
                  Furniture & Amenities Included
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propertyFeatures.furniture.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                  <p className="text-xs text-gray-600">We'll notify you after the update</p>
                </div>
              </div>
            </Card>

            {/* Nearby Facilities - BLURRED */}
            <Card className="relative">
              <CardContent className="p-6 blur-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Nearby Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propertyFeatures.nearbyFacilities.map((facility, index) => {
                    const IconComponent = facility.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-800">{facility.name}</p>
                          <p className="text-sm text-gray-600">{facility.distance}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                  <p className="text-xs text-gray-600">We'll notify you after the update</p>
                </div>
              </div>
            </Card>

            {/* Additional Amenities - BLURRED */}
            <Card className="relative">
              <CardContent className="p-6 blur-sm">
                <h3 className="text-lg font-semibold mb-4">Additional Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No additional amenities listed for this property.</p>
                  )}
                </div>
              </CardContent>
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                  <p className="text-xs text-gray-600">We'll notify you after the update</p>
                </div>
              </div>
            </Card>

            {/* House Rules */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">House Rules</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-gray-700">No smoking inside the premises</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-gray-700">No loud music after 10 PM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-gray-700">Guests allowed with prior notice</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Guest Reviews</h3>
                  {property.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{property.rating}</span>
                      </div>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
                
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.user_avatar || `https://images.unsplash.com/photo-1535713875002-d1a27596b850?w=150&h=150&fit=crop&crop=face`}
                            alt={review.user_name}
                            className="w-10 h-10 rounded-full bg-gray-200"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.user_name}</h4>
                              <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews yet for this property.</p>
                  </div>
                )}
                
                {reviews.length > 0 && (
                  <Button variant="outline" className="w-full mt-6">
                    View All Reviews
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Profile */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-cool rounded-full flex items-center justify-center mx-auto">
                    <img 
                      src={property.host_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                      alt={property.host_name} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{property.host_name}</h3>
                    <p className="text-gray-600">Property Host</p>
                  </div>

                  <div className="space-y-2">
                    {!showHostInfo ? (
                      <div className="space-y-2">
                        <Button 
                          onClick={handleRevealHostInfo}
                          className="w-full bg-gradient-cool hover:opacity-90"
                        >
                          Reveal Host Info
                        </Button>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-700 text-center">
                            You can still access host info. We'll notify you after the update.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <a href={`tel:${property.host_phone}`}>
                          <Button variant="outline" className="w-full">
                            <Phone className="h-4 w-4 mr-2" />
                            {property.host_phone || '+91 90000 00000'}
                          </Button>
                        </a>
                        <a href="mailto:host@example.com">
                          <Button variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Host
                          </Button>
                        </a>
                        <a 
                          href={`https://wa.me/${property.host_phone?.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-full bg-green-500 hover:bg-green-600">
                            WhatsApp
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
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
              
              {/* Enhanced Virtual Tour Button - DISABLED */}
              <div className="relative">
                <Button 
                  disabled
                  className="w-full bg-gray-400 hover:bg-gray-400 text-white shadow-lg opacity-50 cursor-not-allowed hidden md:flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Take Virtual Tour - 360°
                </Button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions Dialog */}
        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Terms and Conditions</DialogTitle>
              <DialogDescription>
                Please read and accept the terms before proceeding.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Important Notice</h4>
                <p className="text-sm text-gray-600">
                  LookaroundPG is just a platform that connects users with property hosts. 
                  LookaroundPG is not responsible for any disputes, damages, or issues that may arise 
                  between users and hosts. By proceeding, you acknowledge that any transactions or 
                  agreements are directly between you and the property host.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTermsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleTermsAcceptance} disabled={!termsAccepted}>
                Accept & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Virtual Tour Modal */}
        <Dialog open={showVirtualTourModal} onOpenChange={setShowVirtualTourModal}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Virtual Tour - {property.title}
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="single">Single Sharing</TabsTrigger>
                  <TabsTrigger value="double">Double Sharing</TabsTrigger>
                  <TabsTrigger value="triple">Triple Sharing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="mt-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Single Sharing - Virtual Tour</h3>
                      <p className="text-gray-300">360° view of single occupancy room</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="double" className="mt-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Double Sharing - Virtual Tour</h3>
                      <p className="text-gray-300">360° view of double occupancy room</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="triple" className="mt-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Triple Sharing - Virtual Tour</h3>
                      <p className="text-gray-300">360° view of triple occupancy room</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PropertyDetails;
