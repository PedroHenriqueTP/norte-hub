import { getAuthContext } from "@/services/auth-context";
import { ClientService } from "@/services/client.service";
import NewProposalForm from "@/components/proposals/NewProposalForm";

export default async function NewProposalPage() {
    const { tenantId } = await getAuthContext();
    const clients = await ClientService.with(tenantId).getAll();

    return <NewProposalForm clients={clients} />;
}
