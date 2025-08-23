
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Bell, CheckCheck, Gift, IndianRupee, Target, Archive, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';


const NotificationsPageHeader: React.FC<{ onMarkAllRead: () => void }> = ({ onMarkAllRead }) => (
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
    id: number;
    read: boolean;
    archived: boolean;
    icon: React.ElementType;
    iconName: string;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    amount?: number;
    time: string;
}

const getNotificationIcon = (iconName: string): React.ElementType => {
    switch (iconName) {
        case 'Gift': return Gift;
        case 'Target': return Target;
        case 'IndianRupee': return IndianRupee;
        case 'Bell': return Bell;
        default: return Bell;
    }
};

const initialNotifications: Omit<Notification, 'icon'>[] = [
    {
        id: 1,
        read: false,
        archived: false,
        iconName: 'Gift',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        title: "Reward Unlocked!",
        description: "You've earned a 50 cashback reward. Claim it now!",
        amount: 50,
        time: "5m ago"
    },
    {
        id: 2,
        read: false,
        archived: false,
        iconName: 'Target',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: "Goal Progress",
        description: "You're 75% of the way to your 'New Laptop' goal. Keep it up!",
        time: "1h ago"
    },
    {
        id: 3,
        read: true,
        archived: false,
        iconName: 'IndianRupee',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        title: "Bill Reminder",
        description: "Your 'Mess Fee' of 3000 is due in 3 days.",
        amount: 3000,
        time: "1d ago"
    },
     {
        id: 4,
        read: true,
        archived: false,
        iconName: 'Bell',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        title: "Smart Tip",
        description: "Try sharing textbooks this semester to save up to 1000.",
        amount: 1000,
        time: "2d ago"
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        // In a real app, you'd fetch notifications. Here we use localStorage for persistence.
        try {
            const saved = localStorage.getItem('coinwise_notifications');
            if (saved) {
                setNotifications(JSON.parse(saved).map((n: any) => ({ ...n, icon: getNotificationIcon(n.iconName) })));
            } else {
                setNotifications(initialNotifications.map(n => ({...n, icon: getNotificationIcon(n.iconName)})));
            }
        } catch (error) {
            console.error("Could not load notifications from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
             const notificationsToSave = notifications.map(({ icon, ...rest }) => rest);
             localStorage.setItem('coinwise_notifications', JSON.stringify(notificationsToSave));
        } catch (error) {
            console.error("Could not save notifications to localStorage", error);
        }
    }, [notifications]);

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast({ title: "All notifications marked as read." });
    };
    
    const handleArchive = () => {
        if (!selectedNotification) return;
        setNotifications(notifications.map(n => 
            n.id === selectedNotification.id ? { ...n, archived: true, read: true } : n
        ));
        toast({ title: "Notification archived." });
        setSelectedNotification(null);
    };

    const handleDelete = () => {
        if (!selectedNotification) return;
        try {
            const recentlyDeletedRaw = localStorage.getItem('coinwise_recently_deleted');
            const recentlyDeleted = recentlyDeletedRaw ? JSON.parse(recentlyDeletedRaw) : [];
            const itemToDelete = { ...selectedNotification, itemType: 'notification', deletedAt: new Date().toISOString() };
            
            // The icon cannot be serialized, so we store its name
            const { icon, ...itemToStore } = itemToDelete;

            localStorage.setItem('coinwise_recently_deleted', JSON.stringify([itemToStore, ...recentlyDeleted]));

            setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
            toast({
                variant: 'destructive', 
                title: "Notification Moved to Recently Deleted.",
                description: "It will be permanently deleted after 30 days."
            });
            setSelectedNotification(null);

        } catch (error) {
             console.error("Could not move notification to recently deleted", error);
             toast({ variant: 'destructive', title: "Error", description: "Could not delete the notification."});
        }
    };

    const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
    const activeNotifications = notifications.filter(n => !n.archived);
    const unreadNotifications = notifications.filter(n => !n.read && !n.archived);
    const archivedNotifications = notifications.filter(n => n.archived);

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
                        <NotificationList notifications={activeNotifications} onNotificationClick={setSelectedNotification} />
                    </TabsContent>
                    <TabsContent value="unread">
                         <NotificationList notifications={unreadNotifications} onNotificationClick={setSelectedNotification} />
                    </TabsContent>
                    <TabsContent value="archived">
                        {archivedNotifications.length > 0 ? (
                           <NotificationList notifications={archivedNotifications} onNotificationClick={setSelectedNotification} isArchived />
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Archive className="w-12 h-12 mx-auto" />
                                <h3 className="text-xl font-semibold mt-4">No archived notifications</h3>
                                <p>You can archive notifications to view them later.</p>
                            </div>
                        )}
                    </TabsContent>
                 </Tabs>
            </main>
            
            <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Notification</DialogTitle>
                        <DialogDescription>
                            Archive or delete this notification. Deleted notifications can be recovered from the 'Recently Deleted' section for 30 days.
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
    notifications: Notification[], 
    onNotificationClick: (notification: Notification) => void, 
    isArchived?: boolean
}> = ({ notifications, onNotificationClick, isArchived = false }) => {
    if (notifications.length === 0) {
         return (
            <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto" />
                <h3 className="text-xl font-semibold mt-4">All caught up!</h3>
                <p>You have no new notifications.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {notifications.map(item => (
                 <div key={item.id} onClick={() => onNotificationClick(item)} className="cursor-pointer">
                    <NotificationCard item={item} />
                </div>
            ))}
        </div>
    )
}

const NotificationCard: React.FC<{ item: Notification, isPreview?: boolean }> = ({ item, isPreview = false }) => {
    const Icon = item.icon;
    return (
    <Card className={cn("p-4 flex items-start gap-4", !item.read && "bg-primary/5 border-primary/20", isPreview && "shadow-none border-dashed")}>
        {!item.read && !isPreview && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>}
        <div className={cn("p-3 rounded-full", item.iconBg)}>
            <Icon className={cn("w-6 h-6", item.iconColor)} />
        </div>
        <div className="flex-grow">
            <p className="font-bold">{item.title}</p>
            <p className="text-sm text-muted-foreground flex items-center">
                {item.description.includes('cashback') || item.description.includes('Mess Fee') || item.description.includes('save up to') ? (
                    <>
                        {item.description.split(item.amount!.toString())[0]}
                        <IndianRupee className="w-3.5 h-3.5 mx-0.5" />
                        {item.amount}
                        {item.description.split(item.amount!.toString())[1]}
                    </>
                ) : (
                    item.description
                )}
            </p>
        </div>
        {!isPreview && <p className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</p>}
    </Card>
)};

    

    