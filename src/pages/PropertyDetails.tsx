import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { MapPin, Heart, User, Star, Phone, Mail, ArrowLeft, Eye, Calendar, Users, Home, Play, Loader2, Utensils, Sofa, Car, Train, ShoppingBag, Hospital, Clock, Shield, Wifi, Camera, MessageCircle, MapIcon, Navigation } from 'lucide-react';
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

  // Enhanced data for new features
  const propertyFeatures = {
    foodIncluded: true,
    furnishing: 'Fully Furnished',
    furniture: [
      'Single Bed with Premium Mattress',
      'Ergonomic Study Table & Chair',
      'Spacious Wardrobe',
      'Bedside Table with Drawer',
      'Full-Length Mirror',
      'High-Speed Ceiling Fan',
      'Blackout Window Curtains',
      'Reading Lamp'
    ],
    nearbyFacilities: [
      { name: 'Metro Station', distance: '0.5 km', icon: Train, time: '5 min walk', color: 'text-blue-600' },
      { name: 'Shopping Mall', distance: '2 km', icon: ShoppingBag, time: '15 min drive', color: 'text-purple-600' },
      { name: 'Multi-Specialty Hospital', distance: '1.5 km', icon: Hospital, time: '10 min drive', color: 'text-red-600' },
      { name: 'Bus Stop', distance: '200 m', icon: Car, time: '2 min walk', color: 'text-green-600' },
      { name: 'ATM & Bank', distance: '300 m', icon: MapPin, time: '3 min walk', color: 'text-yellow-600' },
      { name: 'Supermarket', distance: '500 m', icon: ShoppingBag, time: '5 min walk', color: 'text-indigo-600' }
    ],
    safetyFeatures: [
      'CCTV Surveillance',
      '24/7 Security Guard',
      'Biometric Entry',
      'Well-lit Premises',
      'Emergency Contact System',
      'Fire Safety Equipment'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <Loader2 className="h-8 w-8 animate-spin absolute top-6 left-6 text-blue-600" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading amazing property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Property not found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for might have been removed or doesn't exist.</p>
          <Button onClick={() => navigate('/explore')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
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

  // Pricing data based on sharing type
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

  // Enhanced image data
  const propertyImages = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          
          {/* Enhanced Virtual Tour Button - Mobile */}
          <div className="relative md:hidden">
            <Button 
              disabled
              className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg opacity-60 cursor-not-allowed"
              size="sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              360° Tour
            </Button>
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Soon
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Spans 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Enhanced Image Gallery */}
            <Card className="overflow-hidden shadow-xl bg-white">
              <AspectRatio ratio={16 / 9}>
                <div className="relative w-full h-full group">
                  <img
                    src={propertyImages[currentImageIndex] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Enhanced Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      <Eye className="h-3 w-3 mr-1" />
                      {property.views} views
                    </Badge>
                    {propertyFeatures.foodIncluded && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                        <Utensils className="h-3 w-3 mr-1" />
                        Meals Included
                      </Badge>
                    )}
                  </div>
                  
                  {/* Enhanced Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-4 right-4 p-3 h-12 w-12 bg-white/90 hover:bg-white shadow-lg transition-all duration-200 ${
                      isInWishlist ? 'text-red-500 bg-red-50' : 'text-gray-600'
                    }`}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {/* Enhanced Navigation */}
                  {propertyImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg w-12 h-12 rounded-full"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === 0 ? propertyImages.length - 1 : currentImageIndex - 1
                        )}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg w-12 h-12 rounded-full"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === propertyImages.length - 1 ? 0 : currentImageIndex + 1
                        )}
                      >
                        <ArrowLeft className="h-5 w-5 rotate-180" />
                      </Button>
                      
                      {/* Enhanced Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {propertyImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index === currentImageIndex 
                                ? 'bg-white shadow-lg scale-125' 
                                : 'bg-white/60 hover:bg-white/80'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </AspectRatio>
            </Card>

            {/* Enhanced Property Header */}
            <Card className="shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Title and Location */}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 text-lg">
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{property.location}</span>
                    </div>
                  </div>

                  {/* Enhanced Tags */}
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      Co-living Space
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 px-4 py-2 text-sm">
                      <Home className="h-4 w-4 mr-2" />
                      {property.property_type}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Verified Property
                    </Badge>
                  </div>

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{pricingData[selectedSharingType].price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2 text-lg">/month</span>
                      <div className="text-sm text-gray-500 mt-1">Starting from single sharing</div>
                    </div>
                    {property.rating && (
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          <Star className="h-6 w-6 text-yellow-400 fill-current mr-1" />
                          <span className="text-2xl font-bold text-gray-900">{property.rating}</span>
                        </div>
                        <span className="text-gray-600 text-sm">({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm font-medium text-gray-700">Move-in</p>
                      <p className="text-lg font-semibold text-blue-600">{property.move_in}</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-medium text-gray-700">Sharing</p>
                      <p className="text-lg font-semibold text-purple-600 capitalize">Available</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <p className="text-lg font-semibold text-green-600">
                        {property.available ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">About this place</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {property.description || 'Experience comfortable co-living in this beautifully designed space. Perfect for students and young professionals looking for a vibrant community and modern amenities.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Location & Map */}
            <Card className="shadow-lg bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
                  <MapIcon className="h-6 w-6 mr-3 text-blue-600" />
                  Location & Connectivity
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Enhanced Map */}
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden shadow-inner">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapIcon className="h-16 w-16 text-blue-500 mx-auto mb-4 opacity-50" />
                          <p className="text-gray-600 font-medium">Interactive Map</p>
                          <p className="text-sm text-gray-500">Click to explore the area</p>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-blue-600 shadow-lg">
                          <Navigation className="h-3 w-3 mr-1" />
                          Prime Location
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-red-500 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">{property.location}</p>
                          <p className="text-sm text-gray-600">Exact location shown after booking</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Area
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Nearby Facilities */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">What's Nearby</h4>
                    <div className="space-y-3">
                      {propertyFeatures.nearbyFacilities.map((facility, index) => {
                        const IconComponent = facility.icon;
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                                <IconComponent className={`h-5 w-5 ${facility.color}`} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{facility.name}</p>
                                <p className="text-sm text-gray-600">{facility.time}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {facility.distance}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Amenities */}
            <Card className="shadow-lg bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
                  <Sofa className="h-6 w-6 mr-3 text-blue-600" />
                  Amenities & Features
                </h3>
                
                <Tabs defaultValue="furniture" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="furniture">Furniture</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="safety">Safety</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="furniture" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyFeatures.furniture.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 font-medium">{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-8 text-center text-gray-500">
                          <Sofa className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No additional amenities listed for this property.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="safety" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {propertyFeatures.safetyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Enhanced Reviews Section */}
            <Card className="shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Guest Reviews</h3>
                  {property.rating && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                        <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
                        <span className="text-xl font-bold text-gray-900">{property.rating}</span>
                      </div>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
                
                {reviewsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage 
                              src={review.user_avatar || `https://images.unsplash.com/photo-1535713875002-d1a27596b850?w=150&h=150&fit=crop&crop=face`} 
                              alt={review.user_name} 
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {review.user_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                              <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                            </div>
                            <div className="flex items-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 text-lg">No reviews yet for this property.</p>
                    <p className="text-gray-500 text-sm mt-2">Be the first to share your experience!</p>
                  </div>
                )}
                
                {reviews.length > 3 && (
                  <Button variant="outline" className="w-full mt-6 border-blue-200 text-blue-600 hover:bg-blue-50">
                    View All {reviews.length} Reviews
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar - Spans 1 column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Enhanced Host Profile */}
            <Card className="shadow-xl bg-white sticky top-6">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Host Avatar */}
                  <div className="relative">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={property.host_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                        alt={property.host_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                        {property.host_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <Shield className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Host Info */}
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{property.host_name}</h3>
                    <p className="text-gray-600">Verified Property Host</p>
                    <div className="flex items-center justify-center mt-2">
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Host
                      </Badge>
                    </div>
                  </div>

                  {/* Host Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">4.8</p>
                      <p className="text-xs text-gray-500">Host Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">50+</p>
                      <p className="text-xs text-gray-500">Properties</p>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="space-y-3">
                    {!showHostInfo ? (
                      <div className="space-y-3">
                        <Button 
                          onClick={handleRevealHostInfo}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Reveal Contact Info
                        </Button>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-blue-700 text-center">
                            Get instant access to host contact details
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <a href={`tel:${property.host_phone}`}>
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg">
                            <Phone className="h-4 w-4 mr-2" />
                            {property.host_phone || '+91 90000 00000'}
                          </Button>
                        </a>
                        <a href="mailto:host@example.com">
                          <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Host
                          </Button>
                        </a>
                        <a 
                          href={`https://wa.me/${property.host_phone?.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp Chat
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleWishlistToggle}
                variant="outline" 
                className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-lg"
                size="lg"
              >
                <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              
              {/* Enhanced Virtual Tour Button */}
              <div className="relative">
                <Button 
                  disabled
                  className="w-full bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg opacity-60 cursor-not-allowed"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Take Virtual Tour - 360°
                </Button>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                size="lg"
              >
                Book Now
              </Button>
            </div>

            {/* Enhanced Safety Info */}
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety & Security
                </h4>
                <div className="space-y-3">
                  {propertyFeatures.safetyFeatures.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-green-600 hover:text-green-700">
                    View All Safety Features
                  </Button>
                </div>
              </CardContent>
            </Card>
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
