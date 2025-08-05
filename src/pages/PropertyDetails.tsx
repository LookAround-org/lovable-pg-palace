
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { MapPin, Heart, Star, Phone, Mail, ArrowLeft, Users, Home, Loader2, Utensils, Sofa, Car, Train, ShoppingBag, Hospital, Shield, Wifi, Camera, MessageCircle, MapIcon, Navigation, Grid3X3, Share, Calendar, CheckCircle2 } from 'lucide-react';
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
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Enhanced data for new features
  const propertyFeatures = {
    amenities: [
      { icon: Wifi, name: 'Free WiFi' },
      { icon: Car, name: 'Free parking' },
      { icon: Utensils, name: 'Kitchen' },
      { icon: Sofa, name: 'Living area' },
    ],
    nearbyFacilities: [
      { name: 'Metro Station', distance: '0.5 km', icon: Train, time: '5 min walk' },
      { name: 'Shopping Mall', distance: '2 km', icon: ShoppingBag, time: '15 min drive' },
      { name: 'Hospital', distance: '1.5 km', icon: Hospital, time: '10 min drive' },
      { name: 'Bus Stop', distance: '200 m', icon: Car, time: '2 min walk' },
    ],
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/explore')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
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

  // Enhanced image data
  const propertyImages = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleWishlistToggle}
              className="text-gray-600"
            >
              <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-4">
            {property.rating && (
              <div className="flex items-center mr-4">
                <Star className="h-4 w-4 text-black fill-current mr-1" />
                <span className="font-medium text-black">{property.rating}</span>
                <span className="mx-1">·</span>
                <button className="underline font-medium text-black">
                  {reviews.length} reviews
                </button>
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <button className="underline font-medium text-black">
                {property.location}
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[60vh] max-h-[500px]">
            {/* Main Image */}
            <div className="col-span-4 md:col-span-2 relative">
              <img
                src={propertyImages[0] || '/placeholder.svg'}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
            
            {/* Side Images - Hidden on Mobile */}
            <div className="hidden md:grid col-span-2 grid-cols-2 gap-2">
              {propertyImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                  {index === 3 && propertyImages.length > 5 && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                      onClick={() => setShowAllPhotos(true)}
                    >
                      <div className="text-white text-center">
                        <Grid3X3 className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Show all photos</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Show All Photos Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden absolute bottom-4 right-4 bg-white"
              onClick={() => setShowAllPhotos(true)}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Show all photos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Entire {property.property_type} in {property.location.split(',')[0]}
                  </h2>
                  <p className="text-gray-600">
                    3 guests · 1 bedroom · 2 beds · 1 bathroom
                  </p>
                </div>
                <Avatar className="w-14 h-14">
                  <AvatarImage 
                    src={property.host_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                    alt={property.host_name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-semibold">
                    {property.host_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Host Section */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <div className="flex items-start space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={property.host_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                    alt={property.host_name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                    {property.host_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Hosted by {property.host_name}</h3>
                  <p className="text-gray-600 text-sm">Superhost · 2 years hosting</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-black fill-current mr-1" />
                      <span className="font-medium">4.9</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">127</span>
                      <span className="text-gray-600 ml-1">Reviews</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-gray-600">Identity verified</span>
                    </div>
                  </div>
                  {!showHostInfo ? (
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={handleRevealHostInfo}
                    >
                      Contact host
                    </Button>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <a href={`tel:${property.host_phone}`}>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Phone className="h-4 w-4 mr-2" />
                          {property.host_phone || '+91 90000 00000'}
                        </Button>
                      </a>
                      <a href="mailto:host@example.com">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <p className="text-gray-700 leading-relaxed">
                {property.description || 'Experience comfortable co-living in this beautifully designed space. Perfect for students and young professionals looking for a vibrant community and modern amenities.'}
              </p>
            </div>

            {/* What this place offers */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertyFeatures.amenities.map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 py-2">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  );
                })}
                {property.amenities && property.amenities.slice(0, 6).map((amenity, index) => (
                  <div key={index + 4} className="flex items-center space-x-4 py-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Where you'll be</h3>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive map</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{property.location}</p>
              
              {/* Nearby facilities */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">What's nearby</h4>
                {propertyFeatures.nearbyFacilities.map((facility, index) => {
                  const IconComponent = facility.icon;
                  return (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">{facility.name}</span>
                      </div>
                      <span className="text-gray-600 text-sm">{facility.distance}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-black fill-current mr-2" />
                <span className="text-xl font-semibold text-gray-900">
                  {property.rating} · {reviews.length} reviews
                </span>
              </div>
              
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.slice(0, 6).map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage 
                            src={review.user_avatar || `https://images.unsplash.com/photo-1535713875002-d1a27596b850?w=150&h=150&fit=crop&crop=face`} 
                            alt={review.user_name} 
                          />
                          <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">
                            {review.user_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{review.user_name}</p>
                          <p className="text-sm text-gray-600">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
              
              {reviews.length > 6 && (
                <Button variant="outline" className="mt-6">
                  Show all {reviews.length} reviews
                </Button>
              )}
            </div>
          </div>

          {/* Booking Card - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-semibold">₹{property.price_single.toLocaleString()}</span>
                      <span className="text-gray-600 ml-1">night</span>
                    </div>
                    {property.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-black fill-current mr-1" />
                        <span className="font-medium text-sm">{property.rating}</span>
                        <span className="text-gray-600 text-sm mx-1">·</span>
                        <button className="text-gray-600 text-sm underline">
                          {reviews.length} reviews
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 border border-gray-300 rounded-lg">
                      <div className="p-3 border-r border-gray-300">
                        <label className="block text-xs font-medium text-gray-900 mb-1">CHECK-IN</label>
                        <input 
                          type="date" 
                          className="w-full text-sm bg-transparent border-none p-0 focus:ring-0"
                        />
                      </div>
                      <div className="p-3">
                        <label className="block text-xs font-medium text-gray-900 mb-1">CHECKOUT</label>
                        <input 
                          type="date" 
                          className="w-full text-sm bg-transparent border-none p-0 focus:ring-0"
                        />
                      </div>
                    </div>
                    
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-900 mb-1">GUESTS</label>
                      <select className="w-full text-sm bg-transparent border-none p-0 focus:ring-0">
                        <option>1 guest</option>
                        <option>2 guests</option>
                        <option>3 guests</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg mb-4"
                    size="lg"
                  >
                    Reserve
                  </Button>

                  <p className="text-center text-gray-600 text-sm mb-4">
                    You won't be charged yet
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">₹{property.price_single.toLocaleString()} x 5 nights</span>
                      <span>₹{(property.price_single * 5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">Cleaning fee</span>
                      <span>₹1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">Service fee</span>
                      <span>₹2,000</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{(property.price_single * 5 + 1500 + 2000).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
      </div>
    </div>
  );
};

export default PropertyDetails;
