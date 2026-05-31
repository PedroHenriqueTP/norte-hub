const crypto = require('crypto');

// ConfiguraÃ§Ãµes de Planos
const PLANS = [
    { name: 'Starter', price: 99.00, features: ['CardÃ¡pio Digital', 'Pedidos WhatsApp'] },
    { name: 'Pro', price: 199.00, features: ['CardÃ¡pio Digital', 'Pedidos Online', 'GestÃ£o Motoboy', 'CRM'] },
    { name: 'Enterprise', price: 499.00, features: ['Tudo do Pro', 'App PrÃ³prio', 'Consultoria'] }
];

// Gerador de Nomes de Restaurante
const PREFIXES = ['Pizzaria', 'Burger', 'Sushi', 'Cantina', 'Lanchonete', 'Restaurante', 'Bar', 'BistrÃ´'];
const SUFFIXES = ['do Luigi', 'Express', 'King', 'Imperial', 'da Esquina', 'Gourmet', 'Central', 'Brasil'];

function generateName() {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return `${prefix} ${suffix}`;
}

// SimulaÃ§Ã£o de AdesÃ£o
function simulateOnboarding(leads = 10, conversionRate = 0.3) {
    const conversions = Math.round(leads * conversionRate);
    const results = [];

    for (let i = 0; i < conversions; i++) {
        const plan = PLANS[Math.floor(Math.random() * (PLANS.length - 0.1))]; // Leve viÃ©s para planos menores

        // Simular Falha de Pagamento (15% chance)
        const isPaymentSuccess = Math.random() > 0.15;

        results.push({
            name: generateName(),
            plan: plan,
            status: isPaymentSuccess ? 'ACTIVE' : 'PAYMENT_FAILED',
            ltv_projection: isPaymentSuccess ? (plan.price * 12) : 0 // LTV simples de 1 ano
        });
    }
    return results;
}

// RelatÃ³rio Executivo
function generateReport(data) {
    console.log(`
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘ ðŸ“Š systems MASTERMIND REPORT - Daily Ops                        â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ Restaurante                    â”‚ Plano        â”‚ Status       â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•ªâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•ªâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£`);

    let mrr = 0;
    let failedPayments = 0;

    data.forEach(client => {
        const planStr = `${client.plan.name} (R$${client.plan.price})`;
        const statusIcon = client.status === 'ACTIVE' ? 'âœ…' : 'âŒ';
        console.log(`â•‘ ${client.name.padEnd(30)} â”‚ ${planStr.padEnd(12)} â”‚ ${statusIcon} ${client.status.padEnd(9)} â•‘`);

        if (client.status === 'ACTIVE') {
            mrr += client.plan.price;
        } else {
            failedPayments++;
        }
    });

    console.log(`â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•§â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•§â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•`);

    // MÃ©tricas Agregadas
    console.log(`\nðŸ“ˆ EXECUTIVE SUMMARY:`);
    console.log(`   - New MRR Added:    R$ ${mrr.toFixed(2)}`);
    console.log(`   - New Subscribers:  ${data.filter(d => d.status === 'ACTIVE').length}`);
    console.log(`   - Payment Failures: ${failedPayments} (Admin Action Required: Send Recovery Email)`);
    console.log(`   - Projected LTV:    R$ ${data.reduce((acc, curr) => acc + curr.ltv_projection, 0).toFixed(2)} (12-month horizon)`);
    console.log(`\nðŸ’¡ STRATEGIST INSIGHT:`);
    if (failedPayments > 0) {
        console.log(`   "DetecÃ§Ã£o de falha no pagamento. Recomendo ativar automaÃ§Ã£o de retentativa inteligente no Stripe/Gateway."`);
    }
    if (mrr > 500) {
        console.log(`   "Bom volume de entrada! Considere aumentar o preÃ§o do plano Pro ou criar um add-on de Concierge."`);
    } else {
        console.log(`   "Volume baixo. Que tal uma campanha de 'Primeiro MÃªs GrÃ¡tis' para aumentar a base?"`);
    }
}

// Main
const args = process.argv.slice(2);
let leads = 10;
let conversion = 0.3;

args.forEach(arg => {
    if (arg.startsWith('--leads=')) leads = parseInt(arg.split('=')[1]);
    if (arg.startsWith('--conversion=')) conversion = parseFloat(arg.split('=')[1]);
});

const simulationData = simulateOnboarding(leads, conversion);
generateReport(simulationData);

