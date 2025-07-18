
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storageKey = `wishlist_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      console.log('Loading wishlist for user:', user.id, 'stored data:', stored);
      
      if (stored) {
        try {
          const parsedWishlist = JSON.parse(stored);
          const validWishlist = Array.isArray(parsedWishlist) ? parsedWishlist : [];
          setWishlist(validWishlist);
          console.log('Loaded wishlist:', validWishlist);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    } else {
      // Clear wishlist when user logs out
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = (propertyId: string) => {
    if (!user) {
      console.log('User not logged in, cannot add to wishlist');
      return;
    }
    
    console.log('Adding to wishlist:', propertyId);
    
    if (!wishlist.includes(propertyId)) {
      const newWishlist = [...wishlist, propertyId];
      setWishlist(newWishlist);
      const storageKey = `wishlist_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(newWishlist));
      console.log('Added to wishlist successfully:', propertyId, 'New wishlist:', newWishlist);
    } else {
      console.log('Property already in wishlist:', propertyId);
    }
  };

  const removeFromWishlist = (propertyId: string) => {
    if (!user) {
      console.log('User not logged in, cannot remove from wishlist');
      return;
    }
    
    console.log('Removing from wishlist:', propertyId);
    
    const newWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(newWishlist);
    const storageKey = `wishlist_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newWishlist));
    console.log('Removed from wishlist successfully:', propertyId, 'New wishlist:', newWishlist);
  };

  const isInWishlist = (propertyId: string) => {
    const isInList = wishlist.includes(propertyId);
    console.log('Checking if property in wishlist:', propertyId, 'Result:', isInList, 'Current wishlist:', wishlist);
    return isInList;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
