import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Save } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("companies").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setCompany(data);
        setName(data.name || "");
        setIndustry(data.industry || "");
        setWebsiteUrl(data.website_url || "");
        setDescription(data.description || "");
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    const { error } = await supabase.from("companies").update({ name, industry, website_url: websiteUrl, description }).eq("id", company.id);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved!" });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 pt-16 md:pt-8 space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your company profile and monitoring preferences.</p>
        </div>

        <div className="stat-card space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground text-sm">Company Profile</h3>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Industry</Label>
              <Input value={industry} onChange={e => setIndustry(e.target.value)} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Website URL</Label>
              <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="bg-secondary border-border" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-secondary border-border" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="btn-teal gap-2">
            <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="stat-card space-y-3">
          <h3 className="font-display font-semibold text-foreground text-sm">Account</h3>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="text-xs text-muted-foreground">Logged in as</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{user?.email}</div>
          </div>
          <Button variant="outline" onClick={() => navigate("/onboarding")} className="border-border text-sm">
            Re-run Onboarding Setup
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
