'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { X, Bell, Check, CheckCheck, Trash2, Clock } from 'lucide-react';
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

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-800 dark:text-green-100';
      case 'error':
        return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-100';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeNotificationSidebar}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={closeNotificationSidebar}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    notification.isRead
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                      : getNotificationTypeColor(notification.type)
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}

                  {/* Notification content */}
                  <div className="ml-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        {notification.icon && (
                          <span className="text-lg">{notification.icon}</span>
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}