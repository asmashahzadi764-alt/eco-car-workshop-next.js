import { NextResponse } from "next/server";
import { business } from "@/lib/data";
export function GET() { return NextResponse.json(business); }
