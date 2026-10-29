import { useState, useEffect } from 'react';
import { notificationService, AppNotification } from '../services/notificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(notificationService.getNotifications());

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(items => {
      setNotifications(items);
    });
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
  };
}
