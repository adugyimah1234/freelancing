
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, CheckCircle2, Info, AlertTriangle, Mail, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type NotificationType = 'info' | 'warning' | 'success' | 'system' | 'message' | 'announcement';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string; // ISO string
  read: boolean;
  link?: string;
  sender?: string; // For message type
};

const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    title: "System Maintenance Scheduled",
    message: "The system will undergo scheduled maintenance on July 28th from 2:00 AM to 4:00 AM UTC. Services may be temporarily unavailable.",
    type: "system",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "notif_2",
    title: "New Fee Structure Approved",
    message: "The revised fee structure for the upcoming academic year 2024-2025 has been approved and is now live.",
    type: "announcement",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    link: "/finance/fee-structure"
  },
  {
    id: "notif_3",
    title: "Welcome to Branch Buddy!",
    message: "Your account has been successfully set up. Explore the dashboard and familiarize yourself with the features.",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "notif_4",
    title: "Parent-Teacher Meeting Reminder",
    message: "A reminder that the Parent-Teacher meeting for Grade 10 is scheduled for this Friday at 3:00 PM in the main hall.",
    type: "info",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: false,
  },
  {
    id: "notif_5",
    title: "Urgent: Action Required",
    message: "Pending student enrollment verifications for North Campus exceed threshold. Please review and approve.",
    type: "warning",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
    link: "/students/pending-verifications"
  },
  {
    id: "notif_6",
    title: "Message from John Doe",
    message: "Could you please check the attendance report for Class 5A? I think there's a discrepancy.",
    type: "message",
    sender: "John Doe (Teacher)",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    read: true,
  },
];

const getNotificationIcon = (type: NotificationType): React.ReactNode => {
  switch (type) {
    case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'system': return <BellRing className="h-5 w-5 text-gray-500" />;
    case 'message': return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'announcement': return <Mail className="h-5 w-5 text-indigo-500" />;
    default: return <BellRing className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="shadow-xl w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl flex items-center">
            <BellRing className="mr-3 h-8 w-8 text-primary" />
            Notifications & Announcements
          </CardTitle>
          <CardDescription>
            Stay updated with important system alerts, messages, and announcements.
            {unreadCount > 0 && <span className="ml-2 text-primary font-semibold">({unreadCount} unread)</span>}
          </CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">Mark all as read</Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <BellRing className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">No notifications yet.</p>
            <p>Check back later for updates.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
            <div className="space-y-4 pr-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border flex items-start gap-4 transition-colors",
                    notification.read ? "bg-card hover:bg-muted/30" : "bg-primary/5 border-primary/30 hover:bg-primary/10",
                  )}
                >
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className={cn("font-semibold", !notification.read && "text-primary-foreground")}>{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}</span>
                    </div>
                    {notification.sender && <p className="text-xs text-muted-foreground mt-0.5">From: {notification.sender}</p>}
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-primary hover:bg-primary/20" onClick={() => markAsRead(notification.id)}>
                          Mark as read
                        </Button>
                      )}
                      {notification.link && (
                        <Button variant="link" size="sm" className="h-7 px-2" asChild>
                          <a href={notification.link}>View Details</a>
                        </Button>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="h-2.5 w-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0" title="Unread"></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
       {notifications.length > 0 && (
        <CardFooter className="border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground">
                Displaying {notifications.length} notification(s).
            </p>
        </CardFooter>
       )}
    </Card>
  );
}
