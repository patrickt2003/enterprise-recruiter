import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddApplicantDialog } from "@/components/AddApplicantDialog";
import { ApplicantCVDialog } from "@/components/ApplicantCVDialog";
import { toast } from "@/components/ui/use-toast";
interface Application {
  id: string;
  candidateName: string;
  email: string;
  appliedDate: string;
  stage: "applied" | "screened" | "first_interview" | "second_interview";
  cv?: string;
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
  const [draggedApplication, setDraggedApplication] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [isCVDialogOpen, setIsCVDialogOpen] = useState(false);

  const fetchApplications = async () => {
    if (!roleId) return;
    
    try {
      const appId = parseInt(roleId);
      if (Number.isNaN(appId)) return;

      const { data, error } = await supabase
        .from("applicants")
        .select("*")
        .eq("application_id", appId);

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      const formattedApplications: Application[] = data?.map((applicant) => ({
        id: applicant.id,
        candidateName: `${applicant["first name"] || ""} ${applicant["last name"] || ""}`.trim(),
        email: applicant.email || "",
        appliedDate: applicant.created_at?.split("T")[0] || "",
        stage: getStageFromStatus(applicant.status || 1),
        cv: applicant.CV || undefined,
      })) || [];

      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const getStageFromStatus = (status: number): Application["stage"] => {
    switch (status) {
      case 2: return "screened";
      case 3: return "first_interview";
      case 4: return "second_interview";
      default: return "applied";
    }
  };

  const getStatusFromStage = (stage: Application["stage"]): number => {
    switch (stage) {
      case "screened": return 2;
      case "first_interview": return 3;
      case "second_interview": return 4;
      default: return 1;
    }
  };

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
          .eq("job_identification", roleId)
          .single();

        if (error) {
          console.error("Error fetching role:", error);
        } else {
          setRole(data);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    const loadData = async () => {
      await fetchRole();
      await fetchApplications();
      setLoading(false);
    };

    loadData();
  }, [roleId]);

  const getApplicationsByStage = (stageId: string) => {
    return applications.filter(app => app.stage === stageId);
  };

  const moveApplication = async (applicationId: string, newStage: string) => {
    const newStatus = getStatusFromStage(newStage as Application["stage"]);
    
    console.log('Moving application:', applicationId, 'to stage:', newStage, 'with status:', newStatus);
    
    try {
      const { error } = await supabase
        .from("applicants")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) {
        console.error("Error updating application:", error);
        toast({ title: "Update failed", description: "Could not update candidate status.", variant: "destructive" });
        return;
      }

      console.log('Successfully updated application status');
      toast({ title: "Status updated", description: `Moved to ${newStage.replace('_', ' ')}` });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, stage: newStage as Application["stage"] }
            : app
        )
      );
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedApplication(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (draggedApplication && targetStage !== applications.find(app => app.id === draggedApplication)?.stage) {
      moveApplication(draggedApplication, targetStage);
    }
    setDraggedApplication(null);
  };

  const handleDragEnd = () => {
    setDraggedApplication(null);
  };

  const handleCardClick = (application: Application, e: React.MouseEvent) => {
    // Don't open dialog if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setSelectedApplicant(application);
    setIsCVDialogOpen(true);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
          <AddApplicantDialog onApplicantAdded={fetchApplications} />
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
                
                <div className="space-y-3 flex-1"
                     onDragOver={handleDragOver}
                     onDrop={(e) => handleDrop(e, stage.id)}
                >
                   {stageApplications.map((application) => (
                     <Card 
                       key={application.id} 
                       className={`bg-card hover:shadow-md transition-shadow cursor-pointer ${
                         draggedApplication === application.id ? 'opacity-50' : ''
                       }`}
                       draggable
                       onDragStart={(e) => handleDragStart(e, application.id)}
                       onDragEnd={handleDragEnd}
                       onClick={(e) => handleCardClick(application, e)}
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

      <ApplicantCVDialog 
        isOpen={isCVDialogOpen}
        onClose={() => setIsCVDialogOpen(false)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default Applications;