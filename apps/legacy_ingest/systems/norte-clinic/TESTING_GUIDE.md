cd backend# Guia de Testes - CRM Médico

Este documento descreve como testar a aplicação CRM, cobrindo testes automatizados (Backend) e verificação manual das funcionalidades (Frontend).

## 1. Testes Automatizados (Backend)

O backend utiliza `pytest` para testes unitários e de integração.

### Pré-requisitos
- Docker rodando (`docker-compose up -d`)
- Ambiente virtual Python ativado

### Rodando os Testes
Navegue até a pasta `backend` e execute:

```bash
# Windows (se estiver na pasta root)
.\venv\Scripts\activate
cd backend
pytest

# Ou se já estiver na pasta backend:
..\venv\Scripts\activate
pytest
```

> [!NOTE]
> Se encontrar erros de importação ("No module named 'app'"), certifique-se de que o arquivo `pytest.ini` existe na pasta `backend`.

**Estrutura de Testes Atual:**
- `tests/test_main.py`: Verifica se a API está respondendo (Health check).

**Cobertura Recomendada para Futuro:**
- Testar criação de Pacientes (`POST /api/v1/patients/`)
- Testar criação de Agendamentos (`POST /api/v1/appointments/`)
- Validar regras de negócio (ex: não permitir agendamento duplicado).

## 2. Testes Manuais (E2E)

### Configuração do Ambiente
1.  **Banco de Dados**: `docker-compose up -d`
2.  **Backend**: `uvicorn app.main:app --reload` (na pasta backend)
3.  **Frontend**: `npm run dev` (na pasta frontend)
4.  Acesse: `http://localhost:3000`

### Cenários de Teste

#### A. Login (Se habilitado)
1.  Acesse a página de login.
2.  Tente logar com credenciais inválidas -> Verifique mensagem de erro.
3.  Logue com admin/admin (ou credenciais configuradas).
4.  **Esperado**: Redirecionamento para o Dashboard.

#### B. Gestão de Pacientes
1.  Navegue para **Dashboard > Patients**.
2.  Verifique se a lista de pacientes carrega.
3.  (Futuro) Clique em "Add Patient" (se implementado) e crie um novo.
4.  **Esperado**: O paciente aparece na lista.

#### C. Agendamento (Calendar)
1.  Navegue para **Dashboard > Calendar**.
2.  Verifique se o calendário carrega.
3.  Clique no botão **"New Appointment"**.
4.  **Formulário**:
    -   Selecione um paciente existente.
    -   Escolha Data/Hora de início e fim.
    -   Adicione uma nota (ex: "Consulta Rotina").
5.  Clique em **"Save Appointment"**.
6.  **Esperado**: Modal fecha e o agendamento aparece visualmente no calendário.

#### D. Chatbot (AI Triage)
1.  Navegue para **Dashboard > Chat**.
2.  Envie uma mensagem simulando um paciente (ex: "Estou com muita dor de cabeça").
3.  **Esperado**: O sistema responde com uma avaliação de triagem (baseado na API do Gemini).

## 3. Troubleshooting Comum

-   **Erro de Conexão (Network Error)**:
    -   Verifique se o backend está rodando na porta 8000.
    -   Verifique se o Docker está rodando.
-   **Erro 500 ao criar Agendamento**:
    -   Verifique logs do Backend.
    -   Confirme se o ID do paciente é válido.
    -   Verifique conexão com Google Calendar (se ativado).
