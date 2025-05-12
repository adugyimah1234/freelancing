
import { AppDataSource } from '../../config/data-source';
import { Permission } from '../../entities/permission.entity';
import { Role, DefaultRole } from '../../entities/role.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { Branch } from '../../entities/branch.entity'; // Import Branch
import { environment } from '../../config/environment';
import { logger } from '../../utils/logger';

// Define permissions (id can be omitted if using auto-generated UUIDs, name must be unique)
const ALL_PERMISSIONS_DATA = [
  // User Management
  { name: 'create_users', category: 'User Management', description: 'Can create new users.' },
  { name: 'view_users', category: 'User Management', description: 'Can view user list and details.' },
  { name: 'edit_users', category: 'User Management', description: 'Can edit user information.' },
  { name: 'delete_users', category: 'User Management', description: 'Can delete users.' },
  { name: 'assign_roles', category: 'User Management', description: 'Can assign roles to users.' },

  // Role Management
  { name: 'manage_roles', category: 'Role Management', description: 'Can create, edit, delete roles and assign permissions.' },
  { name: 'view_roles', category: 'Role Management', description: 'Can view roles and their permissions.' },
  
  // Branch Management
  { name: 'manage_branches', category: 'Branch Management', description: 'Can create, edit, delete branches.' },
  { name: 'view_branches', category: 'Branch Management', description: 'Can view branch details.' },
  { name: 'configure_branch_settings', category: 'Branch Management', description: 'Can configure settings for a specific branch.' },

  // Student Management
  { name: 'manage_students', category: 'Student Management', description: 'Can create, view, edit, delete student records.' },
  { name: 'view_students', category: 'Student Management', description: 'Can view student records.' },

  // Fee Management
  { name: 'manage_fees', category: 'Fee Management', description: 'Can manage fee structures, categories, and payments.' },
  { name: 'view_fee_reports', category: 'Fee Management', description: 'Can view fee collection reports.' },
  
  // Academic Management
  { name: 'manage_classes', category: 'Academic Management', description: 'Can manage academic classes and sections.' },
  { name: 'manage_exams', category: 'Academic Management', description: 'Can manage examinations, schedules, and results entry.' },
  
  // System Settings
  { name: 'manage_system_settings', category: 'System Administration', description: 'Can manage global system settings.' },
];

async function seedDatabase() {
  logger.info('Initializing data source for seeding...');
  await AppDataSource.initialize();
  logger.info('Data source initialized.');

  const permissionRepository = AppDataSource.getRepository(Permission);
  const roleRepository = AppDataSource.getRepository(Role);
  const userRepository = AppDataSource.getRepository(User);
  const branchRepository = AppDataSource.getRepository(Branch);

  // Seed Permissions
  logger.info('Seeding permissions...');
  const seededPermissions: Permission[] = [];
  for (const permData of ALL_PERMISSIONS_DATA) {
    let permission = await permissionRepository.findOneBy({ name: permData.name });
    if (!permission) {
      permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
    }
    seededPermissions.push(permission);
  }
  logger.info(`${seededPermissions.length} permissions seeded/verified.`);

  // Seed Roles
  logger.info('Seeding roles...');
  const rolesData: { name: DefaultRole; description: string; permissions: string[] }[] = [
    { 
      name: DefaultRole.SUPER_ADMIN, 
      description: 'Has all permissions and manages the entire system.',
      permissions: ALL_PERMISSIONS_DATA.map(p => p.name) // Super Admin gets all permissions
    },
    { 
      name: DefaultRole.BRANCH_ADMIN, 
      description: 'Manages a specific branch operations, staff, and students.',
      permissions: [
        'view_users', 'edit_users', // Can view/edit users within their branch
        'assign_roles', // Can assign roles (non-Super Admin) within their branch
        'view_branches', 'configure_branch_settings', // For their branch
        'manage_students', 'view_students',
        'manage_fees', 'view_fee_reports',
        'manage_classes', 'manage_exams',
      ]
    },
    {
      name: DefaultRole.ACCOUNTANT,
      description: 'Manages fee collection, financial records, and reports for a branch.',
      permissions: ['manage_fees', 'view_fee_reports', 'view_students']
    },
    {
      name: DefaultRole.FRONT_DESK,
      description: 'Handles student admissions, inquiries, and basic administrative tasks for a branch.',
      permissions: ['view_students', 'manage_students'] // Limited student management
    },
     {
      name: DefaultRole.TEACHER,
      description: 'Manages class-specific activities, attendance, and student performance for a branch.',
      permissions: ['view_students', 'view_classes'] // Example permissions
    }
  ];

  for (const roleData of rolesData) {
    let role = await roleRepository.findOne({ 
        where: { name: roleData.name },
        relations: ['permissions'] 
    });
    const rolePermissions = seededPermissions.filter(p => roleData.permissions.includes(p.name));

    if (!role) {
      role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        permissions: rolePermissions,
        isDefault: true,
      });
    } else {
      role.description = roleData.description; // Update description
      role.permissions = rolePermissions; // Ensure permissions are up-to-date
      role.isDefault = true;
    }
    await roleRepository.save(role);
  }
  logger.info('Default roles seeded/verified.');

  // Seed Super Admin User
  logger.info('Seeding Super Admin user...');
  const superAdminRole = await roleRepository.findOneByOrFail({ name: DefaultRole.SUPER_ADMIN });
  let superAdmin = await userRepository.findOneBy({ email: environment.superAdminEmail });

  if (!superAdmin) {
    // Create a default "Head Office" or "System" branch if no branches exist, for the Super Admin
    let systemBranch = await branchRepository.findOneBy({ name: 'Head Office' });
    if (!systemBranch) {
        systemBranch = branchRepository.create({
            name: 'Head Office',
            email: environment.superAdminEmail, // Use super admin email for system branch
            address: 'System Default',
        });
        await branchRepository.save(systemBranch);
        logger.info('Created default "Head Office" branch.');
    }


    superAdmin = userRepository.create({
      name: 'Super Administrator',
      email: environment.superAdminEmail,
      password: environment.superAdminPassword, // Password will be hashed by BeforeInsert hook
      role: superAdminRole,
      status: UserStatus.ACTIVE,
      branch: null, // Super Admin might not be tied to a specific operational branch or can be null
      // branch: systemBranch, // Or assign to the system/head office branch
    });
    await userRepository.save(superAdmin);
    logger.info(`Super Admin user created with email: ${environment.superAdminEmail} and password: ${environment.superAdminPassword} (Ensure this password is secure and ideally changed after first login if it's a default one).`);
  } else {
    logger.info('Super Admin user already exists.');
  }

  logger.info('Database seeding completed.');
  await AppDataSource.destroy();
  logger.info('Data source closed.');
}

seedDatabase().catch((error) => {
  logger.error('Error during database seeding:', error);
  process.exit(1);
});
