
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MOCK_USERS, MOCK_ROLES, MOCK_BRANCHES } from "@/lib/constants";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, UserPlus, MoreHorizontal, Trash2, Power, Loader2, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useImpersonation } from "@/context/impersonation-context";

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().optional(), // Keep optional, empty string will be converted to ALL_BRANCHES_SELECT_VALUE
  status: z.enum(["active", "inactive", "invited"]).default("invited"),
});

type UserFormData = z.infer<typeof userFormSchema>;

const getInitials = (name: string) => {
  if (!name) return "..";
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
};

const ALL_BRANCHES_SELECT_VALUE = "__ALL_BRANCHES__";

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>(MOCK_USERS);
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  
  const { originalUser, currentEffectiveUser, startImpersonation, isImpersonating } = useImpersonation();
  // Use originalUser for permission checks related to modifying user data
  const adminUserForPermissions = originalUser;


  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  React.useEffect(() => {
    if (isUserDialogOpen) {
      if (editingUser) {
        form.reset({
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          branchId: editingUser.branchId || ALL_BRANCHES_SELECT_VALUE,
          status: editingUser.status,
        });
      } else { 
        form.reset({
          name: "",
          email: "",
          role: "",
          branchId: adminUserForPermissions.role === "Super Admin" 
                      ? ALL_BRANCHES_SELECT_VALUE 
                      : (adminUserForPermissions.branchId || ALL_BRANCHES_SELECT_VALUE),
          status: "invited",
        });
      }
    }
  }, [editingUser, form, isUserDialogOpen, adminUserForPermissions]);

  const onSubmit = async (formData: UserFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const processedData = { ...formData };
    if (processedData.branchId === ALL_BRANCHES_SELECT_VALUE) {
      processedData.branchId = undefined; 
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...processedData } : u));
      toast({ title: "User Updated", description: `${processedData.name}'s details have been updated.` });
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${processedData.name.split(" ").join("")}/100/100`,
        lastLogin: processedData.status === 'active' ? new Date().toISOString() : undefined,
        ...processedData,
      };
      setUsers([newUser, ...users]);
      toast({ title: "User Created", description: `${processedData.name} has been invited/created.` });
    }
    setIsLoading(false);
    setIsUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };
  
  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUsers(users.filter(u => u.id !== userId));
    setIsLoading(false);
    toast({ title: "User Deleted", description: "The user has been removed.", variant: "destructive" });
  };

  const handleToggleStatus = async (user: User) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStatus = user.status === "active" ? "inactive" : "active";
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus, lastLogin: newStatus === 'active' && !u.lastLogin ? new Date().toISOString() : u.lastLogin } : u));
    setIsLoading(false);
    toast({ title: "Status Updated", description: `${user.name}'s status changed to ${newStatus}.` });
  };

  const availableRoles = MOCK_ROLES.filter(role => adminUserForPermissions.role === "Super Admin" || role.name !== "Super Admin");

  return (
    <Card className="shadow-xl w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl">User Management</CardTitle>
          <CardDescription>View, create, and manage user accounts. {isImpersonating ? `(Currently viewing as ${currentEffectiveUser.name})` : `(Logged in as ${adminUserForPermissions.name})`}</CardDescription>
        </div>
        {/* "Add New User" button visibility should be based on the original user's permissions if SA, or currentEffectiveUser's permissions if impersonating a non-SA */}
        {/* For this exercise, we'll base it on originalUser's (Super Admin's) ability to create users always. */}
        {adminUserForPermissions.role === "Super Admin" && (
          <Dialog open={isUserDialogOpen} onOpenChange={(open) => { setIsUserDialogOpen(open); if (!open) setEditingUser(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { setEditingUser(null); setIsUserDialogOpen(true); }}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? `Modify details for ${editingUser.name}.` : "Enter details to create/invite a new user."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableRoles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="branchId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ALL_BRANCHES_SELECT_VALUE}
                          disabled={adminUserForPermissions.role !== "Super Admin" && !!adminUserForPermissions.branchId}
                        >
                          <FormControl><SelectTrigger><SelectValue placeholder="Select branch (optional)" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value={ALL_BRANCHES_SELECT_VALUE}>All Branches (N/A)</SelectItem>
                            {MOCK_BRANCHES.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  {editingUser && (
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="invited">Invited</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingUser ? "Save Changes" : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                <TableCell className="text-sm">{user.role}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.branchId ? MOCK_BRANCHES.find(b => b.id === user.branchId)?.name : 'All Branches'}
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "default" : user.status === "invited" ? "secondary" : "outline"}
                         className={user.status === "active" ? "bg-green-100 text-green-700 border-green-200" : 
                                    user.status === "invited" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                    "bg-gray-100 text-gray-700 border-gray-200"}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {user.lastLogin ? format(parseISO(user.lastLogin), "dd MMM yyyy, HH:mm") : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading && !isImpersonating}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">User Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {adminUserForPermissions.role === "Super Admin" && user.id !== adminUserForPermissions.id && !isImpersonating && (
                        <DropdownMenuItem onClick={() => startImpersonation(user)}>
                          <Eye className="mr-2 h-4 w-4" /> View As User
                        </DropdownMenuItem>
                      )}
                       {(adminUserForPermissions.role === "Super Admin" && user.id !== adminUserForPermissions.id && !isImpersonating) && <DropdownMenuSeparator />}
                      <DropdownMenuItem onClick={() => handleEdit(user)} disabled={isLoading && isImpersonating}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)} disabled={isLoading && isImpersonating}>
                        <Power className="mr-2 h-4 w-4" /> 
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                       {adminUserForPermissions.role === "Super Admin" && user.id !== adminUserForPermissions.id && ( 
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isLoading && isImpersonating}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                       )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {users.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No users found. Start by adding a new user.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
