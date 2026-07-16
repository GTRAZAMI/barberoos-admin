import { bookings } from "../data/mock";
import { DataTable, Panel } from "../components/ui";

export function Bookings() {
  return (
    <Panel title="Appointment manager" action="Open week view">
      <DataTable rows={bookings} columns={["client", "service", "barber", "time", "status"]} />
    </Panel>
  );
}
