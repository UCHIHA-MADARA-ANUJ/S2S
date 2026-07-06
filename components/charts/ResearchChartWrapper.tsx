"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie as RPie, Cell, Legend, ScatterChart, Scatter, ZAxis, ComposedChart } from "recharts";

const TS = { background: "#0a0a0a", border: "1px solid #FF3D2E" };

export function BarV({ data, color, name = "value" }: { data: any[]; color: string; name?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
        <XAxis type="number" stroke="#A1A1AA" fontSize={11} />
        <YAxis dataKey="name" type="category" stroke="#A1A1AA" fontSize={10} width={100} />
        <Tooltip contentStyle={TS} />
        <Bar dataKey={name} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BarH({ data, color, name = "value" }: { data: any[]; color: string; name?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
        <XAxis dataKey="name" stroke="#A1A1AA" fontSize={10} angle={-20} textAnchor="end" height={70} />
        <YAxis stroke="#A1A1AA" fontSize={11} />
        <Tooltip contentStyle={TS} />
        <Bar dataKey={name} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BarHDomain({ data, color, name = "value", domain }: { data: any[]; color: string; name?: string; domain?: [number, number] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
        <XAxis dataKey="name" stroke="#A1A1AA" fontSize={9} angle={-30} textAnchor="end" height={80} />
        <YAxis stroke="#A1A1AA" fontSize={11} domain={domain} />
        <Tooltip contentStyle={TS} />
        <Bar dataKey={name} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieC({ data, colors }: { data: any[]; colors: string[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <RPie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={{ fill: "#FAFAFA", fontSize: 10 }}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </RPie>
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Tooltip contentStyle={TS} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ScatterC({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
        <XAxis dataKey="avg_practice_hours" name="Hours" stroke="#A1A1AA" fontSize={11} />
        <YAxis dataKey="completion_rate" name="Completion" stroke="#A1A1AA" fontSize={11} domain={[0, 1]} />
        <ZAxis dataKey="engagement_score" range={[50, 400]} name="Engagement" />
        <Tooltip contentStyle={TS} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#FF3D2E" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function ComposedC({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
        <XAxis dataKey="platform" stroke="#A1A1AA" fontSize={10} angle={-20} textAnchor="end" height={70} />
        <YAxis stroke="#A1A1AA" fontSize={11} domain={[0, 10]} />
        <Tooltip contentStyle={TS} />
        <Bar dataKey="before" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Before" />
        <Bar dataKey="after" fill="#10B981" radius={[4, 4, 0, 0]} name="After" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
