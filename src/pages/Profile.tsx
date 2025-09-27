import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CompanyProfile {
  company_name: string;
  company_values: string;
  company_description: string;
  company_mission: string;
  company_vision: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: "",
    company_values: "",
    company_description: "",
    company_mission: "",
    company_vision: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_name, company_values, company_description, company_mission, company_vision")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          company_name: data.company_name || "",
          company_values: data.company_values || "",
          company_description: data.company_description || "",
          company_mission: data.company_mission || "",
          company_vision: data.company_vision || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Company profile saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CompanyProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account and company information</p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details and login information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This is the email address you use to sign in
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Configure your company information and values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Enter your company name"
                    value={profile.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="company_description">Company Description</Label>
                  <Textarea
                    id="company_description"
                    placeholder="Briefly describe what your company does"
                    value={profile.company_description}
                    onChange={(e) => handleInputChange("company_description", e.target.value)}
                    rows={3}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="company_mission">Mission Statement</Label>
                  <Textarea
                    id="company_mission"
                    placeholder="What is your company's mission?"
                    value={profile.company_mission}
                    onChange={(e) => handleInputChange("company_mission", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="company_vision">Vision Statement</Label>
                  <Textarea
                    id="company_vision"
                    placeholder="What is your company's vision for the future?"
                    value={profile.company_vision}
                    onChange={(e) => handleInputChange("company_vision", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="company_values">Company Values</Label>
                  <Textarea
                    id="company_values"
                    placeholder="List your company's core values (one per line or separated by commas)"
                    value={profile.company_values}
                    onChange={(e) => handleInputChange("company_values", e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    These values will help guide your HR decisions and company culture
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Link to="/">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Button onClick={saveProfile} disabled={saving} className="min-w-32">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}