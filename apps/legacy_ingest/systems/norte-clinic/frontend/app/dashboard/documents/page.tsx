"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jsPDF } from "jspdf";
import { FileText, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tipos exemplo (ajuste conforme schemas)
type Document = {
    id: string;
    type: string;
    patient_name: string;
    details: string;
    date: string;
    file_url: string;
};

export default function DocumentsPage() {
    const [open, setOpen] = useState(false);
    const [template, setTemplate] = useState("");
    const [patient, setPatient] = useState("");
    const [details, setDetails] = useState("");

    const { data: documents = [] } = useQuery<Document[]>({
        queryKey: ["documents"],
        queryFn: () => api.get("/documents").then(res => res.data),
    });

    const mutation = useMutation({
        mutationFn: (data: { type: string; patient: string; details: string }) => api.post("/documents/generate", data),
        onSuccess: (res, variables) => {
            toast.success("Documento gerado!");
            // Assuming backend returns base64 or url, but for now we download what we have or just mock
            if (res.data.pdf_base64) {
                downloadPdf(res.data.pdf_base64, `${variables.type}-${variables.patient}.pdf`);
            }
            setOpen(false);
        },
        onError: () => toast.error("Erro ao gerar documento"),
    });

    const generateAndPreview = () => {
        // Preview simples (use React-PDF para embed real se precisar)
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(`Documento: ${template}`, 10, 20);
        doc.setFontSize(16);
        doc.text(`Paciente: ${patient}`, 10, 40);
        doc.setFontSize(12);
        doc.text(details, 10, 60);
        doc.text("Assinatura: __________________________", 10, 150);
        doc.output("dataurlnewwindow"); // Abre preview em nova aba
    };

    const downloadPdf = (base64: string, filename: string) => {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = filename;
        link.click();
    };

    return (
        <div className="p-6 space-y-6 bg-background min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Emissão de Documentos</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Novo Documento</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Novo Documento</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Tipo de Documento</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="receita">Receita Médica</SelectItem>
                                        <SelectItem value="recibo">Recibo de Pagamento</SelectItem>
                                        <SelectItem value="guia-convenio">Guia de Convênio (TISS)</SelectItem>
                                        <SelectItem value="atestado">Atestado Médico</SelectItem>
                                        <SelectItem value="nota-fiscal">Nota Fiscal (NFSe)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Paciente</Label>
                                <Input value={patient} onChange={e => setPatient(e.target.value)} placeholder="Nome do paciente" />
                            </div>
                            <div>
                                <Label>Detalhes</Label>
                                <Input value={details} onChange={e => setDetails(e.target.value)} placeholder="Descrição, medicamento, etc." />
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={generateAndPreview} variant="outline">Preview & Imprimir</Button>
                                <Button onClick={() => mutation.mutate({ type: template, patient, details })}>Gerar & Salvar</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Links Oficiais */}
            <Card className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Links Úteis para Emissão Oficial</h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" asChild>
                        <a href="https://www.gov.br/receitafederal/pt-br" target="_blank" rel="noopener noreferrer">
                            Receita Federal (DIRPF, CPF, etc.)
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://www.gov.br/pt-br/servicos/emitir-nota-fiscal-de-servico-eletronica" target="_blank" rel="noopener noreferrer">
                            Emissão de Nota Fiscal (NFSe Geral)
                        </a>
                    </Button>
                    {/* Adapte por estado: ex SP */}
                    <Button variant="outline" asChild>
                        <a href="https://nfe.prefeitura.sp.gov.br/publico/nota_fiscal_eletronica.aspx" target="_blank" rel="noopener noreferrer">
                            NFSe São Paulo
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://www.crm.org.br" target="_blank" rel="noopener noreferrer">
                            CFM (Normas para Receitas/Atestados)
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://www.ans.gov.br" target="_blank" rel="noopener noreferrer">
                            ANS (Padrões TISS para Convênios)
                        </a>
                    </Button>
                </div>
            </Card>

            {/* Histórico */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tipo</th>
                                <th className="p-3 text-left">Paciente</th>
                                <th className="p-3 text-left">Detalhes</th>
                                <th className="p-3 text-left">Data</th>
                                <th className="p-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Nenhum documento gerado ainda.
                                    </td>
                                </tr>
                            ) : (
                                documents.map(doc => (
                                    <tr key={doc.id} className="border-b">
                                        <td className="p-3">{doc.id}</td>
                                        <td className="p-3">{doc.type}</td>
                                        <td className="p-3">{doc.patient_name}</td>
                                        <td className="p-3 text-muted-foreground truncate">{doc.details}</td>
                                        <td className="p-3">{doc.date}</td>
                                        <td className="p-3 text-right">
                                            <Button variant="ghost" onClick={() => downloadPdf(doc.file_url, `${doc.type}-${doc.id}.pdf`)}>
                                                <Download className="h-4 w-4 mr-1" /> Baixar
                                            </Button>
                                            <Button variant="ghost" onClick={() => window.print()}>
                                                <Printer className="h-4 w-4 mr-1" /> Imprimir
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
