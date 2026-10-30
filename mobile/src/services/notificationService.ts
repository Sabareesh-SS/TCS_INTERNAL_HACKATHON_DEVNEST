export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'escalation' | 'resolution' | 'system';
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  private notifications: AppNotification[] = [
    {
      id: 'notif-1',
      title: 'Ticket Assigned: Room 105 Projector',
      message: 'New critical AV incident escalated from faculty in Room 105 (Academic Block A). Pre-diagnostic evidence attached.',
      type: 'assignment',
      isRead: false,
      createdAt: '2026-10-29T09:21:00Z',
    },
  ];

  private listeners: ((items: AppNotification[]) => void)[] = [];

  public subscribe(listener: (items: AppNotification[]) => void) {
    this.listeners.push(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.notifications]));
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public addNotification(item: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      ...item,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.notify();
  }

  public markAsRead(id: string) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].isRead = true;
      this.notify();
    }
  }

  public markAllAsRead() {
    this.notifications.forEach(n => (n.isRead = true));
    this.notify();
  }
}

export const notificationService = new NotificationService();
