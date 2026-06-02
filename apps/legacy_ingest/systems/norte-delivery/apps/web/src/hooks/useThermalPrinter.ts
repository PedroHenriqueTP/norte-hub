
import { useCallback } from 'react';

type ReceiptItem = {
    name: string;
    quantity: number;
    price: number;
};

type ReceiptData = {
    storeName: string;
    orderId: string; // or number
    table?: string;
    items: ReceiptItem[];
    total: number;
    paymentMethod?: string;
    date: Date;
};

export function useThermalPrinter() {
    const printReceipt = useCallback((data: ReceiptData) => {
        // Create a hidden iframe or a new window
        const printWindow = window.open('', '_blank', 'width=400,height=600');
        if (!printWindow) {
            alert('Permita popups para imprimir');
            return;
        }

        const itemsHtml = data.items.map(item => `
            <div class="item">
                <span class="qty">${item.quantity}x</span>
                <span class="name">${item.name}</span>
                <span class="price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const html = `
            <html>
            <head>
                <title>Recibo</title>
                <style>
                    body {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 12px;
                        width: 80mm; /* 80mm paper */
                        margin: 0;
                        padding: 10px;
                    }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed black; padding-bottom: 10px; }
                    .title { font-size: 16px; font-weight: bold; }
                    .info { margin-bottom: 5px; }
                    .item { display: flex; margin-bottom: 5px; }
                    .qty { width: 30px; font-weight: bold; }
                    .name { flex: 1; margin-right: 5px; }
                    .price { width: 60px; text-align: right; }
                    .totals { margin-top: 20px; border-top: 1px dashed black; padding-top: 10px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
                    .footer { margin-top: 30px; text-align: center; font-size: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">${data.storeName}</div>
                    <div class="info">Pedido: #${data.orderId}</div>
                    <div class="info">${data.date.toLocaleString('pt-BR')}</div>
                    ${data.table ? `<div class="info">Mesa: ${data.table}</div>` : ''}
                </div>

                <div class="items">
                    ${itemsHtml}
                </div>

                <div class="totals">
                    <div class="row">
                        <span>TOTAL</span>
                        <span>R$ ${data.total.toFixed(2)}</span>
                    </div>
                    ${data.paymentMethod ? `
                    <div class="row" style="font-size: 12px; font-weight: normal;">
                        <span>Pagamento</span>
                        <span>${data.paymentMethod}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="footer">
                    <p>Obrigado pela preferência!</p>
                    <p>Volte Sempre</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    }, []);

    return { printReceipt };
}
