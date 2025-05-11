import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USER } from "@/lib/constants";
import { BarChart, DollarSign, Users, Building } from "lucide-react";

export default function DashboardPage() {
  // In a real app, user role would come from authentication context
  const userRole = MOCK_USER.role;

  const stats = [
    { title: "Total Students", value: "1,250", icon: Users, change: "+5% this month", color: "text-primary" },
    { title: "Revenue", value: "$85,670", icon: DollarSign, change: "+12% this month", color: "text-green-500" },
    { title: "Active Branches", value: "3", icon: Building, change: "Steady", color: "text-yellow-500" },
    { title: "New Enquiries", value: "78", icon: BarChart, change: "+20% this week", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Dashboard</CardTitle>
          <CardDescription>Welcome back, {userRole}! Here's an overview of your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for your role-based dashboard.
            Relevant information and actions for a {userRole} will be displayed here.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="flex items-center text-sm text-muted-foreground p-2 rounded-md hover:bg-secondary">
                  <span className="font-medium text-foreground mr-1">User {i+1}</span> performed an action.
                  <span className="ml-auto text-xs">{(i+1)*3}m ago</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <button className="text-primary hover:underline text-left">Add New Student</button>
            <button className="text-primary hover:underline text-left">Generate Fee Receipt</button>
            <button className="text-primary hover:underline text-left">View Reports</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
