"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ROLES, MOCK_PERMISSIONS } from "@/lib/constants";
import type { Role, Permission } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Role name must be at least 3 characters"),
  description: z.string().optional(),
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

  const onSubmit = (data: RoleFormData) => {
    if (editingRole) {
      // Update role
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...data, id: editingRole.id } : r));
    } else {
      // Create new role
      const newRole: Role = { ...data, id: `role_${Date.now()}`, userCount: 0 };
      setRoles([...roles, newRole]);
    }
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    // Add confirmation dialog in real app
    setRoles(roles.filter(r => r.id !== roleId));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl">User Roles</CardTitle>
          <CardDescription>Manage user roles and their permissions within the system.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingRole(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingRole(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
              <DialogDescription>
                {editingRole ? `Modify the details for the ${editingRole.name} role.` : "Define a new user role and assign specific permissions."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Branch Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief description of the role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Permissions</FormLabel>
                      <FormDescription>Select the permissions for this role.</FormDescription>
                      <ScrollArea className="h-72 rounded-md border p-4">
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                          <div key={category} className="mb-4">
                            <h4 className="font-medium text-foreground mb-2">{category}</h4>
                            {perms.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={permission.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                    >
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
                                      <FormLabel className="text-sm font-normal text-muted-foreground">
                                        {permission.name}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </ScrollArea>
                       <FormMessage /> {/* For overall permissions array errors */}
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingRole ? "Save Changes" : "Create Role"}</Button>
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
              <TableHead className="w-[200px]">Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px] text-center">Permissions</TableHead>
              <TableHead className="w-[120px] text-center">Users</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{role.description || "-"}</TableCell>
                <TableCell className="text-center text-sm">{role.permissions.length}</TableCell>
                <TableCell className="text-center text-sm">{role.userCount || 0}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(role)}>
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(role.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Showing {roles.length} of {roles.length} roles.
        </p>
      </CardFooter>
    </Card>
  );
}
