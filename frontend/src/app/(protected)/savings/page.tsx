"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Menu,
  Plus,
  Trash2,
  Target,
  IndianRupee,
  Calendar as CalendarIcon,
  Laptop,
  Briefcase,
  Heart,
  BookOpen,
  Car,
  Umbrella,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SettingsSheet } from "@/components/settings-sheet";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api";

interface SavingsGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
}

const SavingsPageHeader: React.FC = () => (
  <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
    <div className="container mx-auto flex items-center h-20 px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </Button>
      <h1 className="text-xl font-bold ml-2">Savings Goals</h1>
      <div className="flex-1" />
      <SettingsSheet>
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SettingsSheet>
    </div>
  </header>
);

const getGoalIcon = (category: string) => {
  if (!category) return Target;
  const lower = category.toLowerCase();
  if (lower.includes("electronic") || lower.includes("laptop")) return Laptop;
  if (lower.includes("travel")) return Car;
  if (lower.includes("education")) return BookOpen;
  if (lower.includes("health")) return Heart;
  if (lower.includes("emergency")) return Umbrella;
  if (lower.includes("personal")) return Briefcase;
  return Target;
};

const categoryStyles: { [key: string]: { bg: string; text: string } } = {
  electronics: { bg: "bg-blue-100", text: "text-blue-600" },
  travel: { bg: "bg-pink-100", text: "text-pink-600" },
  education: { bg: "bg-green-100", text: "text-green-600" },
  health: { bg: "bg-red-100", text: "text-red-600" },
  emergency: { bg: "bg-yellow-100", text: "text-yellow-600" },
  personal: { bg: "bg-indigo-100", text: "text-indigo-600" },
  default: { bg: "bg-secondary", text: "text-primary" },
};

const getCategoryStyle = (category: string) => {
  if (!category) return categoryStyles.default;
  const lower = category.toLowerCase();
  if (lower.includes("electronic") || lower.includes("laptop"))
    return categoryStyles.electronics;
  if (lower.includes("travel")) return categoryStyles.travel;
  if (lower.includes("education")) return categoryStyles.education;
  if (lower.includes("health")) return categoryStyles.health;
  if (lower.includes("emergency")) return categoryStyles.emergency;
  if (lower.includes("personal")) return categoryStyles.personal;
  return categoryStyles.default;
};

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchGoals = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/goals/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load savings goals.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [router]);

  const { totalSaved, totalTarget, overallProgress } = useMemo(() => {
    const saved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = target > 0 ? (saved / target) * 100 : 0;
    return {
      totalSaved: saved,
      totalTarget: target,
      overallProgress: progress,
    };
  }, [goals]);

  const handleAddGoal = async (
    name: string,
    targetAmount: number,
    category: string,
    targetDate: string
  ) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId || !token) return;

    try {
      const newGoalData = {
        userId,
        name,
        targetAmount,
        category,
        targetDate,
      };
      await axios.post(`${API_BASE_URL}/goals`, newGoalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals(); // Refetch goals to update the list
      toast({
        title: "Savings Goal Added!",
        description: `You're now saving for ${name}.`,
      });
    } catch (error) {
      console.error("Failed to add goal", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add goal.",
      });
    }
  };

  const handleAddFunds = async (goalId: string, amount: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/goals/add-funds/${goalId}`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchGoals(); // Refetch goals to update the list
      toast({
        title: "Funds Added!",
        description: `₹${amount.toFixed(2)} added.`,
      });
    } catch (error) {
      console.error("Failed to add funds", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add funds.",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals();
      toast({
        variant: "destructive",
        title: "Goal Deleted",
        description: "The savings goal has been removed.",
      });
    } catch (error) {
      console.error("Failed to delete goal", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete goal.",
      });
    }
  };

  const handleUpdateGoalDate = async (goalId: string, newDate: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `${API_BASE_URL}/goals/${goalId}`,
        { targetDate: newDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchGoals();
      toast({ title: "Target Date Updated!" });
    } catch (error) {
      console.error("Failed to update date", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update date.",
      });
    }
  };

  if (!isClient || loading) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <SavingsPageHeader />
      <main className="p-4 space-y-6">
        <Card className="shadow-lg p-4 bg-green-50 border-green-200">
          <div className="grid grid-cols-3 text-center divide-x">
            <div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <IndianRupee className="w-4 h-4" />
                Total Saved
              </p>
              <p className="font-bold text-lg text-green-600 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
                {totalSaved.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Target className="w-4 h-4" />
                Total Target
              </p>
              <p className="font-bold text-lg text-blue-600 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
                {totalTarget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="font-bold text-lg flex items-center justify-center">
                {overallProgress.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Savings Goals</h2>
          <AddGoalDialog onAddGoal={handleAddGoal} />
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold mt-4">
                No savings goals yet.
              </h3>
              <p className="text-muted-foreground mt-2">
                Click "Add Goal" to start saving for something important!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <SavingsGoalCard
                key={goal._id}
                goal={goal}
                onAddFunds={handleAddFunds}
                onDelete={handleDeleteGoal}
                onUpdateDate={handleUpdateGoalDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const goalCategories = [
  { name: "Electronics", icon: Laptop },
  { name: "Travel", icon: Car },
  { name: "Education", icon: BookOpen },
  { name: "Health", icon: Heart },
  { name: "Emergency Fund", icon: Umbrella },
  { name: "Personal", icon: Briefcase },
];

const AddGoalDialog: React.FC<{
  onAddGoal: (
    name: string,
    target: number,
    category: string,
    targetDate: string
  ) => void;
}> = ({ onAddGoal }) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState(goalCategories[0].name);
  const [targetDate, setTargetDate] = useState("");
  const [colorTheme, setColorTheme] = useState(""); // Assuming colorTheme is for styling and not saved to backend
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAddGoal(name, parseFloat(target), category, targetDate);
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Title</Label>
            <Input
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., New Laptop, Trip to Goa"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-target" className="flex items-center">
                Target Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)
              </Label>
              <Input
                id="goal-target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                type="number"
                placeholder="Enter amount"
                required
                min="1"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-date">Target Date</Label>
              <Input
                id="goal-date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-3 gap-2">
              {goalCategories.map(({ name: catName, icon: Icon }) => (
                <Button
                  key={catName}
                  type="button"
                  variant={category === catName ? "secondary" : "outline"}
                  onClick={() => setCategory(catName)}
                  className="h-auto py-2 justify-start"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {catName}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddFundsDialog: React.FC<{
  goal: SavingsGoal;
  onAddFunds: (goalId: string, amount: number) => void;
  children: React.ReactNode;
}> = ({ goal, onAddFunds, children }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (parseFloat(amount) > 0) {
      await onAddFunds(goal._id, parseFloat(amount));
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
      });
    }
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Money to {goal.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-funds-amount" className="flex items-center">
              Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)
            </Label>
            <Input
              id="add-funds-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-funds-description">
              Description (Optional)
            </Label>
            <Textarea
              id="add-funds-description"
              placeholder="What is this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-auto flex items-center"
              disabled={loading}
            >
              {loading ? "Adding..." : `Add Money`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SavingsGoalCard: React.FC<{
  goal: SavingsGoal;
  onAddFunds: (goalId: string, amount: number) => void;
  onDelete: (goalId: string) => void;
  onUpdateDate: (goalId: string, newDate: string) => void;
}> = ({ goal, onAddFunds, onDelete, onUpdateDate }) => {
  const progress =
    goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.currentAmount;

  const Icon = getGoalIcon(goal.category);
  const style = getCategoryStyle(goal.category);

  const daysLeft = useMemo(() => {
    if (!goal.targetDate) return "N/A";
    const diff = new Date(goal.targetDate).getTime() - new Date().getTime();
    if (diff < 0) return "Overdue";
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + " days left";
  }, [goal.targetDate]);

  const [date, setDate] = useState<Date | undefined>(
    goal.targetDate ? new Date(goal.targetDate) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onUpdateDate(goal._id, selectedDate.toISOString()); // Use _id here
    }
  };

  return (
    <Card className="shadow-lg p-4">
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg", style.bg)}>
          <Icon className={cn("w-6 h-6", style.text)} />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{goal.name}</p>
              <p className="text-sm text-muted-foreground">{goal.category}</p>
            </div>
            <div className="flex items-center gap-1">
              <AddFundsDialog goal={goal} onAddFunds={onAddFunds}>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Money
                </Button>
              </AddFundsDialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(goal._id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm mb-1">
          <span>Progress</span>
          <span className="font-semibold flex items-center">
            <IndianRupee className="w-4 h-4 mr-0.5" />
            {goal.currentAmount.toLocaleString()} /{" "}
            <IndianRupee className="w-4 h-4 mx-0.5" />
            {goal.targetAmount.toLocaleString()}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <p>{progress.toFixed(0)}% complete</p>
          <p className="flex items-center">
            <IndianRupee className="w-3 h-3 mr-0.5" />
            {remaining.toLocaleString()} remaining
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center border-t pt-4">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CalendarIcon className="w-4 h-4" /> Target
              </p>
              <p className="font-bold">
                {goal.targetDate
                  ? format(new Date(goal.targetDate), "dd MMM yyyy")
                  : "Set Date"}
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div>
          <p className="text-sm text-muted-foreground">Days Left</p>
          <p className="font-bold">{daysLeft}</p>
        </div>
      </div>
    </Card>
  );
};
