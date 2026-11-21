import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkspaceSummary } from "@/lib/workspaces/queries";

/**
 * Dashboard body (spec §2.6): one card per owned/joined workspace with a
 * role badge. The empty state is unreachable in practice (onboarding gate
 * guarantees >= 1 workspace) but renders defensively anyway.
 */
export function DashboardView({ workspaces }: { workspaces: WorkspaceSummary[] }) {
  return (
    <div>
      {workspaces.length === 0 ? (
        <p className="text-muted-foreground">No workspaces yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <li key={workspace.id}>
              <Link href={`/w/${workspace.id}`} className="block">
                <Card className="transition hover:border-foreground/30">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{workspace.name}</span>
                      <Badge variant={workspace.role === "owner" ? "default" : "secondary"}>
                        {workspace.role === "owner" ? "Owner" : "Member"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
