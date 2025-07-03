
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Partner = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const benefits = [
    {
      icon: Users,
      title: 'Wide Reach',
      description: 'Access to thousands of potential tenants across India'
    },
    {
      icon: Star,
      title: 'Verified Listings',
      description: 'Get your property verified and build trust with tenants'
    },
    {
      icon: TrendingUp,
      title: 'Higher Occupancy',
      description: 'Increase your property occupancy rates significantly'
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Simple tools to manage inquiries and bookings'
    }
  ];

  const features = [
    'Free property listing',
    'Professional photography support',
    'Dedicated account manager',
    'Real-time inquiry notifications',
    'Analytics and insights dashboard',
    'Marketing support and promotion'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Application submitted!",
      description: "We'll get back to you within 24 hours to discuss partnership opportunities.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyType: '',
      location: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Partner with FindMyPG
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            List your PG property and connect with thousands of potential tenants
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">95%</div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">24hrs</div>
              <div className="text-sm text-gray-600">Average Response</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Information */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-6">
                Why Partner with Us?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>What You Get</span>
                </CardTitle>
                <CardDescription>
                  Everything you need to succeed as a partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 italic mb-2">
                      "Since partnering with FindMyPG, our occupancy rate increased from 70% to 95%. 
                      The platform brings quality tenants and the support team is excellent."
                    </p>
                    <div className="text-sm">
                      <span className="font-semibold">Rajesh Kumar</span>
                      <span className="text-gray-600"> - Property Owner, Bangalore</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Application Form */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Start Your Partnership</CardTitle>
                <CardDescription>
                  Fill out this form and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Input
                      id="propertyType"
                      placeholder="e.g., Men's PG, Women's PG, Co-living"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Property Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Koramangala, Bangalore"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your property, number of rooms, amenities, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Have questions? Call us at{' '}
                    <a href="tel:+919876543210" className="text-primary font-medium">
                      +91 98765 43210
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
