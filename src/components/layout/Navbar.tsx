
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Search, Heart, User, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-cool rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-charcoal">LookaroundPG</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search for PGs, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/explore">
              <Button variant="ghost" className="text-charcoal hover:text-primary">
                Explore
              </Button>
            </Link>
            
            {/* Wishlist Icon - Always visible when user is logged in */}
            {user && (
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="relative text-charcoal hover:text-primary">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-cool text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-charcoal hover:text-primary">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-cool hover:opacity-90 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Wishlist Icon */}
            {user && (
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="relative text-charcoal">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-charcoal"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for PGs, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </form>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 top-full w-full bg-white border-t shadow-lg z-40 animate-fadeInUp">
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/explore"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <Search className="w-5 h-5 mr-3 text-primary" />
                Explore Properties
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3 text-primary" />
                      My Wishlist
                    </div>
                    {wishlist.length > 0 && (
                      <Badge className="bg-gradient-cool text-white">
                        {wishlist.length}
                      </Badge>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    <User className="w-5 h-5 mr-3 text-primary" />
                    My Profile
                  </Link>
                  <div className="border-t pt-3">
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-3">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-cool text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 pt-3 border-t">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start h-12 text-base font-medium">
                      <User className="w-5 h-5 mr-3" />
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-cool hover:opacity-90 text-white h-12 text-base font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
