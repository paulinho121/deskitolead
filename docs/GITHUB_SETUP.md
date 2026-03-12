# 🔧 GitHub Actions Setup - LeadFlow Pro

## 📋 Pré-requisitos

1. Conta no GitHub com repositório criado
2. Conta na Vercel
3. Projeto configurado na Vercel

## 🚀 Configuração dos Secrets

### 1. Obter credenciais da Vercel

#### Método A: Via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Obter Organization ID
vercel ls

# Obter Project ID
vercel link

# Gerar token
vercel tokens create
```

#### Método B: Via Vercel Dashboard
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Settings → Tokens**
3. Crie um novo token
4. Copie o token gerado

### 2. Configurar Secrets no GitHub

1. **Acesse seu repositório GitHub**
2. Vá para **Settings → Secrets and variables → Actions**
3. Clique **"New repository secret"**

#### Secrets necessários:

| Secret | Valor | Como obter |
|--------|-------|------------|
| `VERCEL_TOKEN` | Token da Vercel | `vercel tokens create` |
| `VERCEL_ORG_ID` | ID da organização | `vercel ls` |
| `VERCEL_PROJECT_ID` | ID do projeto | `vercel link` |

### 3. Exemplo de configuração

```bash
# Exemplo dos valores (use os seus!)
VERCEL_TOKEN=vercel_token_abc123...
VERCEL_ORG_ID=org_abc123...
VERCEL_PROJECT_ID=prj_xyz789...
```

## 🔍 Como encontrar os IDs

### Organization ID
```bash
vercel ls
# Output: 
# your-username    org_abc123def456    your-project
```

### Project ID  
```bash
vercel link
# Output:
# Vercel CLI detected the following project:
# Name: leadflow-pro
# ID: prj_xyz789uvw012
```

### Token
```bash
vercel tokens create
# Output:
# Created token: vercel_token_abc123def456...
```

## 🚀 Testar o Pipeline

### 1. Commit e Push
```bash
git add .
git commit -m "Configurar GitHub Actions"
git push origin main
```

### 2. Verificar o Workflow
1. Acesse **Actions** no seu repositório
2. Veja o workflow **🚀 CI/CD Pipeline** rodando
3. Verifique se todos os steps passam

### 3. Deploy Automático
- **Branch `main`** → Deploy produção automático
- **Branch `develop`** → Deploy staging automático
- **Pull Request** → Preview automático

## 🔧 Troubleshooting

### Erro: "VERCEL_TOKEN not found"
```bash
# Verifique se o secret foi adicionado
# Settings → Secrets and variables → Actions
```

### Erro: "Organization not found"
```bash
# Verifique o VERCEL_ORG_ID
vercel ls
```

### Erro: "Project not found"
```bash
# Verifique o VERCEL_PROJECT_ID  
vercel link
```

### Erro: "Build failed"
```bash
# Verifique localmente
npm run build

# Verifique Node.js version
node --version  # Deve ser 18.20.0
```

## 🎯 Branch Strategy

### Main Branch (Produção)
```bash
git push origin main
# → Deploy automático para https://leadflow-pro.vercel.app
```

### Develop Branch (Staging)
```bash
git push origin develop  
# → Deploy automático para https://staging-leadflow-pro.vercel.app
```

### Feature Branch (Preview)
```bash
# Criar PR
# → Preview automático com URL única
```

## 📊 Monitoramento

### Logs do Workflow
1. **GitHub → Actions**
2. Clique no workflow executado
3. Veja os logs de cada step

### Logs da Vercel
```bash
vercel logs
# Ver logs de produção
```

### Analytics
- **GitHub**: Actions tab no repositório
- **Vercel**: Dashboard analytics

## 🔄 CI/CD Pipeline Features

### ✅ O que está configurado:
- **Build automático** em cada push
- **Testes de tipo** com TypeScript
- **Deploy condicional** por branch
- **Artifacts** do build
- **Rollback automático** em caso de falha
- **Preview URLs** para PRs

### 📋 Workflow steps:
1. **Checkout** - Baixa o código
2. **Setup Node.js** - Configura Node 18.20.0
3. **Install dependencies** - `npm ci`
4. **Type check** - `npm run build`
5. **Upload artifacts** - Salva build
6. **Deploy** - Envia para Vercel

---

## 🎉 Setup Completo!

Após configurar os secrets, seu pipeline estará 100% funcional!

**Próximos passos:**
1. Configure os secrets no GitHub
2. Faça push para testar
3. Monitore o deploy em tempo real

**URLs esperadas:**
- 🌐 Produção: `https://leadflow-pro.vercel.app`
- 🧪 Staging: `https://staging-leadflow-pro.vercel.app`
