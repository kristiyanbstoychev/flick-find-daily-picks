
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const DAILY_LIMIT = 25;
const STORAGE_KEY = 'moviePickerData';

interface MoviePickerData {
  count: number;
  lastResetDate: string;
}

export const useMovieLimit = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);

  const getTodayString = () => {
    return new Date().toDateString();
  };

  const loadStoredData = async () => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      
      if (value) {
        const data: MoviePickerData = JSON.parse(value);
        const today = getTodayString();
        
        if (data.lastResetDate !== today) {
          // Reset count for new day
          const newData: MoviePickerData = {
            count: 0,
            lastResetDate: today
          };
          await Preferences.set({
            key: STORAGE_KEY,
            value: JSON.stringify(newData)
          });
          setClickCount(0);
          setIsLimitReached(false);
        } else {
          // Same day, use stored count
          setClickCount(data.count);
          setIsLimitReached(data.count >= DAILY_LIMIT);
        }
      } else {
        // First time user
        const newData: MoviePickerData = {
          count: 0,
          lastResetDate: getTodayString()
        };
        await Preferences.set({
          key: STORAGE_KEY,
          value: JSON.stringify(newData)
        });
        setClickCount(0);
        setIsLimitReached(false);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      setClickCount(0);
      setIsLimitReached(false);
    } finally {
      setLoading(false);
    }
  };

  const incrementCount = async () => {
    if (isLimitReached) return;

    const newCount = clickCount + 1;
    const newData: MoviePickerData = {
      count: newCount,
      lastResetDate: getTodayString()
    };

    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(newData)
      });
      setClickCount(newCount);
      setIsLimitReached(newCount >= DAILY_LIMIT);
    } catch (error) {
      console.error('Error saving count:', error);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return {
    clickCount,
    isLimitReached,
    loading,
    incrementCount,
    remainingClicks: Math.max(0, DAILY_LIMIT - clickCount)
  };
};
