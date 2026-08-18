import { useState, useEffect } from 'react';

const MENU_ITEMS = [
  {
    id: '1',
    name: 'The Rusty Special',
    description: 'Slow-roasted beef, caramelized onions, horseradish cream on sourdough',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=800&q=80',
    category: 'signature'
  },
  {
    id: '2',
    name: 'Chicken Schnitzel',
    description: 'Crispy chicken breast, lettuce, tomato, aioli on Turkish bread',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80',
    category: 'classics'
  },
  {
    id: '3',
    name: 'Pulled Pork',
    description: '12-hour smoked pork, coleslaw, BBQ sauce on brioche bun',
    price: 13.00,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
    category: 'signature'
  },
  {
    id: '4',
    name: 'Veggie Delight',
    description: 'Grilled haloumi, roasted capsicum, spinach, pesto on focaccia',
    price: 10.50,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    category: 'vegetarian'
  },
  {
    id: '5',
    name: 'Caprese Panini',
    description: 'Fresh mozzarella, heirloom tomatoes, basil, balsamic glaze',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    category: 'vegetarian'
  },
  {
    id: '6',
    name: 'Club Sandwich',
    description: 'Triple-decker with turkey, bacon, lettuce, tomato, mayo',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bd7442?w=800&q=80',
    category: 'classics'
  },
  {
    id: '7',
    name: 'Breakfast Bagel',
    description: 'Smoked salmon, cream cheese, capers, red onion on sesame bagel',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=800&q=80',
    category: 'breakfast'
  },
  {
    id: '8',
    name: 'Avocado Toast',
    description: 'Smashed avocado, poached egg, dukkah, microgreens on sourdough',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=800&q=80',
    category: 'breakfast'
  }
];

export function useMenu() {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMenuItems = (category) => {
    if (category && category !== 'all') {
      return menuItems.filter(item => item.category === category);
    }
    return menuItems;
  };

  const getItemById = (id) => {
    return menuItems.find(item => item.id === id);
  };

  const categories = ['all', 'signature', 'classics', 'vegetarian', 'breakfast'];

  return {
    menuItems,
    loading,
    error,
    getMenuItems,
    getItemById,
    categories
  };
}
