import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** One member row as rendered in the members card. */
export interface MemberRow {
  userId: string;
  name: string;
  role: "owner" | "member";
}

/**
 * Members card (spec §2.7): name + role badge per member, with an optional
 * per-row action slot (owner: remove; rendered only for owner callers).
 */
export function MemberList({
  members,
  actions,
}: {
  members: MemberRow[];
  /** Optional per-row action (owner: remove; rendered only for owner callers). */
  actions?: (member: MemberRow) => ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.userId} className="flex items-center justify-between">
              <span>{member.name || member.userId}</span>
              <div className="flex items-center gap-2">
                {actions?.(member)}
                <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                  {member.role === "owner" ? "Owner" : "Member"}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
