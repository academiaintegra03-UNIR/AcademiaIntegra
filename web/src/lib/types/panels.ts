import type { LucideIcon } from "lucide-react";
import type { StatusTone } from "@/components/shared/status-badge";

export interface Stat {
  label: string;
  value: string;
}

export interface ProgressItem {
  name: string;
  pct: number;
}

export interface WeekBar {
  label: string;
  value: number;
}

export interface ToneLabel {
  label: string;
  tone: StatusTone;
}

// ---- Campus (estudiante) ----
export interface UpcomingTask {
  name: string;
  course: string;
  due: string;
  tone: StatusTone;
}

export interface RouteDetailModule {
  name: string;
  lessons: number;
  status: "Completado" | "En curso" | "Pendiente";
}

export interface CourseProgress {
  name: string;
  level: string;
  pct: number;
}

export interface SimAttempt {
  name: string;
  date: string;
  score: string;
  tone: StatusTone;
}

export interface AvailableSim {
  name: string;
  questions: number;
  duration: string;
}

// ---- Acudientes ----
export interface StudentReport {
  title: string;
  date: string;
  status: string;
  tone: StatusTone;
}

export interface Invoice {
  desc: string;
  date: string;
  amount: string;
  status: string;
  tone: StatusTone;
}

export interface InboxMessage {
  from: string;
  date: string;
  text: string;
}

// ---- Colegios panel ----
export interface AttentionStudent {
  name: string;
  reason: string;
}

export interface SchoolStudentRow {
  name: string;
  group: string;
  pct: number;
  status: string;
  tone: StatusTone;
}

export interface SchoolSimulation {
  name: string;
  date: string;
  participation: string;
}

export interface SchoolReport {
  title: string;
}

// ---- Tutores ----
export interface ClassSlot {
  time: string;
  name: string;
  group: string;
}

export interface WeekClass {
  day: string;
  name: string;
  time: string;
}

export interface AssignedStudent {
  name: string;
  group: string;
  due: string;
  alert: string;
  tone: StatusTone;
}

export interface GradingItem {
  title: string;
  student: string;
  course: string;
}

export interface GeneratedReport {
  title: string;
  date: string;
}

// ---- Admin ----
export interface AdminAlert {
  icon: LucideIcon;
  text: string;
  tone: StatusTone;
}

export interface AdminUserRow {
  name: string;
  email: string;
  role: string;
  roleTone: StatusTone;
  status: string;
  statusTone: StatusTone;
}

export interface AdminProgramRow {
  name: string;
  level: string;
  seats: string;
  status: string;
  tone: StatusTone;
}

export interface AdminEnrollmentRow {
  student: string;
  program: string;
  plan: string;
  status: string;
  tone: StatusTone;
}

export interface AdminPaymentRow {
  desc: string;
  amount: string;
  method: string;
  status: string;
  tone: StatusTone;
}

export interface AdminScheduledReport {
  title: string;
  to: string;
  when: string;
  status: string;
  tone: StatusTone;
}
