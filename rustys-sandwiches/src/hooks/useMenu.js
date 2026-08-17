import { useState, useEffect } from 'react';
import { fetchCatalog } from '../api/square';

export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const data = await fetchCatalog();
        
        const items = data.objects?.filter(obj => obj.item_data) || [];
        const cats = data.objects?.filter(obj => obj.category_data) || [];
        
        setMenuItems(items);
        setCategories(cats);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  return { menuItems, categories, loading, error };
}

export function useMenuItem(slug) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const data = await fetchCatalog();
        
        const found = data.objects?.find(obj => 
          obj.item_data && 
          (obj.item_data.name.toLowerCase().replace(/\s+/g, '-') === slug ||
           obj.id === slug)
        );
        
        setItem(found || null);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [slug]);

  return { item, loading, error };
}
