import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** One member row as rendered in the members card. */
export interface MemberRow {
  userId: string;
  name: string;
  role: "owner" | "member";
}

/**
 * Members card (spec §2.7): name + role badge per member. Action buttons
 * (remove/leave) are mounted by the mutations task, not here.
 */
export function MemberList({ members }: { members: MemberRow[] }) {
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
              <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                {member.role === "owner" ? "Owner" : "Member"}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
