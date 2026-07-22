import AppLayout from "@/components/AppLayout";
import TripForm from "@/components/trips/TripForm";

export default function NewTripPage() {
  return (
    <AppLayout title="New Trip">
      <TripForm />
    </AppLayout>
  );
}