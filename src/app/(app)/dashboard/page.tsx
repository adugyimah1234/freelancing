
"use client";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// MOCK_USERS is removed from constants, so we need to handle this.
// For now, we'll use a limited placeholder or fetch if possible.
// MOCK_BRANCHES is also removed.
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, PieChart as RechartsPieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltipComponent, Legend as RechartsLegendComponent, ResponsiveContainer } from "recharts";
import { DollarSign, Users, Building, Activity, TrendingUp, UserPlus, FileText, Bell, UsersRound, BookOpen, AlertCircle, Palette, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useImpersonation } from "@/context/impersonation-context";
import type { Branch, User } from "@/types";
import { apiService } from "@/lib/apiService";

// Mock data for charts
const enrollmentData = [
  { month: "Jan", newStudents: 65 },
  { month: "Feb", newStudents: 59 },
  { month: "Mar", newStudents: 80 },
  { month: "Apr", newStudents: 81 },
  { month: "May", newStudents: 56 },
  { month: "Jun", newStudents: 70 },
  { month: "Jul", newStudents: 75 },
];

const placeholderRevenueData = [
    { name: "Branch A", revenue: 35000, fill: "hsl(var(--chart-1))" },
    { name: "Branch B", revenue: 42000, fill: "hsl(var(--chart-2))" },
    { name: "Branch C", revenue: 28000, fill: "hsl(var(--chart-3))" },
];


const placeholderRecentActivity = [
  { id: "1", user: "System User", action: "Added new student 'Alice Wonderland'", time: "15m ago", icon: <UserPlus className="h-4 w-4 text-green-500" /> },
  { id: "2", user: "Admin User", action: "Updated fee structure for 'Class 10'", time: "1h ago", icon: <DollarSign className="h-4 w-4 text-blue-500" /> },
  { id: "3", user: "Staff User", action: "Generated 'Attendance Report'", time: "3h ago", icon: <FileText className="h-4 w-4 text-yellow-500" /> },
  { id: "4", user: "System Admin", action: "Changed branch settings for 'Main Campus'", time: "5h ago", icon: <Settings className="h-4 w-4 text-purple-500" /> },
  { id: "5", user: "System User", action: "Sent out 'Parent-Teacher Meeting' notification", time: "1d ago", icon: <Bell className="h-4 w-4 text-orange-500" /> },
];

export default function DashboardPage() {
  const { currentEffectiveUser, isLoadingOriginalUser } = useImpersonation();
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [fetchedBranches, fetchedUsers] = await Promise.all([
          apiService.get<Branch[]>('/branches'),
          apiService.get<User[]>('/users') 
        ]);
        setBranches(fetchedBranches);
        setTotalUsers(fetchedUsers.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        // Use placeholders or show error
      } finally {
        setIsLoadingData(false);
      }
    };
    if (!isLoadingOriginalUser) { // Fetch data once original user context is settled
        fetchData();
    }
  }, [isLoadingOriginalUser]);


  if (isLoadingOriginalUser || isLoadingData || !currentEffectiveUser) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const userRole = currentEffectiveUser.role.name;


  const kpis = [
    { title: "Total Students", value: "1,250", icon: UsersRound, trend: "+5% MoM", color: "text-primary" }, // Placeholder
    { title: "Active Staff", value: totalUsers.toString(), icon: Users, trend: "+2 this week", color: "text-green-600" },
    { title: "Total Revenue", value: "$85,670", icon: DollarSign, trend: "+12% MoM", color: "text-purple-600" }, // Placeholder
    { title: "Open Enquiries", value: "78", icon: Activity, trend: "+10 today", color: "text-orange-600" }, // Placeholder
  ];

  const revenueData = branches.length > 0 ? branches.map((branch, index) => ({
    name: branch.name,
    revenue: Math.floor(Math.random() * 50000) + 20000, // Still mock revenue figures
    fill: `hsl(var(--chart-${(index % 5) + 1}))`, // Cycle through 5 chart colors
  })) : placeholderRevenueData;


  const chartConfig: any = { 
    newStudents: { label: "New Students", color: "hsl(var(--primary))" },
    revenue: { label: "Revenue" }
  };
  
  revenueData.forEach((entry) => { // Use actual revenueData for config
     if (!chartConfig[entry.name]) { // Check if already defined
      chartConfig[entry.name] = { label: entry.name, color: entry.fill };
    }
  });


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentEffectiveUser.name}! ({userRole})</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" /> View Reports
          </Button>
          {userRole === "Super Admin" && (
            <Button size="sm" asChild>
              <Link href="/users"> {/* Changed from users/new to users list */}
                <UserPlus className="mr-2 h-4 w-4" /> Manage Users
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid (Charts & Tables) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Larger) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Enrollment Trends</CardTitle>
              <CardDescription>Monthly new student enrollments for the current year.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] p-4">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                   <RechartsBarChart data={enrollmentData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={30}/>
                    <RechartsTooltipComponent
                      cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="newStudents" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Recent System Activity</CardTitle>
              <CardDescription>Latest actions performed by users across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {placeholderRecentActivity.map((activity) => (
                      <TableRow key={activity.id} className="hover:bg-muted/50">
                        <TableCell>{activity.icon}</TableCell>
                        <TableCell className="font-medium">{activity.user}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{activity.action}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Smaller) */}
        <div className="space-y-6">
          {userRole === "Super Admin" && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Revenue by Branch</CardTitle>
                <CardDescription>Distribution of revenue across active branches.</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] flex items-center justify-center p-4">
                <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsTooltipComponent 
                      cursor={{ fill: "hsl(var(--muted))" }}
                      content={<ChartTooltipContent hideLabel />} 
                    />
                    <Pie data={revenueData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false}
                     label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsLegendComponent layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "10px"}} />
                  </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" asChild><Link href="/students/new"><UserPlus className="mr-2 h-4 w-4" />Student</Link></Button>
              <Button variant="outline" className="w-full" asChild><Link href="/users"><Users className="mr-2 h-4 w-4" />Staff</Link></Button>
              <Button variant="outline" className="w-full" asChild><Link href="/classes"><BookOpen className="mr-2 h-4 w-4" />Classes</Link></Button>
              <Button variant="outline" className="w-full" asChild><Link href="/branch-settings"><Building className="mr-2 h-4 w-4" />Branch</Link></Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-accent/10 border-accent/30">
            <CardHeader>
              <CardTitle className="text-xl text-accent-foreground flex items-center"><AlertCircle className="mr-2 h-5 w-5" />System Alerts</CardTitle>
              <CardDescription className="text-accent-foreground/80">Important notices and pending actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-accent-foreground/90">
                <li className="flex items-start"><Bell className="h-4 w-4 mr-2 mt-0.5 shrink-0" /> <strong>Fee Deadline Approaching:</strong> Class 12 fees due in 3 days.</li>
                <li className="flex items-start"><Palette className="h-4 w-4 mr-2 mt-0.5 shrink-0" /> <strong>Branding Update:</strong> New logo guidelines available in Branch Settings.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
