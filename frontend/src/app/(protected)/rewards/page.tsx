"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  X,
  Utensils,
  Book,
  Briefcase,
  ShieldAlert,
  QrCode,
  Camera,
  Fingerprint,
  Eye,
  EyeOff,
  Lock,
  Shield,
  PlusCircle,
  Car,
  UtensilsCrossed,
  LucideIcon,
  Home,
  ShoppingCart,
  Ticket,
  BookOpen,
  Zap,
  Package,
  Heart,
  Gamepad2,
  Lightbulb,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const getCategoryIcon = (name: string): LucideIcon => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes("food") || lowerCaseName.includes("meal"))
    return UtensilsCrossed;
  if (lowerCaseName.includes("rent") || lowerCaseName.includes("stay"))
    return Home;
  if (lowerCaseName.includes("shop") || lowerCaseName.includes("cloth"))
    return ShoppingCart;
  if (lowerCaseName.includes("entertain") || lowerCaseName.includes("movie"))
    return Ticket;
  if (lowerCaseName.includes("edu") || lowerCaseName.includes("stud"))
    return BookOpen;
  if (lowerCaseName.includes("transport") || lowerCaseName.includes("gas"))
    return Car;
  if (lowerCaseName.includes("utilit") || lowerCaseName.includes("bill"))
    return Zap;
  if (lowerCaseName.includes("pocket money")) return Package;
  if (lowerCaseName.includes("health") || lowerCaseName.includes("love"))
    return Heart;
  if (lowerCaseName.includes("game")) return Gamepad2;
  if (lowerCaseName.includes("idea") || lowerCaseName.includes("tip"))
    return Lightbulb;
  if (lowerCaseName.includes("mobile") || lowerCaseName.includes("phone"))
    return Smartphone;
  return Briefcase;
};

export default function QRPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [amount, setAmount] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState("scan");
  const [mobileNumber, setMobileNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch wallet balance
        const walletResponse = await axios.get(
          `${API_BASE_URL}/wallet/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWalletBalance(walletResponse.data.balance);

        // You need to create a backend route to get categories
        // const categoriesResponse = await axios.get(`${API_BASE_URL}/budget/categories`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // });
        // setCategories(categoriesResponse.data.map((c: any) => ({...c, icon: getCategoryIcon(c.name)})));
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (isScanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description:
              "Please enable camera permissions in your browser settings to scan QR codes.",
          });
        }
      };

      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isScanning, toast]);

  const handleFinalPay = async () => {
    if (!amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter an amount.",
      });
      return;
    }
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > walletBalance) {
      toast({
        variant: "destructive",
        title: "Not Enough Funds in Wallet",
        description: `You only have ₹${walletBalance.toFixed(
          2
        )} available in your wallet.`,
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) throw new Error("User not authenticated");

      const payload = {
        senderId: userId,
        recipientEmail: upiId, // Using UPI ID as a stand-in for recipient email/id
        amount: paymentAmount,
        description: description || "Payment from wallet",
      };

      await axios.post(`${API_BASE_URL}/wallet/pay-to-user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Payment Successful!",
        description: `₹${amount} paid from your wallet.`,
      });
      router.push("/");
    } catch (error: any) {
      console.error("Payment failed:", error);
      const errorMessage =
        error.response?.data?.message || "Payment failed. Please try again.";
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    if (selectedCategory) {
      const remainingAmount =
        selectedCategory.allocated - selectedCategory.spent;
      if (remainingAmount > 0) {
        setAmount(remainingAmount.toFixed(2).toString());
      } else {
        setAmount("");
        toast({
          variant: "destructive",
          title: "Budget Exhausted",
          description: `You have no funds left in the ${selectedCategory.name} category.`,
        });
      }
    }
  };

  if (!isClient || loading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
      <Card className="w-full max-w-lg max-h-[95vh] rounded-t-3xl flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <CardTitle className="text-xl font-bold">Quick Payment</CardTitle>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </CardHeader>
        <div className="flex-grow overflow-y-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-green-800">
                      Wallet Balance
                    </p>
                    <p className="text-sm text-green-600">
                      Spend from your main wallet
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-800 flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {walletBalance.toLocaleString()}
                  </p>
                </div>
              </Card>
              <Tabs
                value={paymentMode}
                onValueChange={setPaymentMode}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scan">Scan</TabsTrigger>
                  <TabsTrigger value="upi">UPI ID</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="scan" className="mt-6">
                  {isScanning ? (
                    <div className="flex flex-col items-center justify-center text-center my-2">
                      <div className="w-full aspect-square rounded-lg bg-black flex items-center justify-center overflow-hidden mb-4">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                        />
                      </div>
                      {hasCameraPermission === false && (
                        <Alert variant="destructive">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access to use this feature.
                          </AlertDescription>
                        </Alert>
                      )}
                      <p className="font-semibold text-lg">
                        Scanning QR Code...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Point camera at merchant QR
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex flex-col items-center justify-center text-center my-2 cursor-pointer"
                        onClick={() => setIsScanning(true)}
                      >
                        <div className="w-32 h-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                          <QrCode className="w-16 h-16" />
                        </div>
                        <p className="font-semibold text-lg">Tap to Scan QR</p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="amount-scan"
                          className="flex items-center"
                        >
                          Amount to Pay (
                          <IndianRupee className="w-3.5 h-3.5 mx-1" />)
                        </Label>
                        <Input
                          id="amount-scan"
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="upi" className="mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        type="text"
                        placeholder="example@paytm"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount-upi">Amount</Label>
                      <Input
                        id="amount-upi"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description-upi">
                        Description (optional)
                      </Label>
                      <Input
                        id="description-upi"
                        type="text"
                        placeholder="e.g., For lunch"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="mobile" className="mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-number">Mobile number</Label>
                      <Input
                        id="mobile-number"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount-mobile">Amount</Label>
                      <Input
                        id="amount-mobile"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description (optional)
                      </Label>
                      <Input
                        id="description"
                        type="text"
                        placeholder="e.g., For coffee"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="space-y-3">
                <p className="font-semibold">Payment Category *</p>
                <Card className="p-0 overflow-hidden">
                  <div className="divide-y">
                    {categories.map((cat) => {
                      const CategoryIcon = cat.icon || Briefcase;
                      return (
                        <div
                          key={cat.id}
                          className={cn(
                            "p-4 flex items-center gap-4 cursor-pointer transition-all",
                            selectedCategoryId === cat.id && "bg-secondary"
                          )}
                          onClick={() => handleCategorySelect(cat.id)}
                        >
                          <div className={cn("p-2 rounded-lg bg-secondary/80")}>
                            <CategoryIcon
                              className={cn("w-6 h-6 text-primary")}
                            />
                          </div>
                          <p className="font-semibold">{cat.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                {selectedCategoryId && amount && (
                  <Button
                    className="w-full h-12 text-lg mt-4"
                    onClick={handleFinalPay}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t bg-background rounded-b-3xl flex-shrink-0">
          <Card className="flex items-center gap-3 p-3 bg-yellow-50 border-yellow-200">
            <ShieldAlert className="w-5 h-5 text-yellow-600" />
            <p className="text-xs text-yellow-800">
              Your wallet balance will be used for this payment.
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
