import { clsx, type ClassValue } from "clsx"
import { IronSession } from "iron-session";
import { NextApiRequest } from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface SessionData {
  veridaToken?: string;
}

export interface RequestWithSession extends NextApiRequest {
  session: IronSession<SessionData>;
}

export function toPascalCase(input: string) {
  return input
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}