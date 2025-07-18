
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Shield, Search, Star, Users } from 'lucide-react';
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

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<DatabaseProperty[]>([]);
  const [trendingProperties, setTrendingProperties] = useState<DatabaseProperty[]>([]);

  useEffect(() => {
    fetchFeaturedProperties();
    fetchTrendingProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .eq('available', true)
        .limit(6);

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    }
  };

  const fetchTrendingProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('trending', true)
        .eq('available', true)
        .limit(6);

      if (error) throw error;
      setTrendingProperties(data || []);
    } catch (error) {
      console.error('Error fetching trending properties:', error);
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

  const features = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All listings are verified for safety and authenticity'
    },
    {
      icon: Search,
      title: 'Transparent Pricing',
      description: 'No hidden fees, clear pricing for all amenities'
    },
    {
      icon: Users,
      title: 'Trusted Hosts',
      description: 'Connect with verified, responsive property owners'
    },
    {
      icon: Star,
      title: 'Easy Booking',
      description: 'Simple process to find and secure your accommodation'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp">
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] bg-clip-text text-transparent">
                PG Home
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Discover safe, comfortable, and affordable paying guest accommodations
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-scaleIn" style={{animationDelay: '0.4s'}}>
              <SearchBar />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-600">Happy Tenants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LookaroundPG?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding the perfect PG accommodation simple, safe, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#BF67D6] to-[#DF2C2C] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Featured Properties
                </h2>
                <p className="text-gray-600">
                  Handpicked accommodations with excellent ratings
                </p>
              </div>
              <Link to="/explore">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {featuredProperties.map((property, index) => (
                  <div 
                    key={property.id}
                    className="flex-shrink-0 w-80 animate-fadeInUp"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <PropertyCard property={transformProperty(property)} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <PropertyCard property={transformProperty(property)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Properties Section */}
      {trendingProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Trending Now
                </h2>
                <p className="text-gray-600">
                  Popular properties that are booking fast
                </p>
              </div>
              <Link to="/explore">
                <Button variant="outline">Explore More</Button>
              </Link>
            </div>
            
            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {trendingProperties.map((property, index) => (
                  <div 
                    key={property.id}
                    className="flex-shrink-0 w-80 animate-fadeInUp"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <PropertyCard property={transformProperty(property)} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProperties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <PropertyCard property={transformProperty(property)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Own a Property? Partner with Us
          </h2>
          <p className="text-xl text-white/90 mb-8">
            List your PG and connect with thousands of potential tenants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/partner">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                List Your Property
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-[#BF67D6]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
