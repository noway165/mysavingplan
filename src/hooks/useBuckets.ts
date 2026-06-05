import { useState, useEffect } from 'react';

export interface VirtualBucket {
  id: string;
  name: string;
  percentage: number;
  balance: number;
}

const DEFAULT_BUCKETS: VirtualBucket[] = [
  { id: 'savings', name: 'Tiết kiệm', percentage: 50, balance: 0 },
  { id: 'emergency', name: 'Khẩn cấp', percentage: 25, balance: 0 },
  { id: 'investment', name: 'Đầu tư', percentage: 15, balance: 0 },
  { id: 'leisure', name: 'Giải trí', percentage: 10, balance: 0 }
];

export function useBuckets() {
  const [buckets, setBuckets] = useState<VirtualBucket[]>(DEFAULT_BUCKETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mysavings_buckets');
    if (saved) {
      try {
        setBuckets(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing buckets", e);
      }
    }
    setLoading(false);
  }, []);

  const saveBuckets = (newBuckets: VirtualBucket[]) => {
    setBuckets(newBuckets);
    localStorage.setItem('mysavings_buckets', JSON.stringify(newBuckets));
  };

  const allocateLeftover = (amount: number) => {
    if (amount <= 0) return;
    
    const newBuckets = buckets.map(b => {
      const allocatedAmount = (amount * b.percentage) / 100;
      return {
        ...b,
        balance: b.balance + allocatedAmount
      };
    });
    
    saveBuckets(newBuckets);
  };

  const updateBucketPercentage = (id: string, newPercentage: number) => {
    const newBuckets = buckets.map(b => 
      b.id === id ? { ...b, percentage: newPercentage } : b
    );
    saveBuckets(newBuckets);
  };

  return {
    buckets,
    loading,
    allocateLeftover,
    updateBucketPercentage,
    totalBucketBalance: buckets.reduce((sum, b) => sum + b.balance, 0)
  };
}
