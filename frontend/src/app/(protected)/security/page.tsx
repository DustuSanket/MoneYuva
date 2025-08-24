"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Menu,
  Lock,
  Fingerprint,
  LockKeyhole,
  KeyRound,
  Eye,
  Shield,
  EyeOff,
  BellRing,
  AlertTriangle,
  ShieldCheck,
  FileKey,
  LockIcon,
} from "lucide-react";
import Link from "next/link";
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
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api";

const SecurityPageHeader = () => (
  <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
    <div className="container mx-auto flex items-center h-20 px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </Button>
      <h1 className="text-xl font-bold ml-2">Security</h1>
      <div className="flex-1" />
      <SettingsSheet>
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SettingsSheet>
    </div>
  </header>
);

const SecuritySettingItem = ({
  icon: Icon,
  title,
  description,
  badgeText,
  badgeVariant,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-secondary rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold flex items-center gap-2">
          {title}
          {badgeText && (
            <Badge variant={badgeVariant || "secondary"}>{badgeText}</Badge>
          )}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

const ChangePinDialog: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (newPin !== confirmPin) {
      toast({
        variant: "destructive",
        title: "PIN Mismatch",
        description: "New PIN and Confirm PIN do not match.",
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/security/change-pin/${userId}`,
        {
          currentPin,
          newPin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSave();
      toast({
        title: "PIN Changed!",
        description: "Your payment PIN has been updated successfully.",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to change PIN", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to change PIN. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change PIN
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Payment PIN</DialogTitle>
          <CardDescription>
            Your PIN is used to authorize payments and other sensitive actions.
          </CardDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="current-pin">Current PIN</Label>
            <Input
              id="current-pin"
              type="password"
              maxLength={4}
              placeholder="****"
              required
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pin">New PIN</Label>
            <Input
              id="new-pin"
              type="password"
              maxLength={4}
              placeholder="****"
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pin">Confirm New PIN</Label>
            <Input
              id="confirm-pin"
              type="password"
              maxLength={4}
              placeholder="****"
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function SecurityPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchSettings = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/security/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load security settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [router]);

  const handleSwitchChange = (setting: string, value: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [setting]: value });
    updateBackendSetting(setting, value);
  };

  const updateBackendSetting = async (setting: string, value: boolean) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId || !token) return;

    try {
      await axios.put(
        `${API_BASE_URL}/security/${userId}`,
        { [setting]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Setting Updated!",
        description: `The ${setting} setting has been updated.`,
      });
    } catch (error) {
      console.error("Failed to update setting", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save setting.",
      });
    }
  };

  const handlePinChangeSaved = () => {
    // This function can be used to refetch settings if needed
  };

  if (loading || !settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SecurityPageHeader />
      <main className="p-4 space-y-6 pb-28">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SecuritySettingItem
              icon={Lock}
              title="App Lock"
              description="Require PIN or biometric to open app"
            >
              <Switch
                checked={settings.appLockEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("appLockEnabled", value)
                }
              />
            </SecuritySettingItem>
            <SecuritySettingItem
              icon={Fingerprint}
              title="Biometric Authentication"
              description="Use fingerprint or face unlock"
            >
              <Switch
                checked={settings.biometricEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("biometricEnabled", value)
                }
              />
            </SecuritySettingItem>
            <SecuritySettingItem
              icon={LockKeyhole}
              title="Auto Lock"
              description="Lock app after 2 minutes of inactivity"
            >
              <Switch
                checked={settings.autoLockEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("autoLockEnabled", value)
                }
              />
            </SecuritySettingItem>
            <SecuritySettingItem
              icon={KeyRound}
              title="Payment PIN"
              description="4-digit PIN for payments and sensitive actions"
            >
              <ChangePinDialog onSave={handlePinChangeSaved} />
            </SecuritySettingItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SecuritySettingItem
              icon={EyeOff}
              title="Hide Balance"
              description="Show ***** instead of actual balance"
            >
              <Switch
                checked={settings.hideBalanceEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("hideBalanceEnabled", value)
                }
              />
            </SecuritySettingItem>
            <SecuritySettingItem
              icon={BellRing}
              title="Transaction Alerts"
              description="Get notified for all transactions"
            >
              <Switch
                checked={settings.transactionAlertsEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("transactionAlertsEnabled", value)
                }
              />
            </SecuritySettingItem>
            <SecuritySettingItem
              icon={AlertTriangle}
              title="Login Alerts"
              description="Alert when account is accessed"
            >
              <Switch
                checked={settings.loginAlertsEnabled}
                onCheckedChange={(value) =>
                  handleSwitchChange("loginAlertsEnabled", value)
                }
              />
            </SecuritySettingItem>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <ShieldCheck className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h4 className="font-bold text-green-800">Account Secure</h4>
              <p className="text-sm text-green-700/80">
                Your account has strong security settings enabled
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Fingerprint className="w-5 h-5" />
              <span>Advanced biometric authentication</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <FileKey className="w-5 h-5" />
              <span>Two-factor authentication (2FA)</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <LockIcon className="w-5 h-5" />
              <span>End-to-end encryption</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
