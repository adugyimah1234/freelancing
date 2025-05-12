import type { Role, Permission, Branch, User } from "@/types";

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

export const MOCK_ROLES: Role[] = [
  {
    id: "role_super_admin",
    name: "Super Admin",
    description: "Has all permissions across all branches.",
    permissions: MOCK_PERMISSIONS.map(p => p.id),
    userCount: 1,
  },
  {
    id: "role_branch_admin",
    name: "Branch Admin",
    description: "Manages a specific branch.",
    permissions: [
      "perm_student_create", "perm_student_view", "perm_student_edit",
      "perm_fee_collect", "perm_fee_view_records",
      "perm_user_create", "perm_user_view", "perm_user_edit", "perm_user_assign_roles", // Within their branch
      "perm_branch_config", // For their branch
      "perm_class_manage", "perm_exam_manage"
    ],
    userCount: 3,
  },
  {
    id: "role_front_desk",
    name: "Front Desk",
    description: "Handles student registrations and inquiries.",
    permissions: ["perm_student_create", "perm_student_view", "perm_fee_collect"],
    userCount: 5,
  },
  {
    id: "role_accountant",
    name: "Accountant",
    description: "Manages fee collections and financial records.",
    permissions: ["perm_fee_collect", "perm_fee_view_records", "perm_fee_manage_structure"],
    userCount: 2,
  },
  {
    id: "role_teacher",
    name: "Teacher",
    description: "Manages assigned classes and student progress.",
    permissions: ["perm_student_view", "perm_exam_manage"], // Simplified
    userCount: 10,
  },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: "branch_main", name: "Main Campus" },
  { id: "branch_north", name: "North Campus" },
  { id: "branch_downtown", name: "Downtown Branch" },
];

export const MOCK_USERS: User[] = [
  {
    id: "user_super_admin",
    name: "Dr. Evelyn Reed",
    email: "e.reed@branchbuddy.app",
    avatarUrl: "https://picsum.photos/seed/evelyn/100/100",
    role: "Super Admin",
    status: "active",
    lastLogin: new Date(Date.now() - Math.random() * 100000000).toISOString(),
  },
  {
    id: "user_branch_admin_main",
    name: "Marcus Chen",
    email: "m.chen.main@branchbuddy.app",
    avatarUrl: "https://picsum.photos/seed/marcus/100/100",
    role: "Branch Admin",
    status: "active",
    branchId: "branch_main",
    lastLogin: new Date(Date.now() - Math.random() * 100000000).toISOString(),
  },
  {
    id: "user_front_desk_north",
    name: "Aisha Khan",
    email: "a.khan.north@branchbuddy.app",
    avatarUrl: "https://picsum.photos/seed/aisha/100/100",
    role: "Front Desk",
    status: "active",
    branchId: "branch_north",
    lastLogin: new Date(Date.now() - Math.random() * 100000000).toISOString(),
  },
  {
    id: "user_accountant_main",
    name: "John B. Good",
    email: "j.good.main@branchbuddy.app",
    avatarUrl: "https://picsum.photos/seed/johngood/100/100",
    role: "Accountant",
    status: "invited",
    branchId: "branch_main",
  },
   {
    id: "user_teacher_downtown",
    name: "Sarah Wilson",
    email: "s.wilson.downtown@branchbuddy.app",
    avatarUrl: "https://picsum.photos/seed/sarah/100/100",
    role: "Teacher", 
    status: "inactive",
    branchId: "branch_downtown",
    lastLogin: new Date(Date.now() - Math.random() * 300000000).toISOString(),
  },
];

export const MOCK_USER: User = MOCK_USERS[0]; // Super Admin for current session

export const MOCK_CLASSES: string[] = [
  "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11 (Science)",
  "Class 11 (Commerce)", "Class 11 (Arts)", "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)"
];
