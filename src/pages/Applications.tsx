import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Application {
  id: string;
  candidateName: string;
  email: string;
  appliedDate: string;
  stage: "applied" | "screened" | "first_interview" | "second_interview";
}

type OpenRole = {
  "Role Name": string | null;
};

const Applications = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<OpenRole | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now since we don't have an applications table yet
  const mockApplications: Application[] = [
    {
      id: "1",
      candidateName: "John Smith",
      email: "john.smith@email.com",
      appliedDate: "2024-01-15",
      stage: "applied"
    },
    {
      id: "2",
      candidateName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      appliedDate: "2024-01-14",
      stage: "screened"
    },
    {
      id: "3",
      candidateName: "Mike Chen",
      email: "mike.chen@email.com",
      appliedDate: "2024-01-13",
      stage: "first_interview"
    },
    {
      id: "4",
      candidateName: "Emily Davis",
      email: "emily.davis@email.com",
      appliedDate: "2024-01-12",
      stage: "second_interview"
    }
  ];

  const stages = [
    { id: "applied", title: "Applied", color: "bg-blue-100 text-blue-800" },
    { id: "screened", title: "Screened", color: "bg-yellow-100 text-yellow-800" },
    { id: "first_interview", title: "1st Interview Passed", color: "bg-orange-100 text-orange-800" },
    { id: "second_interview", title: "2nd Interview Passed", color: "bg-green-100 text-green-800" }
  ];

  useEffect(() => {
    const fetchRole = async () => {
      if (!roleId) return;
      
      try {
        const { data, error } = await supabase
          .from("Open Roles")
          .select('"Role Name"')
          .eq("id", roleId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
        } else {
          setRole(data);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
    setApplications(mockApplications);
    setLoading(false);
  }, [roleId]);

  const getApplicationsByStage = (stageId: string) => {
    return applications.filter(app => app.stage === stageId);
  };

  const moveApplication = (applicationId: string, newStage: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, stage: newStage as Application["stage"] }
          : app
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Applications for {role?.["Role Name"] || "Role"}
            </h1>
            <p className="text-muted-foreground">
              Manage candidate applications through the hiring pipeline
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => {
            const stageApplications = getApplicationsByStage(stage.id);
            
            return (
              <div key={stage.id} className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{stage.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {stageApplications.length}
                  </Badge>
                </div>
                
                <div className="space-y-3 flex-1">
                  {stageApplications.map((application) => (
                    <Card 
                      key={application.id} 
                      className="bg-card hover:shadow-md transition-shadow cursor-move"
                      draggable
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium">
                          {application.candidateName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-2">
                          {application.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                        
                        <div className="mt-3 flex gap-1">
                          {stages.map((targetStage) => (
                            <Button
                              key={targetStage.id}
                              size="sm"
                              variant={application.stage === targetStage.id ? "default" : "outline"}
                              className="text-xs"
                              onClick={() => moveApplication(application.id, targetStage.id)}
                            >
                              {targetStage.id === "applied" && "A"}
                              {targetStage.id === "screened" && "S"}
                              {targetStage.id === "first_interview" && "1"}
                              {targetStage.id === "second_interview" && "2"}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {stageApplications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                      <p className="text-sm">No applications in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Applications;