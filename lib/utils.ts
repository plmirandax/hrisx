import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ApproveLeaveValues {
  id: string; // or number if your ID is numeric
  status: string;
  approverRemarks: string;
}