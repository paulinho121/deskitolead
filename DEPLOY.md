# 🚀 Deploy na Vercel - LeadFlow Pro

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta na Vercel (vercel.com)
- API Keys:
  - Serper API Key (https://serper.dev/)
  - Gemini API Key (https://aistudio.google.com/)

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente Locais
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Configure suas API keys
REACT_APP_SERPER_API_KEY=sua_chave_serper_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
```

### 2. Instalação de Dependências
```bash
npm install
```

### 3. Build Teste Local
```bash
npm run build
npm run preview
```

## 🌐 Deploy na Vercel

### Método 1: Via Vercel CLI (Recomendado)

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login na Vercel**
```bash
vercel login
```

3. **Configurar Variáveis de Ambiente**
```bash
# Adicionar as API keys no ambiente Vercel
vercel env add REACT_APP_SERPER_API_KEY
vercel env add GEMINI_API_KEY
```

4. **Deploy Produção**
```bash
npm run deploy
```

5. **Deploy Staging (Opcional)**
```bash
npm run deploy:staging
```

### Método 2: Via GitHub Integration

1. **Push para GitHub**
```bash
git add .
git commit -m "Preparando para deploy Vercel"
git push origin main
```

2. **Configurar na Vercel Dashboard**
   - Acesse vercel.com/dashboard
   - Import Project from Git
   - Conecte seu repositório
   - Configure as variáveis de ambiente no dashboard

## ⚙️ Configurações Automáticas

O arquivo `vercel.json` já contém:
- ✅ Framework detection (Vite)
- ✅ Build command otimizado
- ✅ Output directory (dist/)
- ✅ SPA routing
- ✅ Environment variables mapping

## 🔍 Verificação Pós-Deploy

### 1. Teste Funcionalidades
- [ ] Carregamento da aplicação
- [ ] Busca de leads (Serper API)
- [ ] Enriquecimento (Gemini API)
- [ ] Interface responsiva

### 2. Monitoramento
Acesse `https://vercel.com/dashboard/your-project` para:
- Logs de build
- Analytics
- Error tracking
- Performance metrics

## 🛠️ Resolução de Problemas

### Build Falha
```bash
# Limpar cache e rebuild
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Environment Variables Não Funcionam
1. Verifique no dashboard Vercel:
   - Settings → Environment Variables
   - Certifique-se que estão em Production

2. Redeploy após mudança:
```bash
vercel --prod
```

### API Errors
1. Verifique se as API keys são válidas
2. Confirme os limits de uso:
   - Serper: 2,500 searches/mês (free)
   - Gemini: 60 requests/minuto (free)

## 📊 Performance Otimizações

O build já está configurado com:
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Bundle analysis disponível
- ✅ Source maps para debug

Para analisar o bundle:
```bash
npm run build:analyze
```

## 🔄 CI/CD Pipeline

O projeto suporta deploy automático via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🌍 Domínio Personalizado (Opcional)

1. **No dashboard Vercel:**
   - Settings → Domains
   - Adicione seu domínio

2. **Configure DNS:**
   ```
   Tipo: CNAME
   Nome: @ (ou www)
   Valor: cname.vercel-dns.com
   TTL: 300
   ```

## 📱 Suporte Mobile

O deploy inclui:
- ✅ Responsive design otimizado
- ✅ PWA capabilities
- ✅ Touch-friendly interface
- ✅ Performance mobile-first

---

**Seu LeadFlow Pro está pronto para produção! 🎯**

URL após deploy: `https://seu-projeto.vercel.app`
