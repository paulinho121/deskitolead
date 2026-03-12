# ⚙️ Guia de Configuração - LeadFlow Pro

## 🚀 Setup Rápido (5 minutos)

### 1. 📋 Pré-requisitos
- Node.js 18+ 
- Conta Vercel (gratuita)
- API Keys:
  - [Serper API](https://serper.dev/) (2.500 searches/mês grátis)
  - [Google Gemini API](https://aistudio.google.com/) (60 requests/min grátis)

### 2. 🔑 Configurar API Keys

#### Método A: Via Vercel Dashboard (Recomendado)
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá para **Settings → Environment Variables**
3. Adicione as variáveis:
   ```
   REACT_APP_SERPER_API_KEY = sua_chave_serper
   GEMINI_API_KEY = sua_chave_gemini
   ```

#### Método B: Via .env.local (Desenvolvimento)
1. Copie `.env.example` para `.env.local`
2. Configure suas keys:
   ```bash
   REACT_APP_SERPER_API_KEY=sua_chave_serper_aqui
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```

### 3. 🌐 Deploy na Vercel

#### Opção 1: One-Click Deploy
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy produção
npm run deploy

# Deploy staging
npm run deploy:staging
```

#### Opção 2: PowerShell (Windows)
```powershell
# Executar script de deploy
.\scripts\deploy.ps1 production

# Para staging
.\scripts\deploy.ps1 staging
```

#### Opção 3: GitHub Integration
1. Push para GitHub:
```bash
git add .
git commit -m "Deploy automático"
git push origin main
```

2. Configure no dashboard Vercel:
   - Import Project from Git
   - Conecte seu repositório
   - Configure environment variables

## 🔧 Configurações Avançadas

### Variáveis de Ambiente Opcionais
```bash
# Configurações de performance
VITE_ENABLE_SOURCE_MAPS=true
VITE_CHUNK_SIZE_WARNING_LIMIT=1000

# Configurações de API
VITE_API_TIMEOUT=30000
VITE_RETRY_ATTEMPTS=3

# Analytics (opcional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

### Customização de Build
```javascript
// vite.config.ts - customizações avançadas
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Dividir vendor chunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          charts: ['recharts']
        }
      }
    },
    
    // Otimizações
    minify: 'terser',
    sourcemap: true,
    
    // Tamanho máximo de chunks
    chunkSizeWarningLimit: 1000
  }
});
```

## 🌍 Domínio Personalizado

### Configurar DNS
1. No dashboard Vercel: **Settings → Domains**
2. Adicione seu domínio: `seudominio.com`
3. Configure DNS no seu provedor:
   ```
   Tipo: CNAME
   Nome: @ (ou www)
   Valor: cname.vercel-dns.com
   TTL: 300
   ```

### SSL Automático
- ✅ SSL certificate automático via Vercel
- ✅ HTTP/2 habilitado
- ✅ CDN global incluído

## 📊 Monitoramento e Analytics

### Vercel Analytics (Gratuito)
- Acesso em: vercel.com/dashboard/analytics
- Métricas incluídas:
  - Page views
  - Unique visitors
  - Web Vitals (LCP, FID, CLS)
  - Geographic distribution
  - Device breakdown

### Configurar Google Analytics (Opcional)
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔒 Segurança

### Headers de Segurança (Automático)
Vercel já configura:
- ✅ Strict-Transport-Security
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection

### Environment Variables Seguras
- ✅ Criptografadas em trânsito
- ✅ Isoladas por ambiente
- ✅ Não expostas no client-side

## 🚨 Troubleshooting

### Build Falha
```bash
# Limpar cache completo
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Deploy Lento
1. Verifique tamanho do build:
```bash
npm run build:analyze
```

2. Otimize imagens e assets

3. Configure cache headers

### Environment Variables Não Funcionam
1. Verifique spelling exato
2. Redeploy após mudança
3. Use `vercel env ls` para verificar

### API Errors
```bash
# Testar APIs localmente
curl -X POST "https://google.serper.dev/search" \
  -H "X-API-KEY: $REACT_APP_SERPER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "restaurantes sao paulo", "type": "places"}'
```

## 🔄 CI/CD Pipeline

### Branch Strategy
- `main` → Produção automática
- `develop` → Staging automática  
- `feature/*` → Preview por PR

### Workflow Features
- ✅ Build automático
- ✅ Testes automatizados
- ✅ Deploy condicional
- ✅ Rollback automático
- ✅ Notificações

## 📱 Performance Otimizations

### Build já otimizado com:
- ✅ Code splitting por rota
- ✅ Lazy loading de componentes
- ✅ Tree shaking automático
- ✅ Minificação (Terser)
- ✅ Bundle analysis

### Para monitorar performance:
```bash
# Local
npm run build:analyze

# Produção
# Visitar: https://leadflow-pro.vercel.app/_next/static/chunks/
```

---

## 🎯 Checklist Final de Deploy

- [ ] API keys configuradas na Vercel
- [ ] Build local funciona
- [ ] Testes passam
- [ ] Domínio configurado (se aplicável)
- [ ] Analytics configurado
- [ ] HTTPS funcionando
- [ ] Mobile responsivo
- [ ] Performance > 90 no Lighthouse

**Seu LeadFlow Pro está pronto para produção! 🚀**

URLs pós-deploy:
- 🌐 Produção: `https://seu-projeto.vercel.app`
- 🧪 Staging: `https://staging-seu-projeto.vercel.app`
