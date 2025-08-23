
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Menu, Edit, Camera, User, Cake, Mail, Phone, MapPin, Shield, BookMarked, IndianRupee, Star, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { SettingsSheet } from '@/components/settings-sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ProfileHeader = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Profile</h1>
            <div className="flex-1" />
            <SettingsSheet>
                 <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

const InfoRow: React.FC<{
    icon: React.ElementType,
    label: string,
    value: string,
}> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-5 h-5 text-muted-foreground mt-1" />
        <div className="flex-grow">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);

const EditProfileDialog: React.FC<{ user: any; onSave: (updatedUser: any) => void }> = ({ user, onSave }) => {
    const [formData, setFormData] = useState(user);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        toast({ title: "Profile Updated", description: "Your information has been saved successfully." });
    };

    return (
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <CardDescription>Make changes to your profile here. Click save when you're done.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" value={formData.dob} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={formData.address} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input id="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input id="studentId" value={formData.studentId} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="college">College</Label>
                        <Input id="college" value={formData.college} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input id="course" value={formData.course} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" value={formData.year} onChange={handleChange} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogContent>
    );
};

export default function ProfilePage() {
    const [user, setUser] = useState({
        name: 'Arjun Kumar',
        course: 'B.Tech Computer Science',
        avatar: 'https://placehold.co/128x128.png',
        dob: '15/08/2002',
        email: 'arjun.kumar@college.edu',
        phone: '+91 9876543210',
        address: 'Room 205, Hostel Block A',
        emergencyContact: '+91 9876543211',
        studentId: 'STU2024001',
        college: 'ABC Engineering College',
        year: '3rd Year'
    });

    const handleSave = (updatedUser: any) => {
        setUser(updatedUser);
    };

    const accountStats = {
        daysActive: 127,
        totalManaged: 45230,
        pointsEarned: 1850,
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pb-24">
            <ProfileHeader />
            <main className="p-4 md:p-6 space-y-6">
                <Card className="shadow-lg">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-20 h-20 border-4 border-primary/20">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="male avatar" />
                                <AvatarFallback>AK</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="icon" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background">
                                <Camera className="w-4 h-4"/>
                            </Button>
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.course}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">Student</Badge>
                                <Badge variant="secondary">{user.year}</Badge>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            </DialogTrigger>
                            <EditProfileDialog user={user} onSave={handleSave} />
                        </Dialog>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                             <User className="w-5 h-5"/>
                             Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <InfoRow icon={User} label="Full Name" value={user.name} />
                        <InfoRow icon={Cake} label="Date of Birth" value={user.dob} />
                        <InfoRow icon={Mail} label="Email Address" value={user.email} />
                        <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                        <InfoRow icon={MapPin} label="Address" value={user.address} />
                        <InfoRow icon={Shield} label="Emergency Contact" value={user.emergencyContact} />
                    </CardContent>
                </Card>
                
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                             <BookMarked className="w-5 h-5"/>
                             Academic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <InfoRow icon={User} label="Student ID" value={user.studentId} />
                        <InfoRow icon={BookMarked} label="College" value={user.college} />
                        <InfoRow icon={BookMarked} label="Course" value={user.course} />
                        <InfoRow icon={BookMarked} label="Year" value={user.year} />
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            Account Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-2">
                             <p className="text-2xl font-bold text-primary">{accountStats.daysActive}</p>
                             <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><CalendarDays className="w-4 h-4"/>Days Active</p>
                        </div>
                         <div className="p-2">
                             <p className="text-2xl font-bold text-green-600 flex items-center justify-center"><IndianRupee className="w-6 h-6"/>{accountStats.totalManaged.toLocaleString()}</p>
                             <p className="text-sm text-muted-foreground">Total Managed</p>
                        </div>
                         <div className="p-2">
                             <p className="text-2xl font-bold text-yellow-500">{accountStats.pointsEarned.toLocaleString()}</p>
                             <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Star className="w-4 h-4"/>Points Earned</p>
                        </div>
                    </CardContent>
                </Card>

            </main>
        </div>
    );
}
