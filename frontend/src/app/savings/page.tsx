
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Menu, Plus, Trash2, Target, IndianRupee, Calendar as CalendarIcon, Laptop, Briefcase, Heart, BookOpen, Car, Umbrella } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { SettingsSheet } from '@/components/settings-sheet';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface SavingsGoal {
  id: string;
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
    if (lower.includes('electronic') || lower.includes('laptop')) return Laptop;
    if (lower.includes('travel')) return Car;
    if (lower.includes('education')) return BookOpen;
    if (lower.includes('health')) return Heart;
    if (lower.includes('emergency')) return Umbrella;
    if (lower.includes('personal')) return Briefcase;
    return Target;
}

const categoryStyles: { [key: string]: { bg: string; text: string } } = {
    electronics: { bg: 'bg-blue-100', text: 'text-blue-600' },
    travel: { bg: 'bg-pink-100', text: 'text-pink-600' },
    education: { bg: 'bg-green-100', text: 'text-green-600' },
    health: { bg: 'bg-red-100', text: 'text-red-600' },
    emergency: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    personal: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    default: { bg: 'bg-secondary', text: 'text-primary' },
};

const getCategoryStyle = (category: string) => {
    if (!category) return categoryStyles.default;
    const lower = category.toLowerCase();
    if (lower.includes('electronic') || lower.includes('laptop')) return categoryStyles.electronics;
    if (lower.includes('travel')) return categoryStyles.travel;
    if (lower.includes('education')) return categoryStyles.education;
    if (lower.includes('health')) return categoryStyles.health;
    if (lower.includes('emergency')) return categoryStyles.emergency;
    if (lower.includes('personal')) return categoryStyles.personal;
    return categoryStyles.default;
}

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const savedGoals = localStorage.getItem('coinwise_savings_goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('coinwise_savings_goals', JSON.stringify(goals));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [goals, isClient]);

  const { totalSaved, totalTarget, overallProgress } = useMemo(() => {
    const saved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = target > 0 ? (saved / target) * 100 : 0;
    return { totalSaved: saved, totalTarget: target, overallProgress: progress };
  }, [goals]);


  const handleAddGoal = (name: string, targetAmount: number, category: string, targetDate: string) => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      targetAmount,
      currentAmount: 0,
      category,
      targetDate
    };
    setGoals([...goals, newGoal]);
    toast({ title: "Savings Goal Added!", description: `You're now saving for ${name}.` });
  };
  
  const handleAddFunds = (goalId: string, amount: number) => {
     setGoals(goals.map(goal => {
        if (goal.id === goalId) {
            const newAmount = goal.currentAmount + amount;
            if (newAmount >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
                toast({ title: "Goal Achieved!", description: `Congratulations! You've reached your savings goal for ${goal.name}.`});
            } else {
                toast({ title: "Funds Added!", description: <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1"/>{amount.toFixed(2)} added to {goal.name}.</div>});
            }
            return { ...goal, currentAmount: Math.min(newAmount, goal.targetAmount) };
        }
        return goal;
     }));
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (goalToDelete) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        toast({ variant: "destructive", title: "Goal Deleted", description: `The "${goalToDelete.name}" savings goal has been removed.` });
    }
  };

  const handleUpdateGoalDate = (goalId: string, newDate: string) => {
    setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, targetDate: newDate } : goal
    ));
    toast({ title: "Target Date Updated!" });
  };


  if (!isClient) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <SavingsPageHeader />
      <main className="p-4 space-y-6">
        <Card className="shadow-lg p-4 bg-green-50 border-green-200">
          <div className="grid grid-cols-3 text-center divide-x">
              <div>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><IndianRupee className="w-4 h-4"/>Total Saved</p>
                  <p className="font-bold text-lg text-green-600 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5"/>
                      {totalSaved.toLocaleString()}
                  </p>
              </div>
               <div>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Target className="w-4 h-4"/>Total Target</p>
                  <p className="font-bold text-lg text-blue-600 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5"/>
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
                <h3 className="text-xl font-semibold mt-4">No savings goals yet.</h3>
                <p className="text-muted-foreground mt-2">Click "Add Goal" to start saving for something important!</p>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {goals.map(goal => (
                <SavingsGoalCard key={goal.id} goal={goal} onAddFunds={handleAddFunds} onDelete={handleDeleteGoal} onUpdateDate={handleUpdateGoalDate} />
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

const colorOptions = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
    { name: "Pink", value: "pink" },
    { name: "Indigo", value: "indigo" },
];


const AddGoalDialog: React.FC<{onAddGoal: (name: string, target: number, category: string, targetDate: string) => void}> = ({ onAddGoal }) => {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [category, setCategory] = useState(goalCategories[0].name);
    const [targetDate, setTargetDate] = useState('');
    const [colorTheme, setColorTheme] = useState(colorOptions[0].value);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGoal(name, parseFloat(target), category, targetDate);
        setName('');
        setTarget('');
        setCategory(goalCategories[0].name);
        setTargetDate('');
        setColorTheme(colorOptions[0].value);
        setIsOpen(false);
    }

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
                        <Input id="goal-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., New Laptop, Trip to Goa" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="goal-target" className="flex items-center">Target Amount (<IndianRupee className="w-3.5 h-3.5 mx-1"/>)</Label>
                            <Input id="goal-target" value={target} onChange={e => setTarget(e.target.value)} type="number" placeholder="Enter amount" required min="1" step="0.01" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goal-date">Target Date</Label>
                            <Input id="goal-date" value={targetDate} onChange={e => setTargetDate(e.target.value)} type="date" required />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {goalCategories.map(({name: catName, icon: Icon}) => (
                                <Button
                                    key={catName}
                                    type="button"
                                    variant={category === catName ? "secondary" : "outline"}
                                    onClick={() => setCategory(catName)}
                                    className="h-auto py-2 justify-start"
                                >
                                    <Icon className="w-4 h-4 mr-2"/>
                                    {catName}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Color Theme</Label>
                        <RadioGroup value={colorTheme} onValueChange={setColorTheme} className="flex flex-wrap gap-x-4 gap-y-2">
                            {colorOptions.map(color => (
                                <div key={color.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={color.value} id={color.value} />
                                    <Label htmlFor={color.value} className="flex items-center gap-2 font-normal">
                                        <span className={cn("w-3 h-3 rounded-full", 
                                            { 'bg-blue-500': color.value === 'blue' },
                                            { 'bg-green-500': color.value === 'green' },
                                            { 'bg-purple-500': color.value === 'purple' },
                                            { 'bg-orange-500': color.value === 'orange' },
                                            { 'bg-pink-500': color.value === 'pink' },
                                            { 'bg-indigo-500': color.value === 'indigo' }
                                        )}></span>
                                        {color.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <DialogFooter className="pt-4 flex-col sm:flex-row sm:justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="w-full sm:w-auto">Create Goal</Button>
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
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    const Icon = getGoalIcon(goal.category);
    const style = getCategoryStyle(goal.category);

    const daysLeft = useMemo(() => {
        if (!goal.targetDate) return 'N/A';
        const diff = new Date(goal.targetDate).getTime() - new Date().getTime();
        if (diff < 0) return 'Overdue';
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + ' days left';
    }, [goal.targetDate]);
    
    const [date, setDate] = useState<Date | undefined>(goal.targetDate ? new Date(goal.targetDate) : undefined);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            onUpdateDate(goal.id, selectedDate.toISOString().split('T')[0]);
        }
    }


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
                                    <Plus className="w-4 h-4 mr-1"/> Add Money
                                </Button>
                             </AddFundsDialog>
                             <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-semibold flex items-center"><IndianRupee className="w-4 h-4 mr-0.5" />{goal.currentAmount.toLocaleString()} / <IndianRupee className="w-4 h-4 mx-0.5" />{goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-2"/>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                     <p>{progress.toFixed(0)}% complete</p>
                     <p className="flex items-center"><IndianRupee className="w-3 h-3 mr-0.5" />{remaining.toLocaleString()} remaining</p>
                </div>
            </div>
             <div className="mt-4 grid grid-cols-2 gap-4 text-center border-t pt-4">
                 <Popover>
                    <PopoverTrigger asChild>
                        <div className="cursor-pointer">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><CalendarIcon className="w-4 h-4"/> Target</p>
                            <p className="font-bold">{goal.targetDate ? format(new Date(goal.targetDate), 'dd MMM yyyy') : 'Set Date'}</p>
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
    )
};

const AddFundsDialog: React.FC<{ goal: SavingsGoal; onAddFunds: (goalId: string, amount: number) => void; children: React.ReactNode; }> = ({ goal, onAddFunds, children }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseFloat(amount) > 0) {
            onAddFunds(goal.id, parseFloat(amount));
        }
        setAmount('');
        setDescription('');
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
                        <Label htmlFor="add-funds-amount" className="flex items-center">Amount (<IndianRupee className="w-3.5 h-3.5 mx-1"/>)</Label>
                        <Input 
                            id="add-funds-amount" 
                            type="number" 
                            placeholder="Enter amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            min="0.01" 
                            step="0.01" 
                            required 
                            autoFocus 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="add-funds-description">Description (Optional)</Label>
                        <Textarea 
                            id="add-funds-description"
                            placeholder="What is this for?"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="w-full sm:w-auto">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="w-full sm:w-auto flex items-center">Add <IndianRupee className="w-4 h-4 mx-1"/>{amount || 0}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

    
