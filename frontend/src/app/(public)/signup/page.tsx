"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Camera, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import apiClient from "@/lib/api"; // <-- Updated import

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isResending) return;
    if (countdown <= 0) {
      setIsResending(false);
      return;
    }
    const timerId = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [countdown, isResending]);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePhotoUrl = "";
      if (profileImageFile) {
        const imageData = new FormData();
        imageData.append("profilePhoto", profileImageFile);
        const uploadResponse = await apiClient.post(
          "/upload/profile-photo",
          imageData,
          {
            // <-- Updated API call
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profilePhotoUrl = uploadResponse.data.filePath;
      }

      await apiClient.post("/users/register", {
        // <-- Updated API call
        ...formData,
        profilePhoto: profilePhotoUrl,
      });

      setStep(3);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${formData.email}.`,
      });
    } catch (error: any) {
      console.error("Signup failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Please try again.";
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP.",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await apiClient.post("/users/verify-otp", {
        // <-- Updated API call
        email: formData.email,
        otp,
      });

      toast({
        title: "Account Created!",
        description: response.data.message,
      });

      router.push("/login");
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "OTP verification failed. Please try again.";
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setCountdown(60);
    try {
      await apiClient.post("/users/resend-otp", { email: formData.email }); // <-- Updated API call
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your email address.",
      });
    } catch (error: any) {
      console.error("Resend OTP failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <header className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step === 1 ? router.push("/welcome") : setStep(step - 1)
          }
        >
          <ArrowLeft />
        </Button>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="w-full max-w-md mx-auto shadow-xl">
            {step === 1 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Create an Account</CardTitle>
                  <CardDescription>
                    Join CoinWise and start managing your finances.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNextStep} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Arjun Kumar"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@college.edu"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNo">Phone Number (Optional)</Label>
                      <Input
                        id="phoneNo"
                        type="tel"
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNo: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Next"}
                    </Button>
                    <div className="text-center text-sm">
                      <p>
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="font-semibold text-primary underline-offset-4 hover:underline"
                        >
                          Log in
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </>
            )}
            {step === 2 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    Add a Profile Picture
                  </CardTitle>
                  <CardDescription>
                    This is optional. You can add one later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-primary/20">
                      <AvatarImage
                        src={profileImagePreview || undefined}
                        alt="Profile Preview"
                      />
                      <AvatarFallback className="text-5xl">
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor="profile-picture-upload"
                      className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90"
                    >
                      <Camera className="w-5 h-5" />
                      <Input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                  </div>
                  <div className="w-full space-y-2">
                    <Button
                      onClick={handleNextStep}
                      className="w-full h-11"
                      disabled={loading}
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      variant="link"
                      className="w-full"
                      disabled={loading}
                    >
                      Skip for now
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
            {step === 3 && (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                  <CardDescription>
                    Enter the 6-digit OTP we sent to{" "}
                    <span className="font-semibold text-primary">
                      {formData.email}
                    </span>
                    .
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="w-full space-y-2">
                    <Button
                      onClick={handleFinalSignup}
                      className="w-full h-11"
                      disabled={otp.length !== 6 || loading}
                    >
                      Verify & Sign Up
                    </Button>
                    <Button
                      variant="link"
                      className="w-full"
                      onClick={handleResendOtp}
                      disabled={isResending || loading}
                    >
                      {isResending
                        ? `Resend in ${countdown}s`
                        : "Didn't get the OTP? Resend OTP"}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
