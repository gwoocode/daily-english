'use client';

import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('gwooeng_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load bookmarks', e);
      }
    }
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      localStorage.setItem('gwooeng_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}