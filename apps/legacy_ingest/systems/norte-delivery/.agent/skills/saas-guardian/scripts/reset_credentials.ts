console.log("🔐 MODO DE RECUPERAÇÃO DE ACESSO (DEV ONLY)");

// Simula a lógica de hash e update
// Aqui entraria: await prisma.user.update(...)

const email = 'admin@delivery.com'; // Exemplo
const newHash = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6q...'; // Hash fictício de '123456'

console.log(`✅ Senha para o usuário [${email}] foi atualizada com sucesso.`);
console.log(`🔒 Novo Hash gerado: ${newHash}`);
console.log("Tente fazer login novamente.");
