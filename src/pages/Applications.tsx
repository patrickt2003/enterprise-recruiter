import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Video } from "lucide-react";
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
  rank?: number;
  fit_score?: number;
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
        rank: applicant.rank || 0,
        fit_score: applicant.fit_score || null,
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
    return applications
      .filter(app => app.stage === stageId)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));
  };

  const handleRankApplications = async () => {
    if (!roleId) return;
    
    try {
      const appId = parseInt(roleId);
      if (Number.isNaN(appId)) return;

      // Get all applicants in "Applied" stage for this job
      const { data: appliedApplicants, error: fetchError } = await supabase
        .from("applicants")
        .select("id")
        .eq("application_id", appId)
        .eq("status", 1); // Applied stage

      if (fetchError) {
        console.error("Error fetching applied applicants:", fetchError);
        toast({ title: "Error", description: "Failed to fetch applicants.", variant: "destructive" });
        return;
      }

      if (!appliedApplicants || appliedApplicants.length === 0) {
        toast({ title: "No applicants", description: "No applicants found in Applied stage.", variant: "destructive" });
        return;
      }

      // Generate unique random ranks (1 to number of applicants)
      const numberOfApplicants = appliedApplicants.length;
      const ranks = Array.from({ length: numberOfApplicants }, (_, i) => i + 1);
      
      // Fisher-Yates shuffle to randomize ranks
      for (let i = ranks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
      }

      // Calculate fit scores based on ranks (higher rank = higher fit score)
      const calculateFitScore = (rank: number, totalApplicants: number): number => {
        // Distribute scores from 100% down to 60% based on rank
        // Rank 1 gets highest score, rank N gets lowest score
        const maxScore = 100;
        const minScore = 60;
        const scoreRange = maxScore - minScore;
        
        // Calculate score: higher rank (lower number) = higher score
        const fitScore = maxScore - ((rank - 1) / (totalApplicants - 1)) * scoreRange;
        return Math.round(fitScore); // Round to nearest integer
      };

      // Update each applicant with their random rank and corresponding fit score
      const updatePromises = appliedApplicants.map((applicant, index) => {
        const rank = ranks[index];
        const fitScore = calculateFitScore(rank, numberOfApplicants);
        
        return supabase
          .from("applicants")
          .update({ 
            rank: rank,
            fit_score: fitScore 
          })
          .eq("id", applicant.id);
      });

      const results = await Promise.all(updatePromises);
      
      // Check for any errors in the updates
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        console.error("Some updates failed:", results);
        toast({ title: "Partial success", description: "Some ranks may not have been updated.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: `Ranked ${numberOfApplicants} applicants with fit scores.` });
      }

      // Refresh the applications to show new ranks and fit scores
      await fetchApplications();
      
    } catch (error) {
      console.error("Error ranking applications:", error);
      toast({ title: "Error", description: "Failed to rank applicants.", variant: "destructive" });
    }
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
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{stage.title}</h3>
                    {stage.id === "applied" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-bold scale-110"
                        onClick={handleRankApplications}
                      >
                        RANK
                      </Button>
                    )}
                  </div>
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
                         <div className="flex items-center justify-between">
                           <CardTitle className="text-base font-medium">
                             {application.candidateName}
                           </CardTitle>
                           <div className="flex items-center gap-2">
                              {application.stage === "applied" && (
                                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-semibold">
                                  {application.fit_score ? `${application.fit_score}%` : 'N/A'} fit
                                </div>
                              )}
                             {application.stage === "screened" && (
                               <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-xs h-16 w-16 p-0"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   // Phone action logic can be added here
                                 }}
                               >
                                 <Phone className="h-48 w-48" />
                               </Button>
                             )}
                             {application.stage === "first_interview" && (
                               <Button
                                 size="sm"
                                 variant="outline"
                                 className="text-xs h-16 w-16 p-0"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   // Video action logic can be added here
                                 }}
                               >
                                 <Video className="h-48 w-48" />
                               </Button>
                             )}
                           </div>
                         </div>
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