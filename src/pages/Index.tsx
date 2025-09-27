import { useState } from "react";
import { Header } from "@/components/ui/header";
import { JobCard } from "@/components/ui/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostRoleDialog } from "@/components/PostRoleDialog";
import { mockJobs } from "@/data/mock-data";
import { 
  Filter,
  Plus
} from "lucide-react";

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isPostRoleDialogOpen, setIsPostRoleDialogOpen] = useState(false);

  const filteredJobs = mockJobs.filter(job => {
    const matchesDepartment = selectedDepartment === "all" || job.department.toLowerCase() === selectedDepartment;
    return matchesDepartment;
  });

  const totalApplicants = mockJobs.reduce((sum, job) => sum + job.applicants, 0);
  const totalOpenRoles = mockJobs.length;
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
          <Button 
            className="bg-hr-primary hover:bg-hr-primary-dark"
            onClick={() => setIsPostRoleDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Role
          </Button>
        </div>


        <div className="w-full">
          {/* Job Listings */}
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
      
      <PostRoleDialog 
        open={isPostRoleDialogOpen}
        onOpenChange={setIsPostRoleDialogOpen}
      />
    </div>
  );
};

export default Index;
