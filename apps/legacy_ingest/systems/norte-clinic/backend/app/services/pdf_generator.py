from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
from datetime import datetime

class PDFGenerator:
    OUTPUT_DIR = "static/invoices"

    def __init__(self):
        # Ensure output directory exists
        os.makedirs(self.OUTPUT_DIR, exist_ok=True)

    def _draw_background(self, c, template_path):
        if template_path and os.path.exists(template_path):
            try:
                # Draw image covering the whole page
                c.drawImage(template_path, 0, 0, width=letter[0], height=letter[1])
            except Exception as e:
                print(f"Error loading template: {e}")

    def generate_invoice(self, invoice_data: dict, template_path: str = None) -> str:
        """
        Generates a PDF invoice (Receipt).
        """
        filename = f"recibo_{invoice_data['invoice_id']}_{int(datetime.now().timestamp())}.pdf"
        filepath = os.path.join(self.OUTPUT_DIR, filename)
        
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter
        
        if template_path:
            self._draw_background(c, template_path)
        else:
            # Default Header if no template
            c.setFont("Helvetica-Bold", 24)
            c.drawString(50, height - 50, "MedCura - Recibo Médico")
            c.line(50, height - 110, width - 50, height - 110)

        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, f"Data de Emissão: {datetime.now().strftime('%d/%m/%Y')}")
        c.drawString(50, height - 100, f"ID: #{invoice_data.get('invoice_id', 'N/A')}")

        # Content
        y = height - 150
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Emitente (Médico):")
        c.setFont("Helvetica", 12)
        c.drawString(200, y, invoice_data.get('doctor_name', 'Dr. Desconhecido'))
        
        y -= 30
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Pagador (Paciente):")
        c.setFont("Helvetica", 12)
        c.drawString(200, y, invoice_data.get('patient_name', 'Paciente'))

        if invoice_data.get('payer_cpf'):
             y -= 20
             c.drawString(200, y, f"CPF: {invoice_data.get('payer_cpf')}")

        y -= 30
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Beneficiário:")
        c.setFont("Helvetica", 12)
        c.drawString(200, y, invoice_data.get('beneficiary_name', invoice_data.get('patient_name', '')))

        y -= 40
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, "Descrição:")
        c.setFont("Helvetica", 12)
        c.drawString(200, y, invoice_data.get('description', 'Consulta Médica'))

        y -= 50
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, "Valor Total:")
        c.drawString(200, y, f"R$ {invoice_data.get('amount', 0.0):.2f}")

        # Footer
        if not template_path:
            c.setFont("Helvetica-Oblique", 10)
            c.drawString(50, 50, "Recibo gerado automaticamente pelo sistema MedCura.")
        
        c.save()
        return f"/{self.OUTPUT_DIR}/{filename}"

    def generate_certificate(self, data: dict, template_path: str = None) -> str:
        """
        Generates a Medical Certificate (Atestado).
        """
        filename = f"atestado_{data['doc_id']}_{int(datetime.now().timestamp())}.pdf"
        filepath = os.path.join(self.OUTPUT_DIR, filename)
        
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter
        
        if template_path:
            self._draw_background(c, template_path)
        else:
            c.setFont("Helvetica-Bold", 24)
            c.drawString(50, height - 50, "Atestado Médico")
            c.line(50, height - 70, width - 50, height - 70)

        # Content
        y = height - 150
        c.setFont("Helvetica", 14)
        
        # Wrapped text logic (simplified)
        text = f"Atesto para os devidos fins que o(a) Sr(a). {data.get('patient_name', 'Paciente')}"
        c.drawString(50, y, text)
        y -= 25
        text2 = f"foi atendido(a) na presente data e necessita de {data.get('days', 1)} dia(s) de repouso."
        c.drawString(50, y, text2)

        if data.get('cid'):
            y -= 40
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, y, f"CID: {data['cid']}")

        # Date and Signature
        y -= 100
        c.setFont("Helvetica", 12)
        # Use provided date or today
        date_obj = data.get('date')
        if isinstance(date_obj, str):
             date_str = date_obj # Assuming ISO or formatted
        elif isinstance(date_obj, datetime):
             date_str = date_obj.strftime('%d/%m/%Y')
        else:
             date_str = datetime.now().strftime('%d/%m/%Y')

        c.drawString(50, y, f"Data: {date_str}")

        y -= 60
        if not template_path: # If template doesn't have signature line
            c.line(50, y, 250, y)
        c.drawString(50, y - 20, data.get('doctor_name', 'Médico Responsável'))
        
        c.save()
        return f"/{self.OUTPUT_DIR}/{filename}"

    def generate_prescription(self, data: dict, template_path: str = None) -> str:
        """
        Generates a Prescription (Receita).
        """
        filename = f"receita_{data['doc_id']}_{int(datetime.now().timestamp())}.pdf"
        filepath = os.path.join(self.OUTPUT_DIR, filename)

        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter

        if template_path:
            self._draw_background(c, template_path)
        else:
            c.setFont("Helvetica-Bold", 24)
            c.drawString(50, height - 50, "Receita Médica")
            c.line(50, height - 70, width - 50, height - 70)

        y = height - 120
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, f"Paciente: {data.get('patient_name')}")
        
        y -= 50
        c.setFont("Helvetica", 12)
        
        # Split content by lines
        content = data.get('content', '')
        for line in content.split('\n'):
            c.drawString(50, y, line)
            y -= 20
        
        # Date
        y = 100
        date_str = datetime.now().strftime('%d/%m/%Y')
        c.drawString(50, y, f"Data: {date_str}")
        
        c.drawString(50, y - 40, data.get('doctor_name', ''))

        c.save()
        return f"/{self.OUTPUT_DIR}/{filename}"

pdf_service = PDFGenerator()
