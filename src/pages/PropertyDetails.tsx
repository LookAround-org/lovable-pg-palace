import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Heart, User, Star, Phone, Mail, ArrowLeft, Eye, Calendar, Users, Home, Play } from 'lucide-react';
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
  const [selectedSharingType, setSelectedSharingType] = useState<'single' | 'double' | 'triple'>('single');
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
  
  const property = mockProperties.find(p => p.id === id);
  
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

  // Pricing data based on sharing type
  const pricingData = {
    single: { price: property?.price || 0, deposit: 5000, maintenance: 1000 },
    double: { price: Math.floor((property?.price || 0) * 0.7), deposit: 4000, maintenance: 800 },
    triple: { price: Math.floor((property?.price || 0) * 0.5), deposit: 3000, maintenance: 600 }
  };

  // Image data based on sharing type (mock URLs)
  const sharingImages = {
    single: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    double: [
      'https://images.unsplash.com/photo-1631049421450-348c649a7be3?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    triple: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1631049421450-348c649a7be3?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ]
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success text-white';
      case 'limited': return 'bg-warning text-white';
      case 'full': return 'bg-destructive text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent PG with all amenities. The host is very responsive and the location is perfect for my office commute.",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      rating: 4,
      date: "1 month ago", 
      comment: "Good facilities and clean rooms. WiFi speed could be better but overall satisfied with the stay.",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Sneha Patel",
      rating: 5,
      date: "2 months ago",
      comment: "Amazing place! Feels like home. The food is delicious and the common areas are well maintained.",
      avatar: "/placeholder.svg"
    }
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
          
          {/* Virtual Tour Button - Mobile Top Right */}
          {property.virtualTour && (
            <Button 
              onClick={() => setShowVirtualTourModal(true)}
              className="md:hidden bg-gradient-cool hover:opacity-90 text-white shadow-lg animate-pulse"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              360° Tour
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10]">
                <img
                  src={sharingImages[selectedSharingType][currentImageIndex] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Virtual Tour Badge */}
                {property.virtualTour && (
                  <Badge className="absolute top-4 left-4 bg-gradient-cool text-white animate-pulse">
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
                {sharingImages[selectedSharingType].length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === 0 ? sharingImages[selectedSharingType].length - 1 : currentImageIndex - 1
                      )}
                    >
                      ←
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === sharingImages[selectedSharingType].length - 1 ? 0 : currentImageIndex + 1
                      )}
                    >
                      →
                    </Button>
                    
                    {/* Image dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {sharingImages[selectedSharingType].map((_, index) => (
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

                  {/* Sharing Type Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Sharing Type</h3>
                    <div className="flex space-x-3">
                      {(['single', 'double', 'triple'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={selectedSharingType === type ? 'default' : 'outline'}
                          onClick={() => {
                            setSelectedSharingType(type);
                            setCurrentImageIndex(0);
                          }}
                          className={selectedSharingType === type ? 'bg-gradient-cool text-white' : ''}
                        >
                          {type === 'single' ? 'Single' : type === 'double' ? 'Double' : 'Triple'} Sharing
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-primary">
                        ₹{pricingData[selectedSharingType].price.toLocaleString()}
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

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-gradient-cool-light rounded-lg">
                      <Users className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                      <p className="text-sm font-medium">Sharing Type</p>
                      <p className="text-xs text-gray-600 capitalize">{selectedSharingType}</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-cool-light rounded-lg">
                      <Home className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                      <p className="text-sm font-medium">Property Type</p>
                      <p className="text-xs text-gray-600">PG/Hostel</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-cool-light rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-gradient-cool" />
                      <p className="text-sm font-medium">Move-in</p>
                      <p className="text-xs text-gray-600">Immediate</p>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={`https://images.unsplash.com/photo-${1535713875002 + review.id * 1000}-d1a27596b850?w=150&h=150&fit=crop&crop=face`}
                          alt={review.name}
                          className="w-10 h-10 rounded-full bg-gray-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{review.name}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
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
                
                <Button variant="outline" className="w-full mt-6">
                  View All Reviews
                </Button>
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
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                      alt={property.hostName} 
                      className="w-full h-full rounded-full object-cover" 
                    />
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
                        className="w-full bg-gradient-cool hover:opacity-90"
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

                  <Link to={`/host/properties/${property.hostId}`}>
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
              
              {/* Enhanced Virtual Tour Button */}
              {property.virtualTour && (
                <Button 
                  onClick={() => setShowVirtualTourModal(true)}
                  className="w-full bg-gradient-cool hover:opacity-90 text-white shadow-lg transform transition-all duration-200 hover:scale-105 hidden md:flex items-center justify-center animate-pulse"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Take Virtual Tour - 360°
                </Button>
              )}
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
