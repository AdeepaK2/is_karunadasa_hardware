'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { X, Bell, CheckCircle, AlertCircle, AlertTriangle, Info, Package, CreditCard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationSidebar() {
  const {
    notifications,
    unreadCount,
    isNotificationSidebarOpen,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    closeNotificationSidebar,
  } = useNotifications();

  if (!isNotificationSidebarOpen) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={closeNotificationSidebar}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-750">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Mark all read
              </button>
            )}
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <button
              onClick={clearAllNotifications}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <Bell className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">All clear!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-l-4 ${getNotificationBorderColor(notification.type)} hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group ${
                    !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 dark:text-gray-500">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}