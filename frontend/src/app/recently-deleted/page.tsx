
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Trash2, Undo, Bell, Gift, Target, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { SettingsSheet } from '@/components/settings-sheet';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const RecentlyDeletedHeader = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Recently Deleted</h1>
            <div className="flex-1" />
            <SettingsSheet>
                 <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

interface DeletedItem {
    id: number;
    title: string;
    description: string;
    itemType: string;
    deletedAt: string;
    iconName: string; // Storing icon name instead of the component
}

const getDeletedItemIcon = (iconName: string): React.ElementType => {
    switch (iconName) {
        case 'Gift': return Gift;
        case 'Target': return Target;
        case 'IndianRupee': return IndianRupee;
        case 'Bell': return Bell;
        default: return Bell;
    }
};

export default function RecentlyDeletedPage() {
    const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const saved = localStorage.getItem('coinwise_recently_deleted');
            if (saved) {
                setDeletedItems(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to load recently deleted items", error);
        }
    }, []);

    const handleRestore = (itemId: number) => {
        const itemToRestore = deletedItems.find(item => item.id === itemId);
        if (!itemToRestore) return;

        // For now, only notifications are deletable, so we add it back there.
        try {
            const notificationsRaw = localStorage.getItem('coinwise_notifications');
            const notifications = notificationsRaw ? JSON.parse(notificationsRaw) : [];
            
            // The restored item needs its `icon` property re-added for rendering
            const restoredNotification = {
                ...itemToRestore,
            };

            localStorage.setItem('coinwise_notifications', JSON.stringify([restoredNotification, ...notifications]));

            const updatedItems = deletedItems.filter(item => item.id !== itemId);
            setDeletedItems(updatedItems);
            localStorage.setItem('coinwise_recently_deleted', JSON.stringify(updatedItems));
            toast({ title: "Item Restored", description: `"${itemToRestore.title}" has been restored.` });
        } catch (error) {
            console.error("Failed to restore item", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not restore the item." });
        }
    };
    
    const handlePermanentDelete = (itemId: number) => {
        const itemToDelete = deletedItems.find(item => item.id === itemId);
        if (!itemToDelete) return;

        const updatedItems = deletedItems.filter(item => item.id !== itemId);
        setDeletedItems(updatedItems);
        localStorage.setItem('coinwise_recently_deleted', JSON.stringify(updatedItems));
        toast({ variant: 'destructive', title: "Permanently Deleted", description: `"${itemToDelete.title}" has been deleted forever.` });
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pb-24">
            <RecentlyDeletedHeader />
            <main className="p-4 md:p-6 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Trash2 className="w-5 h-5 text-primary" />
                           Deleted Items
                        </CardTitle>
                        <CardDescription>Items are permanently deleted after 30 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {deletedItems.length > 0 ? (
                            <div className="space-y-4">
                                {deletedItems.map(item => {
                                    const ItemIcon = getDeletedItemIcon(item.iconName);
                                    return (
                                        <Card key={item.id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-secondary rounded-lg">
                                                    <ItemIcon className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {item.itemType} &bull; Deleted on {new Date(item.deletedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleRestore(item.id)}>
                                                    <Undo className="w-4 h-4 mr-2" /> Restore
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">
                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the item from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handlePermanentDelete(item.id)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Trash2 className="w-12 h-12 mx-auto" />
                                <h3 className="text-xl font-semibold mt-4">No recently deleted items</h3>
                                <p>When you delete something, it will show up here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

    

    