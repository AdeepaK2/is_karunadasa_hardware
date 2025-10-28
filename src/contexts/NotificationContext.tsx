'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationSidebarOpen: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  openNotificationSidebar: () => void;
  closeNotificationSidebar: () => void;
  toggleNotificationSidebar: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Confirmation',
    message: 'Your order #INV-2025-001 has been confirmed and is being processed.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 36), // 36 minutes ago
    isRead: false,
  },
  {
    id: '2',
    title: 'New Product Alert',
    message: 'New power tools have been added to our inventory. Check them out!',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // about 2 hours ago
    isRead: false,
  },
  {
    id: '3',
    title: 'Special Offer',
    message: '20% off on all hand tools this weekend. Limited time offer!',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // about 4 hours ago
    isRead: true,
  },
  {
    id: '4',
    title: 'Account Update',
    message: 'Your profile information has been successfully updated.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
  {
    id: '5',
    title: 'Payment Reminder',
    message: 'You have an outstanding balance of Rs. 500. Please settle your account.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: false,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const openNotificationSidebar = () => {
    setIsNotificationSidebarOpen(true);
  };

  const closeNotificationSidebar = () => {
    setIsNotificationSidebarOpen(false);
  };

  const toggleNotificationSidebar = () => {
    setIsNotificationSidebarOpen(prev => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationSidebarOpen,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        openNotificationSidebar,
        closeNotificationSidebar,
        toggleNotificationSidebar,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}