
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Download, Calendar as CalendarIcon, FileText, Check, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { SettingsSheet } from '@/components/settings-sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';


const ExportDataPageHeader = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Export Data</h1>
            <div className="flex-1" />
            <SettingsSheet>
                 <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

const reportTypes = [
    { id: "tx_history", title: "Transaction History", description: "All income and expense transactions", icon: FileText },
    { id: "budget_report", title: "Budget Report", description: "Category-wise budget allocation and spending", icon: FileText },
    { id: "savings_report", title: "Savings Report", description: "Savings goals and achievements", icon: FileText },
    { id: "complete_statement", title: "Complete Statement", description: "All financial data in one report", icon: FileText },
];

export default function ExportDataPage() {
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [selectedReport, setSelectedReport] = useState("tx_history");
    const [deliveryMethod, setDeliveryMethod] = useState("email");

    return (
        <div className="bg-gray-50 min-h-screen pb-28">
            <ExportDataPageHeader />
            <main className="p-4 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Download className="w-5 h-5 text-primary" />
                           Export Financial Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label className="font-semibold">Select Date Range</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <DatePopover date={fromDate} setDate={setFromDate} placeholder="From Date" />
                                <DatePopover date={toDate} setDate={setToDate} placeholder="To Date" />
                            </div>
                            {fromDate && toDate && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Selected period: {format(fromDate, "yyyy-MM-dd")} to {format(toDate, "yyyy-MM-dd")}
                                </p>
                            )}
                        </div>

                         <div>
                            <Label className="font-semibold">Select Report Types</Label>
                            <div className="space-y-3 mt-2">
                                {reportTypes.map(report => (
                                    <ReportTypeCard 
                                        key={report.id}
                                        {...report}
                                        isSelected={selectedReport === report.id}
                                        onSelect={() => setSelectedReport(report.id)}
                                    />
                                ))}
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="export-format" className="font-semibold">Export Format</Label>
                            <Select defaultValue="pdf">
                                <SelectTrigger id="export-format">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF Document</SelectItem>
                                    <SelectItem value="csv">CSV File</SelectItem>
                                    <SelectItem value="excel">Excel Sheet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                         <div>
                            <Label className="font-semibold">Delivery Method</Label>
                            <div className="flex gap-4 mt-2">
                                <Button variant={deliveryMethod === 'email' ? 'secondary' : 'outline'} onClick={() => setDeliveryMethod('email')} className="w-full">
                                    <Mail className="w-4 h-4 mr-2" /> Email
                                </Button>
                                 <Button variant={deliveryMethod === 'whatsapp' ? 'secondary' : 'outline'} onClick={() => setDeliveryMethod('whatsapp')} className="w-full">
                                    <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                                </Button>
                            </div>
                        </div>

                        {deliveryMethod === 'email' && (
                             <div className="space-y-2">
                                <Label htmlFor="email" className="font-semibold">Email Address</Label>
                                <Input id="email" type="email" defaultValue="arjun.kumar@college.edu" />
                                <p className="text-xs text-muted-foreground">PDF will be sent to this email address</p>
                            </div>
                        )}

                        {deliveryMethod === 'whatsapp' && (
                             <div className="space-y-2">
                                <Label htmlFor="whatsapp" className="font-semibold">WhatsApp Number</Label>
                                <Input id="whatsapp" type="tel" defaultValue="+91 98765 43210" />
                                <p className="text-xs text-muted-foreground">Report will be sent to this WhatsApp number</p>
                            </div>
                        )}
                        
                         <Card className="bg-secondary/50 p-4">
                            <CardTitle className="text-md mb-2">Export Summary</CardTitle>
                            <div className="text-sm space-y-1">
                                <p><strong>Report:</strong> {reportTypes.find(r => r.id === selectedReport)?.title}</p>
                                <p><strong>Period:</strong> {fromDate && toDate ? `${format(fromDate, "PPP")} to ${format(toDate, "PPP")}` : 'Not selected'}</p>
                                <p><strong>Format:</strong> PDF Document</p>
                                <p><strong>Deliver to:</strong> {deliveryMethod === 'email' ? 'arjun.kumar@college.edu' : '+91 98765 43210'}</p>
                            </div>
                         </Card>
                         
                         <Button className="w-full">Generate Report</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

const DatePopover: React.FC<{date?: Date, setDate: (date?: Date) => void, placeholder: string}> = ({ date, setDate, placeholder }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{placeholder}</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
        </PopoverContent>
    </Popover>
);

const ReportTypeCard: React.FC<{
    icon: React.ElementType, 
    title: string, 
    description: string, 
    isSelected: boolean,
    onSelect: () => void
}> = ({ icon: Icon, title, description, isSelected, onSelect }) => (
    <Card 
        className={cn(
            "p-4 flex items-center gap-4 cursor-pointer transition-all", 
            isSelected && "border-primary ring-2 ring-primary"
        )}
        onClick={onSelect}
    >
        <div className={cn("p-2 rounded-lg", isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-grow">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-primary" />}
    </Card>
);
