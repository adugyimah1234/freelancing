import type { Permission } from "@/types"; // Removed Role, Branch, User imports

export const MOCK_PERMISSIONS: Permission[] = [
  // Student Management
  { id: "perm_student_create", name: "Create Student", category: "Student Management" },
  { id: "perm_student_view", name: "View Student Records", category: "Student Management" },
  { id: "perm_student_edit", name: "Edit Student Details", category: "Student Management" },
  { id: "perm_student_delete", name: "Delete Student", category: "Student Management" },
  // Fee Management
  { id: "perm_fee_collect", name: "Collect Fees", category: "Fee Management" },
  { id: "perm_fee_view_records", name: "View Fee Records", category: "Fee Management" },
  { id: "perm_fee_manage_structure", name: "Manage Fee Structure", category: "Fee Management" },
  // User Management
  { id: "perm_user_create", name: "Create Users", category: "User Management" },
  { id: "perm_user_view", name: "View Users", category: "User Management" },
  { id: "perm_user_edit", name: "Edit Users", category: "User Management" },
  { id: "perm_user_assign_roles", name: "Assign Roles to Users", category: "User Management" },
  // Branch Management
  { id: "perm_branch_config", name: "Configure Branch Settings", category: "Branch Management" },
  { id: "perm_branch_view_reports", name: "View Branch Reports", category: "Branch Management" },
  // Academic Management
  { id: "perm_class_manage", name: "Manage Classes", category: "Academic Management" },
  { id: "perm_exam_manage", name: "Manage Examinations", category: "Academic Management" },
];

// MOCK_ROLES, MOCK_BRANCHES, MOCK_USERS, MOCK_USER are removed.
// Data will be fetched from API.

export const MOCK_CLASSES: string[] = [
  "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (Science)",
  "Class 11 (Commerce)", "Class 11 (Arts)", "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)"
];
