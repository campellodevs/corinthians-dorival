import { NextResponse } from "next/server";
import { getDashboardApiPayload } from "@/app/lib/dashboard-data";

export async function GET() {
  try {
    const payload = await getDashboardApiPayload();
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Falha ao carregar os dados do dashboard.",
      },
      { status: 500 },
    );
  }
}
