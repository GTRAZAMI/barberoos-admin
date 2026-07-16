import { orders } from "../data/mock";
import { DataTable, Panel } from "../components/ui";

export function Orders() {
  return (
    <Panel title="Orders and delivery">
      <DataTable rows={orders} columns={["id", "client", "total", "delivery", "status"]} />
    </Panel>
  );
}
