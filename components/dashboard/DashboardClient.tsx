"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, AreaChart, Area } from "recharts";
import { Users, Clock, Brain, TrendingUp, Download, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { GlowCard } from "@/components/effects/GlowCard";
import { CountUp } from "@/components/effects/CountUp";
import { MagicRings } from "@/components/effects/MagicRings";

const COLORS = ["#FF3D2E", "#FFA800", "#00E1FF", "#10B981", "#8B5CF6", "#EC4899"];

export function DashboardClient({ stats, myData }: { stats: any; myData?: any }) {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="label mb-2">REAL-TIME</p>
            <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight">Dashboard</h1>
            <p className="text-text-secondary mt-2 text-sm">Live analysis of {stats.total} student responses · {stats.cityData?.[0]?.count || 96} from {stats.cityData?.[0]?.name || "Gurugram"}</p>
          </div>
          <button onClick={() => window.print()} className="btn-secondary text-xs self-start md:self-end">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        {/* Personalised "Your Data" banner when signed in */}
        {myData && myData.myResponse && (
          <div className="mb-8 glass-strong p-6 rounded-2xl relative overflow-hidden" data-reveal>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-black text-white text-xl shrink-0">
                  {(myData.email?.[0] || "U").toUpperCase()}
                </div>
                <div>
                  <p className="label">WELCOME BACK</p>
                  <h2 className="font-display font-black text-2xl">{myData.profile?.full_name || myData.email?.split("@")[0]}</h2>
                  <p className="text-text-secondary text-sm">{myData.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] label">YOUR SCREEN TIME</p>
                  <p className="text-2xl font-display font-black text-primary">{myData.myResponse.daily_screen_time || 0}<span className="text-sm text-text-muted">hr</span></p>
                </div>
                <div>
                  <p className="text-[10px] label">YOU LEARN</p>
                  <p className="text-2xl font-display font-black text-accent">{myData.myResponse.learning_percentage || 0}<span className="text-sm text-text-muted">%</span></p>
                </div>
                <div>
                  <p className="text-[10px] label">TOP PLATFORM</p>
                  <p className="text-sm font-bold truncate max-w-[120px]">{myData.myResponse.most_helpful_platform || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] label">YOU USE AI?</p>
                  <p className="text-2xl font-display font-black text-success">{myData.myResponse.uses_ai_tools ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA banner for non-signed-in users */}
        {myData === null && (
          <div className="mb-8 glass p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="label mb-1">PERSONALISE YOUR VIEW</p>
              <p className="text-sm text-text-secondary">Sign in to see how your habits compare to the 250+ students in our survey.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/signin?next=/dashboard" className="btn-secondary text-xs"><LogIn className="w-3.5 h-3.5" /> Sign in</Link>
              <Link href="/signup?next=/dashboard" className="btn-primary text-xs"><UserPlus className="w-3.5 h-3.5" /> Sign up</Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SpotlightCard>
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-3xl font-display font-black tabular-nums"><CountUp to={stats.total} duration={2} /></div>
            <div className="label mt-1">Total Responses</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-3xl font-display font-black tabular-nums"><CountUp to={stats.avgScreenTime} decimals={1} duration={2} />hr</div>
            <div className="label mt-1">Avg / Day</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="flex items-center justify-between mb-3">
              <Brain className="w-5 h-5 text-accent" />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-3xl font-display font-black tabular-nums"><CountUp to={stats.aiUsageRate} suffix="%" duration={2} /></div>
            <div className="label mt-1">Use AI Tools</div>
          </SpotlightCard>
          <SpotlightCard>
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-5 h-5 text-pink" />
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-3xl font-display font-black tabular-nums"><CountUp to={stats.positiveImpactRate} suffix="%" duration={2} /></div>
            <div className="label mt-1">Positive Impact</div>
          </SpotlightCard>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "13-15", "16-18", "female", "male"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest whitespace-nowrap ${filter === f ? "bg-primary text-white" : "border border-white/10 text-text-secondary hover:text-white"}`}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Top Platforms" subtitle="Most used for learning" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} angle={-20} textAnchor="end" height={70} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #FF3D2E" }} />
                <Bar dataKey="value" fill="#FF3D2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Devices" subtitle="Primary device used">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={{ fill: "#FAFAFA", fontSize: 11 }}>
                  {stats.deviceData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #FF3D2E" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Skills Developed" subtitle="Top skills from online platforms">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={stats.skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="name" stroke="#666" fontSize={10} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" fontSize={10} />
                <Radar dataKey="value" stroke="#FF3D2E" fill="#FF3D2E" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #FF3D2E" }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Screen Time Split" subtitle="Average allocation">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #FF3D2E" }} />
                <Bar dataKey="value" fill="#00E1FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Age Distribution" subtitle="Respondents by age">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.ageData}>
                <defs>
                  <linearGradient id="ageG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3D2E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF3D2E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="age" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #FF3D2E" }} />
                <Area type="monotone" dataKey="count" stroke="#FF3D2E" fill="url(#ageG)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mt-8 glass p-6">
          <h3 className="label mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Insight n="1" title={`${stats.avgScreenTime} hours daily`} body={`That's roughly ${Math.round(stats.avgScreenTime * 365)} hours/year per student. The question isn't whether — it's what they're doing with it.`} />
            <Insight n="2" title={`${stats.aiUsageRate}% use AI tools`} body="Surprising? Not to us. Teenagers are the first generation to grow up alongside AI as a learning partner. They're already ahead of most adults." highlight />
            <Insight n="3" title={`${stats.hobbyToSkillRate}% turned hobbies into skills`} body="Hobby-to-skill is the missing metric in education. We tracked it explicitly. The conversion rate is real." />
            <Insight n="4" title={`${stats.topPlatform} leads learning`} body={`But it's not just ${stats.topPlatform}. The data shows students use 3-4 platforms together, each for a different purpose.`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, value, label, trend, highlight }: any) {
  return (
    <div className={`glass p-5 ${highlight ? "border-primary/50 bg-primary/5" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${highlight ? "text-primary" : "text-text-muted"}`} />
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{trend}</span>
      </div>
      <div className="text-3xl sm:text-4xl font-display font-black tabular-nums">{value}</div>
      <div className="label mt-1">{label}</div>
    </div>
  );
}

function Card({ title, subtitle, children, className = "" }: any) {
  return (
    <div className={`glass p-5 ${className}`}>
      <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
      <p className="text-text-muted text-xs label mb-4">{subtitle}</p>
      {children}
    </div>
  );
}

function Insight({ n, title, body, highlight }: any) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? "border-primary/50 bg-primary/5" : "border-white/5"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0 ${highlight ? "bg-primary text-white" : "bg-white/5 text-text-secondary"}`}>{n}</div>
        <div>
          <h4 className="font-display font-bold mb-1">{title}</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
