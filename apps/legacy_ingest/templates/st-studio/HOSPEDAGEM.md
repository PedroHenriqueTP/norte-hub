# Guia de Hospedagem e Deploy

Este guia detalha como fazer deploy do site em diferentes plataformas.

## 🎯 Opções de Hospedagem

### Recomendado: Vercel (Gratuito)
- ✅ Deploy automático do GitHub
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Integração com MongoDB Atlas
- ✅ Ambiente de preview para cada PR

### Alternativas
- **Netlify**: Similar ao Vercel
- **Railway**: Bom para apps full-stack
- **Render**: Alternativa moderna
- **AWS/GCP/Azure**: Para empresas

## 🚀 Deploy na Vercel (Recomendado)

### Pré-requisitos

1. Conta no GitHub (ou GitLab/Bitbucket)
2. Conta no MongoDB Atlas (gratuita)
3. Conta na Vercel (gratuita)

### Passo 1: Preparar Repositório Git

```bash
# Inicializar Git (se ainda não fez)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/seu-usuario/site-de-studio.git
git branch -M main
git push -u origin main
```

### Passo 2: Configurar MongoDB Atlas

1. **Acesse**: https://www.mongodb.com/cloud/atlas
2. **Crie conta gratuita** (se não tiver)
3. **Crie um cluster**:
   - Escolha: FREE (M0)
   - Região: Mais próxima de seus usuários
   - Nome: `studio-beleza-prod`

4. **Configure Database Access**:
   - Database Access → Add New Database User
   - Username: `admin` (ou outro)
   - Password: Gere senha forte
   - Database User Privileges: Atlas admin
   - **Salve a senha!**

5. **Configure Network Access**:
   - Network Access → Add IP Address
   - Para produção: `0.0.0.0/0` (permite de qualquer lugar)
   - Ou adicione IPs específicos da Vercel

6. **Obter Connection String**:
   - Clusters → Connect → Connect your application
   - Copie a string
   - Substitua `<password>` pela senha criada
   - Exemplo: `mongodb+srv://admin:senha123@cluster.mongodb.net/studio-beleza?retryWrites=true&w=majority`

### Passo 3: Deploy na Vercel

1. **Acesse**: https://vercel.com
2. **Faça login** com GitHub
3. **Import Project**:
   - Selecione seu repositório
   - Framework Preset: Next.js (detectado automaticamente)
   - Root Directory: `./` (raiz)

4. **Configure Environment Variables**:

   Adicione estas variáveis:

   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/studio-beleza?retryWrites=true&w=majority
   NEXTAUTH_SECRET=sua-chave-secreta-gerada-com-openssl-rand-base64-32
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   ADMIN_EMAIL=admin@studio.com
   ADMIN_PASSWORD=senha-segura-aqui
   NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
   ```

   **Gerar NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o build (2-5 minutos)
   - Site estará disponível em `https://seu-projeto.vercel.app`

### Passo 4: Inicializar Admin em Produção

Após o deploy:

1. Acesse: `https://seu-projeto.vercel.app/api/init`
2. Você deve ver: `{"message":"Admin criado com sucesso"}`
3. Acesse: `https://seu-projeto.vercel.app/admin/login`
4. Faça login e **altere a senha imediatamente**

### Passo 5: Configurar Domínio Personalizado (Opcional)

1. **Na Vercel**:
   - Settings → Domains
   - Add Domain
   - Digite seu domínio (ex: `estudiobeleza.com.br`)

2. **No seu provedor de domínio**:
   - Adicione registro DNS:
     - Tipo: `CNAME`
     - Nome: `@` ou `www`
     - Valor: `cname.vercel-dns.com`
   - Ou use os registros A fornecidos pela Vercel

3. **Aguarde propagação DNS** (pode levar até 24h)

4. **Atualize NEXTAUTH_URL**:
   - Environment Variables → Edite `NEXTAUTH_URL`
   - Novo valor: `https://seu-dominio.com.br`
   - Redeploy automático

## 🌐 Deploy no Netlify

### Passo 1: Preparar Build

Crie `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Passo 2: Deploy

1. Acesse: https://app.netlify.com
2. New site from Git → Selecione repositório
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Adicione Environment Variables (mesmas da Vercel)
5. Deploy

## 🚂 Deploy no Railway

1. Acesse: https://railway.app
2. New Project → Deploy from GitHub
3. Selecione repositório
4. Adicione Environment Variables
5. Railway detecta Next.js automaticamente
6. Deploy

## 🔧 Configurações de Produção

### Variáveis de Ambiente Obrigatórias

```env
# MongoDB (Atlas em produção)
MONGODB_URI=mongodb+srv://...

# NextAuth (chave secreta forte)
NEXTAUTH_SECRET=chave-gerada-com-openssl-rand-base64-32
NEXTAUTH_URL=https://seu-dominio.com

# Admin (altere após primeiro login)
ADMIN_EMAIL=admin@studio.com
ADMIN_PASSWORD=senha-muito-forte-aqui

# WhatsApp (opcional)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### Otimizações de Produção

1. **Build Otimizado**:
   ```bash
   npm run build
   ```
   - Verifica se build passa sem erros
   - Otimiza imagens e código

2. **Variáveis de Ambiente**:
   - Nunca commite `.env` no Git
   - Use variáveis de ambiente da plataforma
   - Diferentes para dev/staging/prod

3. **MongoDB Atlas**:
   - Use cluster de produção (não free tier)
   - Configure backups automáticos
   - Monitore uso de recursos

4. **SSL/HTTPS**:
   - Vercel/Netlify fornecem SSL automático
   - Certifique-se de usar HTTPS em produção

## 📊 Monitoramento

### Vercel Analytics

1. Vercel Dashboard → Analytics
2. Ative Vercel Analytics (gratuito)
3. Monitore:
   - Page views
   - Performance
   - Erros

### MongoDB Atlas Monitoring

1. Atlas Dashboard → Metrics
2. Monitore:
   - CPU/Memory usage
   - Connections
   - Storage

### Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Netlify**: Site → Functions → Logs
- **Railway**: Deploy → Logs

## 🔒 Segurança em Produção

### Checklist de Segurança

- [ ] `NEXTAUTH_SECRET` é uma chave forte e única
- [ ] Senha do admin foi alterada
- [ ] MongoDB tem senha forte
- [ ] Network Access do MongoDB restrito (se possível)
- [ ] HTTPS está ativo
- [ ] Variáveis de ambiente não estão no código
- [ ] `.env` está no `.gitignore`
- [ ] Backups do MongoDB configurados

### Boas Práticas

1. **Senhas**:
   - Use gerador de senhas
   - Mínimo 16 caracteres
   - Mix de maiúsculas, minúsculas, números, símbolos

2. **MongoDB**:
   - Não use IP `0.0.0.0/0` em produção (se possível)
   - Adicione IPs específicos da Vercel
   - Use usuário com permissões mínimas necessárias

3. **Código**:
   - Não commite secrets
   - Use secrets management da plataforma
   - Revise código antes de deploy

## 🐛 Troubleshooting

### Build Falha

```bash
# Teste build localmente
npm run build

# Verifique erros
# Corrija e commite
```

### Site não conecta ao MongoDB

- Verifique `MONGODB_URI` nas env vars
- Verifique Network Access no Atlas
- Verifique se senha está correta
- Verifique logs da Vercel

### Admin não cria

- Acesse `/api/init` manualmente
- Verifique logs para erros
- Verifique se MongoDB está acessível

### Imagens não carregam

- Verifique `next.config.js` para domínios permitidos
- Use URLs absolutas para imagens
- Considere usar CDN (Cloudinary, etc.)

### Performance Lenta

- Verifique MongoDB Atlas (upgrade se necessário)
- Otimize imagens
- Use Vercel Analytics para identificar gargalos
- Considere cache

## 📈 Escalabilidade

### Quando Escalar

- **MongoDB**: Quando free tier não suporta
- **Vercel**: Quando excede limites gratuitos
- **Imagens**: Quando muitas imagens grandes

### Opções de Escala

1. **MongoDB Atlas**:
   - Upgrade para M10+ (pago)
   - Configure sharding se necessário

2. **Vercel**:
   - Pro plan ($20/mês)
   - Mais bandwidth e builds

3. **Imagens**:
   - Cloudinary (CDN de imagens)
   - AWS S3 + CloudFront
   - Vercel Image Optimization

## 📝 Checklist de Deploy

Antes de considerar produção:

- [ ] Build passa sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB Atlas configurado
- [ ] Admin inicializado
- [ ] Senha do admin alterada
- [ ] HTTPS ativo
- [ ] Domínio configurado (se aplicável)
- [ ] Testes básicos passando
- [ ] Monitoramento configurado
- [ ] Backups configurados

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Teste todas as funcionalidades em produção
2. ✅ Configure monitoramento
3. ✅ Configure backups
4. ✅ Documente credenciais (em local seguro)
5. ✅ Compartilhe o site!

## 🆘 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Deploy**: https://nextjs.org/docs/deployment

