import { getAuthContext } from "@/services/auth-context";
import { ClientService } from "@/services/client.service";
import NewJobForm from "@/components/jobs/NewJobForm";

export default async function NewJobPage() {
    const { tenantId } = await getAuthContext();
    const clients = await ClientService.with(tenantId).getAll();

    return <NewJobForm clients={clients} />;
}
