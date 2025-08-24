"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Menu,
  Bell,
  CheckCheck,
  Gift,
  IndianRupee,
  Target,
  Archive,
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api";

const NotificationsPageHeader: React.FC<{ onMarkAllRead: () => void }> = ({
  onMarkAllRead,
}) => (
  <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
    <div className="container mx-auto flex items-center h-20 px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </Button>
      <h1 className="text-xl font-bold ml-2">Notifications</h1>
      <div className="flex-1" />
      <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
        <CheckCheck className="w-4 h-4 mr-2" /> Mark all as read
      </Button>
    </div>
  </header>
);

interface Notification {
  _id: string;
  read: boolean;
  archived: boolean;
  type: string;
  title: string;
  description: string;
  amount?: number;
  createdAt: string;
  icon?: React.ElementType;
}

const getNotificationIcon = (type: string): React.ElementType => {
  switch (type) {
    case "reward":
      return Gift;
    case "goal":
      return Target;
    case "transaction":
      return IndianRupee;
    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(
        response.data.map((n: any) => ({
          ...n,
          icon: getNotificationIcon(n.type),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications.",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/notifications/mark-all-read/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast({ title: "All notifications marked as read." });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleArchive = async () => {
    if (!selectedNotification) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE_URL}/notifications/archive/${selectedNotification._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications(); // Refetch to show the updated list
      toast({ title: "Notification archived." });
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to archive notification", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/notifications/${selectedNotification._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications(); // Refetch to show the updated list
      toast({
        variant: "destructive",
        title: "Notification Deleted.",
        description: "This notification has been permanently removed.",
      });
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;
  const activeNotifications = notifications.filter((n) => !n.archived);
  const unreadNotifications = notifications.filter(
    (n) => !n.read && !n.archived
  );
  const archivedNotifications = notifications.filter((n) => n.archived);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NotificationsPageHeader onMarkAllRead={handleMarkAllRead} />
      <main className="p-4 space-y-6">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <NotificationList
              notifications={activeNotifications}
              onNotificationClick={setSelectedNotification}
            />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList
              notifications={unreadNotifications}
              onNotificationClick={setSelectedNotification}
            />
          </TabsContent>
          <TabsContent value="archived">
            {archivedNotifications.length > 0 ? (
              <NotificationList
                notifications={archivedNotifications}
                onNotificationClick={setSelectedNotification}
                isArchived
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto" />
                <h3 className="text-xl font-semibold mt-4">
                  No archived notifications
                </h3>
                <p>You can archive notifications to view them later.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Notification</DialogTitle>
            <DialogDescription>
              Archive or delete this notification. Deleted notifications can be
              recovered from the 'Recently Deleted' section for 30 days.
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="py-4">
              <NotificationCard item={selectedNotification} isPreview />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" /> Archive
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const NotificationList: React.FC<{
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  isArchived?: boolean;
}> = ({ notifications, onNotificationClick, isArchived = false }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bell className="w-12 h-12 mx-auto" />
        <h3 className="text-xl font-semibold mt-4">All caught up!</h3>
        <p>You have no new notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <div
          key={item._id}
          onClick={() => onNotificationClick(item)}
          className="cursor-pointer"
        >
          <NotificationCard item={item} />
        </div>
      ))}
    </div>
  );
};

const NotificationCard: React.FC<{
  item: Notification;
  isPreview?: boolean;
}> = ({ item, isPreview = false }) => {
  const Icon = item.icon!;
  return (
    <Card
      className={cn(
        "p-4 flex items-start gap-4",
        !item.read && "bg-primary/5 border-primary/20",
        isPreview && "shadow-none border-dashed"
      )}
    >
      {!item.read && !isPreview && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>
      )}
      <div
        className={cn(
          "p-3 rounded-full",
          item.type === "reward" ? "bg-green-100" : "bg-secondary"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6",
            item.type === "reward" ? "text-green-600" : "text-gray-600"
          )}
        />
      </div>
      <div className="flex-grow">
        <p className="font-bold">{item.title}</p>
        <p className="text-sm text-muted-foreground flex items-center">
          {item.description}
        </p>
      </div>
      {!isPreview && (
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
};
