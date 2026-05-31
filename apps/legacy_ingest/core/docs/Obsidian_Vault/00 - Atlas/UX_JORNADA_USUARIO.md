# Jornada do Usuário: O Caminho do Norte

Esta nota detalha a experiência fluida do usuário dentro do ecossistema, utilizando a interface **Norte Clean** (Light Mode) para maximizar o foco e a conversão.

## 🚀 O Fluxo de Experiência

| Etapa | Ação na Interface | O que acontece por trás (Backend) |
| :--- | :--- | :--- |
| **1. O Feed (Norte Hub)** | O usuário abre o app e vê um feed dinâmico com atualizações de serviços, promoções e notícias. | Busca de dados em tempo real no PostgreSQL via Norte Infra. |
| **2. Serviços (Norte Systems)** | Transição para a aba de Serviços: Norte Clinic, Agency, Auto e Services. | `central-schema.prisma` gerencia permissões e histórico de cada módulo. |
| **3. Mobilidade (Norte Logistics)** | Solicitação de transporte (Drive) ou entrega (Cargo). Interface limpa com foco no mapa. | Integração logística que unifica motoristas e entregadores sob uma mesma identidade. |
| **4. Vault de Apps (Super App)** | Acesso ao portfólio completo: Beauty, Food, Fit. | Micro-serviços integrados ao perfil central (Single Sign-On). |

---

## 🛠️ Especificações Técnicas de UX

### Navegação (Bottom Bar)
- **Estética**: Minimalista.
- **Cores**: Ícones em Cinza Soft (#94A3B8).
- **Estado Ativo**: Transição suave para **Emerald-600** (#059669).

### Performance
- **Tecnologia**: Next.js (App Router).
- **Velocidade**: Carregamento instantâneo via cache de subdomínios e otimização de server components.

### Mensageria (DM Persistente)
- O sistema de chat é transversal. Uma conversa iniciada no **Norte Clinic** continua visível e ativa se o usuário alternar para o **Norte Services**, garantindo continuidade no suporte e atendimento.

---

## 🧠 Nota de Zettelkasten
A fluidez da jornada é o reflexo da **Dialética dos Sistemas**. A tecnologia deve ser invisível; o usuário não percebe a troca de serviços, apenas a resolução de suas necessidades dentro de um ambiente seguro e profissional.
