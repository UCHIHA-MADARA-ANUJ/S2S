import { getStats } from "@/lib/data/stats";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getStats();
  const user = await getCurrentUser();
  let myData: any = null;

  if (user) {
    const supabase = createServiceClient();
    if (supabase) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const { data: myResponses } = await supabase.from("survey_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
      myData = {
        email: user.email,
        profile,
        myResponse: myResponses?.[0] || null
      };
    }
  }

  return <DashboardClient stats={stats} myData={myData} />;
}
