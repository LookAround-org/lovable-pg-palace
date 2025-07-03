
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, User, Star, Phone, Mail, MapPin, Home } from 'lucide-react';
import { mockProperties } from '@/data/mockData';

const HostProperties = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  
  // Find host properties (in real app, this would be an API call)
  const hostProperties = mockProperties.filter(p => p.hostId === hostId);
  const hostInfo = hostProperties[0]; // Get host info from first property
  
  if (!hostInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Host not found</h1>
          <Button onClick={() => navigate('/explore')}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 dark:text-white dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Host Profile Section */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Host Avatar */}
              <div className="w-24 h-24 bg-gradient-cool rounded-full flex items-center justify-center flex-shrink-0">
                {hostInfo.hostAvatar ? (
                  <img 
                    src={hostInfo.hostAvatar} 
                    alt={hostInfo.hostName} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>

              {/* Host Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                      {hostInfo.hostName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Property Host</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{hostProperties.length} Properties</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Bangalore</span>
                      </div>
                    </div>
                  </div>
                  
                  {hostInfo.rating && (
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold dark:text-white">{hostInfo.rating}</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ({hostInfo.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Host Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-cool-light dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gradient-cool dark:text-white">5+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Years Hosting</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-cool-light dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gradient-cool dark:text-white">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Response Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-cool-light dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gradient-cool dark:text-white">2hrs</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Response Time</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-cool-light dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gradient-cool dark:text-white">4.8</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-cool text-white hover:opacity-90">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Host
                  </Button>
                  <Button variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600 border-green-500">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
            All Properties by {hostInfo.hostName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {hostProperties.length} properties available
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostProperties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-fadeInUp"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostProperties;
