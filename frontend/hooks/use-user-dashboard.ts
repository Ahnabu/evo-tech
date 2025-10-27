'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { createAxiosClientWithSession } from '@/utils/axios/axiosClient';
import { User, Order, UserDashboardStats } from '@/types';

export const useUserDashboard = () => {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

        const axiosInstance = createAxiosClientWithSession(session);
        
        const response = await axiosInstance.get('/users/dashboard/stats');
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Fallback to mock data if API fails
        const mockStats: UserDashboardStats = {
          totalOrders: 0,
          totalSpent: 0,
          recentOrders: [],
          rewardPoints: session.user.reward_points || 0,
          memberSince: new Date(),
        };
        setDashboardData(mockStats);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
  }, [session]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error };
};

export const useUserProfile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setLoading(false);  
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Create profile from session data
        const profileData: User = {
          uuid: session.user.id || '',
          userType: (session.user.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
          firstName: session.user.firstName || '',
          lastName: session.user.lastName || '',
          email: session.user.email || '',
          phone: session.user.phone || undefined,
          rewardPoints: session.user.reward_points || 0,
          newsletterOptIn: session.user.newsletter_opt_in || false,
          isActive: true,
        };

        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, refreshKey]);

  const refreshProfile = () => setRefreshKey(prev => prev + 1);

  return { profile, loading, error, refreshProfile };
};

export const useUserOrders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use client-side axios with session token
        const createAxiosClient = (await import('@/utils/axios/axiosClient')).default;
        const axiosInstance = await createAxiosClient();
        
        const response = await axiosInstance.get('/users/dashboard/orders');
        
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Fallback to empty array if API fails
        setOrders([]);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  return { orders, loading, error };
};