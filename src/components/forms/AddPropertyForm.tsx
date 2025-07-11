import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, X } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  price_single: z.number().min(1, 'Single sharing price is required'),
  price_double: z.number().min(1, 'Double sharing price is required'),
  price_triple: z.number().min(1, 'Triple sharing price is required'),
  property_type: z.string().default('PG/Hostel'),
  sharing_type: z.string().default('shared'),
  move_in: z.string().default('Immediate'),
  host_name: z.string().min(1, 'Host name is required'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface AddPropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AMENITY_OPTIONS = [
  'WiFi', 'AC', 'Laundry', 'Meals', 'Security', 'Parking', 'Gym', 
  'Common Area', 'Housekeeping', 'Power Backup', 'Water Supply', 'TV'
];

export const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      price_single: 0,
      price_double: 0,
      price_triple: 0,
      property_type: 'PG/Hostel',
      sharing_type: 'shared',
      move_in: 'Immediate',
      host_name: '',
    },
  });

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add a property",
          variant: "destructive",
        });
        return;
      }

      // Filter out empty image URLs
      const validImages = images.filter(img => img.trim() !== '');

      const propertyData = {
        ...data,
        host_id: user.id,
        amenities: selectedAmenities,
        images: validImages,
        available: true,
        views: 0,
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Property added successfully!",
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter property title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="Enter location"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe your property"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_single">Single Sharing Price (₹) *</Label>
              <Input
                id="price_single"
                type="number"
                {...form.register('price_single', { valueAsNumber: true })}
                placeholder="15000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_double">Double Sharing Price (₹) *</Label>
              <Input
                id="price_double"
                type="number"
                {...form.register('price_double', { valueAsNumber: true })}
                placeholder="12000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_triple">Triple Sharing Price (₹) *</Label>
              <Input
                id="price_triple"
                type="number"
                {...form.register('price_triple', { valueAsNumber: true })}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select onValueChange={(value) => form.setValue('property_type', value)} defaultValue="PG/Hostel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PG/Hostel">PG/Hostel</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Room">Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sharing Type</Label>
              <Select onValueChange={(value) => form.setValue('sharing_type', value)} defaultValue="shared">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Move-in</Label>
              <Select onValueChange={(value) => form.setValue('move_in', value)} defaultValue="Immediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="Within 1 week">Within 1 week</SelectItem>
                  <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="host_name">Host Name *</Label>
            <Input
              id="host_name"
              {...form.register('host_name')}
              placeholder="Enter host name"
            />
            {form.formState.errors.host_name && (
              <p className="text-sm text-red-500">{form.formState.errors.host_name.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Property Images</Label>
              <Button type="button" onClick={addImageField} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
            <div className="space-y-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  {images.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeImageField(index)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Property
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
