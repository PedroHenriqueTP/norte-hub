# Guia de Contribuição - Delivery Platform

Obrigado pelo interesse em contribuir com a nossa plataforma de delivery multi-tenant!

## 🛠️ Como Contribuir

1.  **Fork o Repositório**: Crie uma cópia do projeto na sua conta.
2.  **Crie um Branch**: Use nomes descritivos para suas branches (`feature/nova-rota`, `fix/erro-financeiro`).
3.  **Desenvolva**: Siga as diretrizes de código estabelecidas (veja `TECH_STACK.md`).
4.  **Teste**: Rode `npm test` na API antes de enviar.
5.  **Documente**: Se criar uma nova rota ou funcionalidade, atualize a documentação pertinente (Skill `DocReviewer` irá te ajudar nisso!).
6.  **Pull Request**: Envie suas alterações para revisão.

## 📝 Padrões de Código

-   **Commits**: Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
-   **Linting**: O projeto usa ESLint + Prettier. Certifique-se de que não há erros de lint antes de commitar.
-   **Typescript**: Evite `any` sempre que possível. Defina interfaces claras para seus DTOs.

## 🐛 Reportando Bugs

Se encontrar um bug (como erros de sintaxe ou falhas de lógica), abra uma Issue com:
-   Descrição do erro.
-   Passos para reproduzir.
-   Logs ou screenshots relevantes.

Boa codificação! 🚀
