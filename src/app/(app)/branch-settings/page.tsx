
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_CLASSES } from "@/lib/constants";
import { UploadCloud, X, Image as ImageIcon, Loader2, Palette } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

// Mock current branch data
const currentBranchData = {
  name: "Main Campus",
  address: "123 Education Lane, Knowledgetown, ED 45678",
  phone: "+1 (555) 123-4567",
  email: "maincampus@branchbuddy.app",
  logoUrl: "https://picsum.photos/seed/maincampuslogo/200/100", // Placeholder
  classes: ["Nursery", "LKG", "UKG", "Class 1", "Class 2"],
  primaryColor: "#3498db", // hsl(207, 70%, 53%)
  secondaryColor: "#ecf0f1", // hsl(210, 17%, 96%)
};

export default function BranchSettingsPage() {
  const [branchName, setBranchName] = React.useState(currentBranchData.name);
  const [address, setAddress] = React.useState(currentBranchData.address);
  const [phone, setPhone] = React.useState(currentBranchData.phone);
  const [email, setEmail] = React.useState(currentBranchData.email);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(currentBranchData.logoUrl);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>(currentBranchData.classes);
  const [newClassName, setNewClassName] = React.useState("");
  const [primaryColor, setPrimaryColor] = React.useState(currentBranchData.primaryColor);
  const [secondaryColor, setSecondaryColor] = React.useState(currentBranchData.secondaryColor);

  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          title: "Upload Error",
          description: "Logo file size should not exceed 1MB.",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
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
    } else if (newClassName && selectedClasses.includes(newClassName)) {
       toast({
          title: "Class Exists",
          description: `Class "${newClassName}" is already added.`,
          variant: "default",
        });
    }
  };

  const handleRemoveClass = (classNameToRemove: string) => {
    setSelectedClasses(selectedClasses.filter(c => c !== classNameToRemove));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // In a real app, this would submit data to the backend, including logoFile if present
    console.log("Saving changes:", { branchName, address, phone, email, logoFile, logoPreview, selectedClasses, primaryColor, secondaryColor });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    toast({
      title: "Settings Saved!",
      description: "Branch settings have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Branch Settings</CardTitle>
        <CardDescription>Configure settings specific to the current branch: {currentBranchData.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="classes">Class Management</TabsTrigger>
            <TabsTrigger value="branding">Branding & Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Basic Details</CardTitle>
                <CardDescription>Update fundamental information for this branch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input id="branchName" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="e.g., Main Campus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full branch address" rows={3}/>
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
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Class Configuration</CardTitle>
                <CardDescription>Manage academic classes and sections offered at this branch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Current Classes</Label>
                  {selectedClasses.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2 border p-3 rounded-md bg-muted/30">
                      {selectedClasses.map((cls) => (
                        <div key={cls} className="flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium border border-primary/30">
                          {cls}
                          <Button variant="ghost" size="icon" className="h-5 w-5 ml-2 hover:bg-primary/20" onClick={() => handleRemoveClass(cls)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2 p-3 border rounded-md bg-muted/30">No classes added yet. Use the form below to add classes.</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-4 border-t">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor="newClassName">Add New Class Name</Label>
                    <Input 
                      id="newClassName" 
                      value={newClassName} 
                      onChange={(e) => setNewClassName(e.target.value)} 
                      placeholder="e.g., Class 10 (Science)"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddClass();}}}
                    />
                  </div>
                  <Button onClick={handleAddClass} type="button" className="w-full sm:w-auto">Add Class</Button>
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-base font-medium">Suggested Standard Classes</Label>
                  <p className="text-sm text-muted-foreground">Quickly add common classes if they are not already in your list.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {MOCK_CLASSES.filter(mc => !selectedClasses.includes(mc)).slice(0, 10).map(cls => (
                       <Button key={cls} variant="outline" size="sm" onClick={() => {
                         if (!selectedClasses.includes(cls)) {
                           setSelectedClasses([...selectedClasses, cls]);
                         }
                       }}>
                         Add: {cls}
                       </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card className="border-0 sm:border shadow-none sm:shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/>Logo & Appearance</CardTitle>
                <CardDescription>Customize the visual identity for this branch. Applied across portals and communications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="logoUpload" className="text-base font-medium">Branch Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-40 h-20 border-2 border-dashed rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        <Image src={logoPreview} alt="Branch Logo Preview" layout="fill" objectFit="contain" data-ai-hint="school logo" />
                      </div>
                    ) : (
                       <div className="w-40 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-muted text-muted-foreground">
                         <ImageIcon className="h-8 w-8" />
                         <span className="text-xs mt-1">No logo</span>
                       </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <Input id="logoUpload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange} className="hidden" />
                        <Button asChild variant="outline" className="w-fit">
                           <label htmlFor="logoUpload" className="cursor-pointer">
                             <UploadCloud className="mr-2 h-4 w-4" /> Upload Logo
                           </label>
                        </Button>
                        {logoPreview && (
                          <Button variant="ghost" size="sm" onClick={() => { setLogoPreview(null); setLogoFile(null); (document.getElementById('logoUpload') as HTMLInputElement).value = '';}} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 w-fit">
                            <X className="mr-2 h-4 w-4" /> Remove Logo
                          </Button>
                        )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended: PNG/SVG, 200x100px. Max 1MB.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Theme Color</Label>
                    <div className="flex items-center gap-2">
                        <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-16 p-1 rounded-md" />
                        <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#RRGGBB" className="flex-1" />
                    </div>
                    <p className="text-xs text-muted-foreground">Used for main buttons, highlights, and active states.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Theme Color</Label>
                     <div className="flex items-center gap-2">
                        <Input id="secondaryColor" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-16 p-1 rounded-md" />
                        <Input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="#RRGGBB" className="flex-1" />
                    </div>
                    <p className="text-xs text-muted-foreground">Used for backgrounds, accents, and secondary elements.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 mt-6">
        <Button onClick={handleSaveChanges} className="ml-auto shadow-md text-base px-6 py-3" size="lg" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
