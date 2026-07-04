import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({ children, className = "", containerClassName = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-24 ${className}`} data-reveal>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({ label, title, description, align = "center" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
      {label && <p className="label mb-3">{label}</p>}
      <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
        {title}
      </h2>
      {description && <p className={`text-text-secondary text-lg ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>{description}</p>}
    </div>
  );
}

export interface CTAProps {
  title: string;
  description?: string;
  primary?: { label: string; href: string; icon?: React.ReactNode };
  secondary?: { label: string; href: string; icon?: React.ReactNode };
}

export function CTA({ title, description, primary, secondary }: CTAProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto text-center" data-reveal>
      <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4">{title}</h2>
      {description && <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">{description}</p>}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {primary && (
          <Link href={primary.href} className="btn-primary text-sm">
            {primary.icon || <ArrowRight className="w-4 h-4" />} {primary.label}
          </Link>
        )}
        {secondary && (
          <Link href={secondary.href} className="btn-secondary text-sm">
            {secondary.icon} {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
