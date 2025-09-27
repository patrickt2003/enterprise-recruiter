import { useState } from "react";
import { Header } from "@/components/ui/header";
import { StatCard } from "@/components/ui/stat-card";
import { JobCard } from "@/components/ui/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockJobs, departmentStats } from "@/data/mock-data";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  Filter,
  Plus
} from "lucide-react";

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredJobs = mockJobs.filter(job => {
    const matchesDepartment = selectedDepartment === "all" || job.department.toLowerCase() === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const totalApplicants = mockJobs.reduce((sum, job) => sum + job.applicants, 0);
  const totalOpenRoles = mockJobs.length;
  const urgentRoles = mockJobs.filter(job => job.status === "urgent").length;
  const avgApplicantsPerRole = Math.round(totalApplicants / totalOpenRoles);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Application Management</h1>
            <p className="text-muted-foreground">Track open positions and manage candidate applications</p>
          </div>
          <Button className="bg-hr-primary hover:bg-hr-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            Post New Role
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Open Roles"
            value={totalOpenRoles}
            description="Across all departments"
            trend={{ value: 12, direction: "up" }}
          />
          <StatCard
            title="Total Applicants"
            value={totalApplicants}
            description="All active applications"
            trend={{ value: 8, direction: "up" }}
          />
          <StatCard
            title="Urgent Roles"
            value={urgentRoles}
            description="Require immediate attention"
          />
          <StatCard
            title="Avg. Applicants/Role"
            value={avgApplicantsPerRole}
            description="Application conversion rate"
            trend={{ value: 5, direction: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Job Listings */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Open Positions</CardTitle>
                  <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="closing-soon">Closing Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                {filteredJobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No jobs match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Department Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.openRoles} open roles</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-hr-success">{dept.totalApplicants}</p>
                      <p className="text-xs text-muted-foreground">applicants</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Candidate Pipeline
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Interviews
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
