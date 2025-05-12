// src/app/(app)/users/page.tsx
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
import type { User, Role, Branch } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, UserPlus, MoreHorizontal, Trash2, Power, Loader2, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useImpersonation } from "@/context/impersonation-context";
import { apiService, ApiError } from "@/lib/apiService";

const userFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(), // Optional for edit, required for create
  roleId: z.string().min(1, "Role is required"), // Role ID (string UUID from backend)
  branchId: z.string().optional(), // Branch ID (string UUID from backend)
  status: z.enum(["active", "inactive", "invited", "pending"]).default("invited"),
}).superRefine((data, ctx) => {
  if (!data.id && !data.password) { // If creating a new user (no id) and password is not provided
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password is required for new users.",
      path: ["password"],
    });
  }
});

type UserFormData = z.infer<typeof userFormSchema>;

const getInitials = (name: string) => {
  if (!name) return "..";
  const names = name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
};

const ALL_BRANCHES_SELECT_VALUE = "__ALL_BRANCHES__"; // This should map to undefined or null for backend

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const { toast } = useToast();
  
  const { originalUser, currentEffectiveUser, startImpersonation, isImpersonating, allUsersForImpersonation, isLoadingOriginalUser } = useImpersonation();
  
  // Use originalUser for permission checks (the actual logged-in super admin)
  const adminUserForPermissions = originalUser;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const fetchUsers = React.useCallback(async () => {
    setIsDataLoading(true);
    try {
      const fetchedUsers = await apiService.get<User[]>("/users");
      setUsers(fetchedUsers);
    } catch (error) {
      toast({ title: "Error fetching users", description: (error as ApiError).message, variant: "destructive" });
    } finally {
      setIsDataLoading(false);
    }
  }, [toast]);

  const fetchRolesAndBranches = React.useCallback(async () => {
    try {
      const [fetchedRoles, fetchedBranches] = await Promise.all([
        apiService.get<Role[]>("/roles"),
        apiService.get<Branch[]>("/branches"),
      ]);
      setRoles(fetchedRoles);
      setBranches(fetchedBranches);
    } catch (error) {
      toast({ title: "Error fetching roles/branches", description: (error as ApiError).message, variant: "destructive" });
    }
  }, [toast]);

  React.useEffect(() => {
    fetchUsers();
    fetchRolesAndBranches();
  }, [fetchUsers, fetchRolesAndBranches]);


  React.useEffect(() => {
    if (isUserDialogOpen) {
      form.reset(); // Clear previous validation errors
      if (editingUser) {
        form.reset({
          id: editingUser.id,
          name: editingUser.name,
          email: editingUser.email,
          // Password field is left blank for edits by default for security
          roleId: editingUser.role.id, 
          branchId: editingUser.branch?.id || ALL_BRANCHES_SELECT_VALUE,
          status: editingUser.status,
        });
      } else { 
        form.reset({
          name: "",
          email: "",
          password: "",
          roleId: "",
          branchId: adminUserForPermissions?.role?.name === "Super Admin" || !adminUserForPermissions?.branch?.id
                      ? ALL_BRANCHES_SELECT_VALUE 
                      : adminUserForPermissions?.branch?.id,
          status: "invited",
        });
      }
    }
  }, [editingUser, form, isUserDialogOpen, adminUserForPermissions]);

  const onSubmit = async (formData: UserFormData) => {
    setIsLoading(true);
    
    const payload: any = { ...formData };
    if (payload.branchId === ALL_BRANCHES_SELECT_VALUE) {
      payload.branchId = null; // Or undefined, depending on backend DTO
    }
    if (editingUser && !payload.password) { // Don't send empty password on edit unless it's being changed
        delete payload.password;
    }


    try {
      if (editingUser) {
        await apiService.patch<User, Partial<UserFormData>>(`/users/${editingUser.id}`, payload);
        toast({ title: "User Updated", description: `${payload.name}'s details have been updated.` });
      } else {
        await apiService.post<User, UserFormData>("/users", payload);
        toast({ title: "User Created", description: `${payload.name} has been invited/created.` });
      }
      fetchUsers(); // Refresh user list
      setIsUserDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast({ title: editingUser ? "Update Failed" : "Creation Failed", description: (error as ApiError).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };
  
  const handleDeleteUser = async (userId: number) => {
    // Add a confirmation dialog here in a real app
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsLoading(true);
    try {
        await apiService.delete(`/users/${userId}`);
        toast({ title: "User Deleted", description: "The user has been removed." });
        fetchUsers(); // Refresh list
    } catch (error) {
        toast({ title: "Deletion Failed", description: (error as ApiError).message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    // This needs a specific backend endpoint or a PATCH to /users/:id with { status: newStatus }
    // For now, this is a placeholder or assumes a PATCH /users/:id updates status
    setIsLoading(true);
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
        await apiService.patch(`/users/${user.id}`, { status: newStatus });
        toast({ title: "Status Updated", description: `${user.name}'s status changed to ${newStatus}.` });
        fetchUsers();
    } catch (error) {
        toast({ title: "Status Update Failed", description: (error as ApiError).message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const availableRoles = roles.filter(role => adminUserForPermissions?.role?.name === "Super Admin" || role.name !== "Super Admin");

  if (isLoadingOriginalUser || isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-3xl">User Management</CardTitle>
          <CardDescription>
            View, create, and manage user accounts. 
            {currentEffectiveUser ? 
              (isImpersonating ? ` (Currently viewing as ${currentEffectiveUser.name})` : ` (Logged in as ${currentEffectiveUser.name})`)
              : 'Loading user info...'
            }
          </CardDescription>
        </div>
        {adminUserForPermissions?.role?.name === "Super Admin" && (
          <Dialog open={isUserDialogOpen} onOpenChange={(open) => { setIsUserDialogOpen(open); if (!open) setEditingUser(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { setEditingUser(null); setIsUserDialogOpen(true); }}>
                <UserPlus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
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
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{editingUser ? "New Password (optional)" : "Password"}</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="roleId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableRoles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
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
                          disabled={adminUserForPermissions?.role?.name !== "Super Admin" && !!adminUserForPermissions?.branch?.id}
                        >
                          <FormControl><SelectTrigger><SelectValue placeholder="Select branch (optional)" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value={ALL_BRANCHES_SELECT_VALUE}>All Branches (N/A)</SelectItem>
                            {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  {editingUser && ( // Status can only be edited for existing users in this UI
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="invited">Invited</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
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
        <div className="relative w-full overflow-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-12 p-2 sm:p-4"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden lg:table-cell">Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Last Login</TableHead>
                <TableHead className="text-right w-[80px] sm:w-[100px] p-2 sm:p-4">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="p-2 sm:p-4">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl || `https://picsum.photos/seed/${user.name.split(" ").join("")}/100/100`} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    </TableCell>
                    <TableCell className="font-medium py-2 pr-2 sm:py-4 sm:pr-4">{user.name} <span className="block md:hidden text-xs text-muted-foreground">{user.email}</span></TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{user.email}</TableCell>
                    <TableCell className="text-sm">{user.role.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                    {user.branch ? user.branch.name : 'All Branches'}
                    </TableCell>
                    <TableCell>
                    <Badge variant={user.status === "active" ? "default" : user.status === "invited" ? "secondary" : user.status === "pending" ? "outline" : "outline"} // Adjusted pending badge
                            className={`${user.status === "active" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" : 
                                        user.status === "invited" ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" :
                                        user.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200" : // Pending status style
                                        "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"} text-xs whitespace-nowrap`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                    {user.lastLogin ? format(parseISO(user.lastLogin), "dd MMM yyyy, HH:mm") : "Never"}
                    </TableCell>
                    <TableCell className="text-right p-1 sm:p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading && !isImpersonating}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">User Actions</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        {adminUserForPermissions?.role?.name === "Super Admin" && user.id !== adminUserForPermissions.id && !isImpersonating && allUsersForImpersonation.find(u => u.id === user.id) && (
                            <DropdownMenuItem onClick={() => startImpersonation(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View As User
                            </DropdownMenuItem>
                        )}
                        {(adminUserForPermissions?.role?.name === "Super Admin" && user.id !== adminUserForPermissions.id && !isImpersonating && allUsersForImpersonation.find(u => u.id === user.id)) && <DropdownMenuSeparator />}
                        
                        {/* Edit is available if user has permission OR is editing self (though self-edit is usually on profile page) */}
                        { (adminUserForPermissions?.role?.name === "Super Admin" || adminUserForPermissions?.id === user.id ) &&
                          <DropdownMenuItem onClick={() => handleEdit(user)} disabled={isLoading || isImpersonating}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        }
                        
                        {/* Toggle status usually for admins */}
                        { adminUserForPermissions?.role?.name === "Super Admin" && user.id !== adminUserForPermissions.id &&
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)} disabled={isLoading || isImpersonating}>
                              <Power className="mr-2 h-4 w-4" /> 
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        }
                        
                        {adminUserForPermissions?.role?.name === "Super Admin" && user.id !== adminUserForPermissions.id && ( 
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isLoading || isImpersonating}>
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
        </div>
         {users.length === 0 && !isDataLoading && (
          <div className="text-center py-10 text-muted-foreground">
            No users found. Start by adding a new user.
          </div>
        )}
         {isDataLoading && users.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
            Loading users...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
