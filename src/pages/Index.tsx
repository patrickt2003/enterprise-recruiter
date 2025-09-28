import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { JobCard } from "@/components/ui/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostRoleDialog } from "@/components/PostRoleDialog";
import { supabase } from "@/integrations/supabase/client";
import { 
  Filter,
  Plus
} from "lucide-react";

interface OpenRole {
  id: string;
  "Role Name": string | null;
  "Role description": string | null;
  created_at: string;
  role_uuid: string;
  job_identification: number;
}

const Index = () => {
  const [roles, setRoles] = useState<OpenRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostRoleDialogOpen, setIsPostRoleDialogOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Open Roles")
        .select("id, role_uuid, job_identification, \"Role Name\", \"Role description\", created_at")
        .eq("id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        setRoles(data || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleCreated = () => {
    fetchRoles();
  };

  const totalOpenRoles = roles.length;

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
              <CardTitle className="text-xl font-semibold">Open Positions ({totalOpenRoles})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading roles...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                      <JobCard key={role.job_identification} role={role} />
                    ))}
                  </div>
                  {roles.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No open roles found. Click "Post New Role" to create your first job posting.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <PostRoleDialog 
        open={isPostRoleDialogOpen}
        onOpenChange={setIsPostRoleDialogOpen}
        onRoleCreated={handleRoleCreated}
      />
    </div>
  );
};

export default Index;
