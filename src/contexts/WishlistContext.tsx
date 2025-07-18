
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

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`wishlist_${user.id}`);
      if (stored) {
        try {
          const parsedWishlist = JSON.parse(stored);
          setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : []);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
          setWishlist([]);
        }
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = (propertyId: string) => {
    if (!user) {
      console.log('User not logged in, cannot add to wishlist');
      return;
    }
    
    if (!wishlist.includes(propertyId)) {
      const newWishlist = [...wishlist, propertyId];
      setWishlist(newWishlist);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
      console.log('Added to wishlist:', propertyId);
    }
  };

  const removeFromWishlist = (propertyId: string) => {
    if (!user) {
      console.log('User not logged in, cannot remove from wishlist');
      return;
    }
    
    const newWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    console.log('Removed from wishlist:', propertyId);
  };

  const isInWishlist = (propertyId: string) => {
    return wishlist.includes(propertyId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
