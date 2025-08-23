
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [otpSent, setOtpSent] = useState(false);


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

    const handleResendOtp = async () => {
        setIsResending(true);
        setCountdown(30);
        setOtpSent(true);
        // In a real app, this would trigger an API call to send the OTP
        console.log("Resending OTP to:", formData.email);
        toast({
            title: "OTP Sent",
            description: "A new OTP has been sent to your email address.",
        });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleProceedToOtp = () => {
        setStep(3);
    };
    
    const handleFinalSignup = () => {
        if (otp.length !== 6) {
            toast({
                variant: 'destructive',
                title: 'Invalid OTP',
                description: 'Please enter the complete 6-digit OTP.',
            });
            return;
        }

        // In a real app, you would verify the OTP here.
        try {
            localStorage.setItem('coinwise_authenticated', 'true');
            // You might also save user details to localStorage or a database
            toast({
                title: "Account Created!",
                description: "Welcome to CoinWise. Let's get your budget set up.",
            });
            router.push('/onboarding');
        } catch (error) {
            console.error("Failed to set localStorage", error);
            toast({
                variant: 'destructive',
                title: 'Signup Failed',
                description: 'Could not create your account. Please try again.',
            });
        }
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
            <header className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => step === 1 ? router.push('/welcome') : setStep(step - 1)}>
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
                                    <CardDescription>Join CoinWise and start managing your finances.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleNextStep} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" type="text" placeholder="Arjun Kumar" required onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="student@college.edu" required onChange={e => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
                                        </div>
                                        <Button type="submit" className="w-full h-11">
                                            Next
                                        </Button>
                                        <div className="text-center text-sm">
                                            <p>
                                                Already have an account?{' '}
                                                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
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
                                    <CardTitle className="text-2xl">Add a Profile Picture</CardTitle>
                                    <CardDescription>This is optional. You can add one later.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <Avatar className="w-32 h-32 border-4 border-primary/20">
                                            <AvatarImage src={profileImage || undefined} alt="Profile Preview" />
                                            <AvatarFallback className="text-5xl">
                                                <User />
                                            </AvatarFallback>
                                        </Avatar>
                                        <Label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90">
                                            <Camera className="w-5 h-5"/>
                                            <Input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </Label>
                                    </div>
                                    
                                    <div className="w-full space-y-2">
                                         <Button onClick={handleProceedToOtp} className="w-full h-11">Sign Up</Button>
                                         <Button onClick={handleProceedToOtp} variant="link" className="w-full">
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
                                        Enter the 6-digit OTP we sent to <span className="font-semibold text-primary">{formData.email}</span>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-6">
                                     <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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
                                         <Button onClick={handleFinalSignup} className="w-full h-11" disabled={otp.length !== 6}>Verify & Sign Up</Button>
                                         <Button variant="link" className="w-full" onClick={handleResendOtp} disabled={isResending}>
                                            {isResending ? `Resend in ${countdown}s` : "Didn't get the OTP? Resend OTP"}
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
