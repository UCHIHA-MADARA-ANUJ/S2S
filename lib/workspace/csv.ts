import Papa from "papaparse";
import type { ColumnMeta } from "./store";

export function parseCSV(file: File): Promise<{ data: any[]; columns: ColumnMeta[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.filter((row: any) => Object.keys(row).length > 0);
        const columns = detectColumnTypes(data, results.meta.fields || []);
        resolve({ data, columns });
      },
      error: (err) => reject(err)
    });
  });
}

export function detectColumnTypes(data: any[], fields: string[]): ColumnMeta[] {
  if (!data.length) return fields.map(name => ({ name, type: "text" }));

  return fields.map(name => {
    const values = data.map(r => r[name]).filter(v => v !== null && v !== undefined && v !== "");
    if (!values.length) return { name, type: "text" };

    const numericCount = values.filter(v => typeof v === "number" || (!isNaN(parseFloat(v)) && isFinite(v))).length;
    const dateCount = values.filter(v => {
      if (v instanceof Date) return true;
      const d = new Date(String(v));
      return !isNaN(d.getTime()) && String(v).length > 6;
    }).length;

    let type: ColumnMeta["type"] = "text";
    if (numericCount / values.length > 0.8) type = "numeric";
    else if (dateCount / values.length > 0.8) type = "date";
    else if (new Set(values).size < values.length * 0.5 && new Set(values).size < 30) type = "categorical";

    const meta: ColumnMeta = { name, type, uniqueValues: new Set(values).size };
    if (type === "numeric") {
      const nums = values.map(v => Number(v)).filter(n => !isNaN(n));
      if (nums.length) {
        meta.min = Math.min(...nums);
        meta.max = Math.max(...nums);
      }
    }
    return meta;
  });
}

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateSampleCSV(type: "grades" | "sales" | "survey"): { name: string; csv: string } {
  let csv = "";
  if (type === "grades") {
    csv = "student_id,name,subject,score,grade,attendance_pct\n";
    const subjects = ["Math", "Science", "English", "History", "Computer"];
    for (let i = 1; i <= 100; i++) {
      const subject = subjects[i % subjects.length];
      const score = Math.floor(Math.random() * 40) + 60;
      const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
      csv += `${i},Student ${i},${subject},${score},${grade},${Math.floor(Math.random() * 30) + 70}\n`;
    }
  } else if (type === "sales") {
    csv = "date,product,region,units_sold,revenue,customer_rating\n";
    const products = ["Laptop", "Phone", "Tablet", "Watch", "Headphones"];
    const regions = ["North", "South", "East", "West"];
    for (let i = 0; i < 50; i++) {
      const date = new Date(2026, 0, 1 + i * 7).toISOString().split("T")[0];
      const product = products[i % products.length];
      const region = regions[i % regions.length];
      const units = Math.floor(Math.random() * 50) + 10;
      const revenue = units * (Math.floor(Math.random() * 200) + 50);
      const rating = (Math.random() * 2 + 3).toFixed(1);
      csv += `${date},${product},${region},${units},${revenue},${rating}\n`;
    }
  } else {
    csv = "respondent_id,age,gender,platform,hours_per_day,satisfaction,would_recommend\n";
    const platforms = ["YouTube", "Instagram", "TikTok", "Discord", "Reddit"];
    for (let i = 1; i <= 200; i++) {
      const platform = platforms[i % platforms.length];
      csv += `${i},${Math.floor(Math.random() * 8) + 13},${i % 2 ? "Male" : "Female"},${platform},${(Math.random() * 5 + 1).toFixed(1)},${Math.floor(Math.random() * 5) + 1},${Math.random() > 0.5}\n`;
    }
  }
  return { name: `sample-${type}.csv`, csv };
}
