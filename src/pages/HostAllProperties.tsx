import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Search, Filter, Home, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { AddPropertyModal } from '@/components/modals/AddPropertyModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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

const HostAllProperties = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [properties, setProperties] = useState<DatabaseProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && property.available) ||
                         (filterStatus === 'inactive' && !property.available);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.available).length,
    inactive: properties.filter(p => !p.available).length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  const handleAddProperty = () => {
    setIsAddModalOpen(true);
  };

  const handlePropertyAdded = () => {
    fetchProperties(); // Refresh the properties list
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/host/dashboard')}
              className="font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Properties</h1>
              <p className="text-gray-600">Manage your property listings</p>
            </div>
          </div>
          <Button 
            onClick={handleAddProperty}
            className="bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Home className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={transformProperty(property)} />
              
              {/* Management Overlay */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge variant={property.available ? "default" : "secondary"}>
                  {property.available ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria." 
                  : "Get started by adding your first property listing."}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button 
                  onClick={handleAddProperty}
                  className="bg-gradient-to-r from-[#BF67D6] to-[#DF2C2C] text-white hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handlePropertyAdded}
      />
    </div>
  );
};

export default HostAllProperties;
