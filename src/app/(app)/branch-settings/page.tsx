"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_CLASSES } from "@/lib/constants";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Mock current branch data
const currentBranchData = {
  name: "Main Campus",
  address: "123 Education Lane, Knowledgetown, ED 45678",
  phone: "+1 (555) 123-4567",
  email: "maincampus@branchbuddy.app",
  logoUrl: "https://picsum.photos/seed/maincampuslogo/200/100", // Placeholder
  classes: ["Nursery", "LKG", "UKG", "Class 1", "Class 2"],
  primaryColor: "#3498db",
  secondaryColor: "#ecf0f1",
};

export default function BranchSettingsPage() {
  const [branchName, setBranchName] = React.useState(currentBranchData.name);
  const [address, setAddress] = React.useState(currentBranchData.address);
  const [phone, setPhone] = React.useState(currentBranchData.phone);
  const [email, setEmail] = React.useState(currentBranchData.email);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(currentBranchData.logoUrl);
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>(currentBranchData.classes);
  const [newClassName, setNewClassName] = React.useState("");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClass = () => {
    if (newClassName && !selectedClasses.includes(newClassName)) {
      setSelectedClasses([...selectedClasses, newClassName]);
      setNewClassName("");
    }
  };

  const handleRemoveClass = (classNameToRemove: string) => {
    setSelectedClasses(selectedClasses.filter(c => c !== classNameToRemove));
  };

  const handleSaveChanges = () => {
    // In a real app, this would submit data to the backend
    console.log("Saving changes:", { branchName, address, phone, email, logoPreview, selectedClasses });
    // Add toast notification for success
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl">Branch Settings</CardTitle>
        <CardDescription>Configure settings specific to the current branch: {currentBranchData.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update basic details for this branch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input id="branchName" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="e.g., Main Campus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full branch address" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@branch.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Class Management</CardTitle>
                <CardDescription>Manage academic classes offered at this branch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Current Classes</Label>
                  {selectedClasses.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedClasses.map((cls) => (
                        <div key={cls} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                          {cls}
                          <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={() => handleRemoveClass(cls)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">No classes added yet.</p>
                  )}
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor="newClassName">Add New Class</Label>
                    <Input 
                      id="newClassName" 
                      value={newClassName} 
                      onChange={(e) => setNewClassName(e.target.value)} 
                      placeholder="e.g., Class 10 (Science)"
                    />
                  </div>
                  <Button onClick={handleAddClass} type="button">Add Class</Button>
                </div>
                <div className="space-y-2">
                  <Label>Available Standard Classes (Suggestions)</Label>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_CLASSES.filter(mc => !selectedClasses.includes(mc)).slice(0, 10).map(cls => (
                       <Button key={cls} variant="outline" size="sm" onClick={() => {
                         if (!selectedClasses.includes(cls)) {
                           setSelectedClasses([...selectedClasses, cls]);
                         }
                       }}>
                         {cls}
                       </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Branding</CardTitle>
                <CardDescription>Customize the look and feel for this branch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Branch Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-32 h-16 border rounded-md overflow-hidden bg-muted">
                        <Image src={logoPreview} alt="Branch Logo Preview" layout="fill" objectFit="contain" data-ai-hint="school logo"/>
                      </div>
                    ) : (
                       <div className="w-32 h-16 border rounded-md flex items-center justify-center bg-muted">
                         <ImageIcon className="h-8 w-8 text-muted-foreground" />
                       </div>
                    )}
                    <Input id="logoUpload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    <Button asChild variant="outline">
                       <label htmlFor="logoUpload" className="cursor-pointer">
                         <UploadCloud className="mr-2 h-4 w-4" /> Upload Logo
                       </label>
                    </Button>
                    {logoPreview && (
                      <Button variant="ghost" size="icon" onClick={() => setLogoPreview(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended size: 200x100 pixels. Max file size: 1MB.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input id="primaryColor" type="color" defaultValue={currentBranchData.primaryColor} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Input id="secondaryColor" type="color" defaultValue={currentBranchData.secondaryColor} className="h-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSaveChanges} className="ml-auto shadow-md">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
