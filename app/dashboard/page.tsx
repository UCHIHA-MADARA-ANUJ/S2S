import { getStats } from "@/lib/data/stats";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const stats = await getStats();
  return <DashboardClient stats={stats} />;
}
