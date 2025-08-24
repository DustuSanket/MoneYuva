"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Menu,
  Edit,
  Camera,
  User,
  Cake,
  Mail,
  Phone,
  MapPin,
  Shield,
  BookMarked,
  IndianRupee,
  Star,
  CalendarDays,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { SettingsSheet } from "@/components/settings-sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api"; // <-- Updated import
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api";

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
  icon: React.ElementType;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div className="flex-grow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const EditProfileDialog: React.FC<{
  user: any;
  onSave: (updatedUser: any) => void;
  onImageUpload: (file: File) => void;
}> = ({ user, onSave, onImageUpload }) => {
  const [formData, setFormData] = useState(user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.put(`/users/${user._id}`, formData);
      onSave(response.data);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save changes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <CardDescription>
          Make changes to your profile here. Click save when you're done.
        </CardDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <Input
              id="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await apiClient.get(`/users/${userId}`); // <-- Updated API call
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch user profile.",
      });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    try {
      const imageData = new FormData();
      imageData.append("profilePhoto", file);

      const uploadResponse = await apiClient.post(
        "/upload/profile-photo",
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const profilePhotoUrl = uploadResponse.data.filePath;

      await apiClient.put(`/users/${user._id}`, {
        ...user,
        profilePhoto: profilePhotoUrl,
      });

      setUser({ ...user, profilePhoto: profilePhotoUrl });
      toast({
        title: "Profile picture updated",
        description: "Your photo has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to upload image", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile picture.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

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
                <AvatarImage
                  src={
                    user.profilePhoto ||
                    user.avatar ||
                    "https://placehold.co/128x128.png"
                  }
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">
                {user.course || "Course not set"}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Student</Badge>
                <Badge variant="secondary">{user.year || "Year not set"}</Badge>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              </DialogTrigger>
              <EditProfileDialog
                user={user}
                onSave={handleSave}
                onImageUpload={handleImageUpload}
              />
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoRow icon={User} label="Full Name" value={user.name} />
            <InfoRow
              icon={Cake}
              label="Date of Birth"
              value={user.dob || "Not set"}
            />
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={user.phoneNo || "Not set"}
            />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={user.address || "Not set"}
            />
            <InfoRow
              icon={Shield}
              label="Emergency Contact"
              value={user.emergencyContact || "Not set"}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <BookMarked className="w-5 h-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoRow
              icon={User}
              label="Student ID"
              value={user.studentId || "Not set"}
            />
            <InfoRow
              icon={BookMarked}
              label="College"
              value={user.college || "Not set"}
            />
            <InfoRow
              icon={BookMarked}
              label="Course"
              value={user.course || "Not set"}
            />
            <InfoRow
              icon={BookMarked}
              label="Year"
              value={user.year || "Not set"}
            />
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
              <p className="text-2xl font-bold text-primary">
                {accountStats.daysActive}
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Days Active
              </p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
                {accountStats.totalManaged.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Managed</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-bold text-yellow-500">
                {accountStats.pointsEarned.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="w-4 h-4" />
                Points Earned
              </p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleLogout} className="w-full" variant="destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </main>
    </div>
  );
}
