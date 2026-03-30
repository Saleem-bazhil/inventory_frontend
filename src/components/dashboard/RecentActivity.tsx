import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface RecentActivityProps {
  data: Transaction[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-sm">{formatDate(tx.date)}</TableCell>
                <TableCell className="font-medium">{tx.material_name}</TableCell>
                <TableCell>
                  <Badge variant={tx.type === "in" ? "success" : "destructive"}>
                    {tx.type === "in" ? "IN" : "OUT"}
                  </Badge>
                </TableCell>
                <TableCell>{tx.quantity}</TableCell>
                <TableCell className="text-sm text-slate-500">{tx.customer_name}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                  No recent activity
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
