
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ROLES, MOCK_PERMISSIONS } from "@/lib/constants";
import type { Role, Permission } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, PlusCircle, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Role name must be at least 3 characters").max(50, "Role name too long"),
  description: z.string().max(200, "Description too long").optional(),
  permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
});

type RoleFormData = z.infer<typeof roleSchema>;

const groupPermissionsByCategory = (permissions: Permission[]) => {
  return permissions.reduce((acc, permission) => {
    (acc[permission.category] = acc[permission.category] || []).push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};

export default function UserRolesPage() {
  const [roles, setRoles] = React.useState<Role[]>(MOCK_ROLES);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const groupedPermissions = groupPermissionsByCategory(MOCK_PERMISSIONS);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  React.useEffect(() => {
    if (editingRole) {
      form.reset({
        id: editingRole.id,
        name: editingRole.name,
        description: editingRole.description,
        permissions: editingRole.permissions,
      });
    } else {
      form.reset({ name: "", description: "", permissions: [] });
    }
  }, [editingRole, form, isDialogOpen]);

  const onSubmit = async (data: RoleFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...data, id: editingRole.id } : r));
      toast({ title: "Role Updated", description: `The role "${data.name}" has been updated.` });
    } else {
      const newRole: Role = { ...data, id: `role_${Date.now()}`, userCount: 0 };
      setRoles([...roles, newRole]);
      toast({ title: "Role Created", description: `The role "${data.name}" has been created.` });
    }
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = async (roleId: string, roleName: string) => {
    // In a real app, show confirmation dialog and check if role is in use
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRoles(roles.filter(r => r.id !== roleId));
    setIsLoading(false);
    toast({ title: "Role Deleted", description: `The role "${roleName}" has been deleted.`, variant: "destructive" });
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl flex items-center"><ShieldCheck className="mr-3 h-8 w-8 text-primary" />User Roles</CardTitle>
          <CardDescription>Manage user roles and their permissions within the system.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingRole(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditingRole(null); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
              <DialogDescription>
                {editingRole ? `Modify the details for the ${editingRole.name} role.` : "Define a new user role and assign specific permissions."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Branch Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief summary of this role's responsibilities and access level." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="permissions" render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel className="text-base">Permissions</FormLabel>
                        <FormDescription>Select the specific actions this role can perform.</FormDescription>
                      </div>
                      <ScrollArea className="h-72 rounded-md border p-4 bg-muted/30">
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                          <div key={category} className="mb-4 last:mb-0">
                            <h4 className="font-semibold text-foreground mb-2 pb-1 border-b">{category}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {perms.map((permission) => (
                              <FormField key={permission.id} control={form.control} name="permissions"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-background transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(permission.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), permission.id])
                                            : field.onChange(
                                                (field.value || []).filter(
                                                  (value) => value !== permission.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer">
                                      {permission.name}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                       <FormMessage /> {/* For overall permissions array errors */}
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingRole ? "Save Changes" : "Create Role"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px] text-center">Permissions Granted</TableHead>
              <TableHead className="w-[120px] text-center">Users Assigned</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-foreground">{role.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-md truncate">{role.description || "No description provided."}</TableCell>
                <TableCell className="text-center text-sm font-medium text-primary">{role.permissions.length}</TableCell>
                <TableCell className="text-center text-sm">{role.userCount || 0}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(role)} disabled={isLoading}>
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit {role.name}</span>
                  </Button>
                  {role.name !== "Super Admin" && ( // Prevent deleting Super Admin role
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(role.id, role.name)} disabled={isLoading}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete {role.name}</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {roles.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No roles defined yet. Click "Create New Role" to get started.
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 mt-4">
        <p className="text-xs text-muted-foreground">
          Managing {roles.length} role(s). Ensure roles have appropriate permissions before assigning to users.
        </p>
      </CardFooter>
    </Card>
  );
}
