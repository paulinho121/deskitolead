# 🚀 LeadFlow Pro - Plataforma de Inteligência B2B

<div align="center">
  <img width="1200" height="475" alt="LeadFlow Pro Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

> **Sistema profissional de prospecção B2B com IA, scraping avançado e enriquecimento automatizado de leads**

## ✨ Features

- 🎯 **Scraping Inteligente**: Busca no Google Maps via API Serper
- 🤖 **Enriquecimento AI**: Análise com Google Gemini
- 📊 **Dashboard Analytics**: Métricas em tempo real
- 🌍 **Geolocalização**: Target por região/cidade
- 📧 **Sequências Automáticas**: Cadências de e-mail personalizadas
- 🔍 **Validação de Dados**: Verificação de e-mails e telefones
- 📈 **Lead Scoring**: Classificação inteligente de leads

## 🚀 Deploy Rápido

### Pré-requisitos
- Node.js 18+
- Conta Vercel (gratuita)
- API Keys: [Serper](https://serper.dev/) + [Gemini](https://aistudio.google.com/)

### One-Click Deploy
```bash
# Instalar Vercel CLI
npm i -g vercel

# Configurar environment
cp .env.example .env
# Edite .env com suas API keys

# Deploy para produção
npm run deploy
```

**Deploy automático via GitHub:** Faça push para `main` branch 🚀

## 📋 Setup Completo

### 1. 📦 Instalação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/leadflow-pro.git
cd leadflow-pro

# Instalar dependências
npm install
```

### 2. 🔑 Configurar API Keys
```bash
# Via Vercel Dashboard (recomendado)
# Settings → Environment Variables
REACT_APP_SERPER_API_KEY=sua_chave_serper
GEMINI_API_KEY=sua_chave_gemini
```

### 3. 🌐 Deploy Options

#### Opção A: Vercel CLI
```bash
npm run deploy          # Produção
npm run deploy:staging  # Staging
```

#### Opção B: PowerShell (Windows)
```powershell
.\scripts\deploy.ps1 production
```

#### Opção C: GitHub Integration
1. Push para `main` → Deploy automático produção
2. Pull Request → Preview automático
3. Push para `develop` → Deploy automático staging

## 🏗️ Estrutura do Projeto

```
leadflow-pro/
├── 📁 components/          # Componentes React
│   ├── LeadDiscovery.tsx   # Busca de leads
│   ├── LeadLab.tsx         # Laboratório de leads
│   ├── BentoDashboard.tsx # Dashboard principal
│   └── EnrichmentModal.tsx # Modal de enriquecimento
├── 📁 services/           # Serviços externos
│   ├── serperService.ts   # Integração Serper API
│   └── geminiService.ts  # Integração Gemini API
├── 📁 types.ts           # TypeScript types
├── 📁 constants.ts       # Constantes e dados mock
├── 📁 scripts/           # Scripts de deploy
│   ├── deploy.sh          # Linux/Mac
│   └── deploy.ps1        # Windows
├── 📁 .github/workflows/   # CI/CD Pipeline
└── 📄 vercel.json        # Config Vercel
```

## 🔧 Configuração

### Environment Variables
```bash
# Obrigatórias
REACT_APP_SERPER_API_KEY=serper_key_aqui
GEMINI_API_KEY=gemini_key_aqui

# Opcionais
NODE_ENV=production
VITE_API_TIMEOUT=30000
```

### Build Commands
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
npm run deploy       # Deploy produção
npm run deploy:staging # Deploy staging
```

## 📊 Funcionalidades

### 🎯 Busca de Leads
- **API Serper**: 2.500 searches/mês grátis
- **Google Maps**: Busca por nicho + localização
- **Quantidade Controlada**: Respeita limite definido pelo usuário
- **Paginação Automática**: Busca em lote se necessário

### 🤖 Enriquecimento AI
- **Google Gemini**: Análise avançada de empresas
- **Dados Estruturados**: CNPJ, endereço, QSA, etc.
- **Insights Personalizados**: Sugestões de abordagem
- **Validação Automática**: Verificação de informações

### 📈 Dashboard Analytics
- **Métricas em Tempo Real**: Leads, conversões, performance
- **Visualizações**: Gráficos interativos com Recharts
- **Filtros Avançados**: Por status, indústria, localização
- **Exportação**: CSV, Excel, integração CRM

## 🌐 Deploy na Vercel

### Features Automáticas
- ✅ **CDN Global**: Distribuição mundial
- ✅ **HTTPS**: SSL automático e gratuito
- ✅ **HTTP/2**: Performance otimizada
- ✅ **Analytics**: Métricas integradas
- ✅ **Preview URLs**: Deploy por PR
- ✅ **Rollback**: Reversão automática

### Performance
- 📦 **Bundle Size**: ~500KB gzipped
- ⚡ **Load Time**: < 2s (Lighthouse)
- 📱 **Mobile First**: Responsive design
- 🎯 **SEO Optimized**: Meta tags e semântica

## 🛠️ Desenvolvimento

### Stack Tecnológica
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel

### Scripts Úteis
```bash
# Análise de bundle
npm run build:analyze

# Deploy com scripts
.\scripts\deploy.ps1 production  # Windows
./scripts/deploy.sh production   # Linux/Mac

# Limpeza
npm run clean  # Remove node_modules e build
```

## 🔒 Segurança

### Proteções Automáticas
- 🔐 **Environment Variables**: Isoladas e criptografadas
- 🛡️ **Headers Security**: CSP, HSTS, XSS Protection
- 🔍 **Input Validation**: Validação de dados
- 🚫 **Rate Limiting**: Proteção contra abuso

### Compliance
- ✅ **LGPD Ready**: Tratamento de dados pessoais
- ✅ **GDPR Compliant**: Direitos dos usuários
- ✅ **Cookie Policy**: Consentimento explícito

## 📈 Monitoramento

### Vercel Analytics (Gratuito)
- 📊 **Page Views**: Tráfego do site
- 👥 **Unique Visitors**: Usuários únicos
- ⚡ **Web Vitals**: LCP, FID, CLS
- 🌍 **Geographic**: Distribuição por país
- 📱 **Device Breakdown**: Mobile vs Desktop

### Error Tracking
```bash
# Logs de build e runtime
vercel logs

# Performance metrics
vercel inspect
```

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Branch** `feature/sua-feature`
3. **Commit** com mensagens claras
4. **Push** para seu fork
5. **Pull Request** com descrição detalhada

### Code Style
```typescript
// Seguir padrões estabelecidos
interface LeadData {
  id: string;
  name: string;
  // Usar tipos explícitos
}

// Nomenclatura clara
const fetchLeadsWithPagination = async () => {
  // Funções descritivas
};
```

## 📞 Suporte

### Documentação
- 📖 **[SETUP.md](./SETUP.md)**: Guia completo de configuração
- 🚀 **[DEPLOY.md](./DEPLOY.md)**: Instruções detalhadas de deploy
- 🔧 **[API.md](./API.md)**: Documentação das APIs

### Canais de Ajuda
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/leadflow-pro/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/leadflow-pro/discussions)
- 📧 **Email**: support@leadflowpro.com

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

## 🎯 Deploy Agora Mesmo

```bash
# 1. Configure suas API keys
cp .env.example .env
# Edite .env com suas keys

# 2. Instale Vercel CLI
npm i -g vercel

# 3. Login e deploy
vercel login
npm run deploy

# 🎉 Pronto! Seu LeadFlow Pro está no ar!
```

**URL Produção:** `https://seu-projeto.vercel.app`  
**URL Staging:** `https://staging-seu-projeto.vercel.app`

---

<div align="center">
  <strong>🚀 Transforme sua prospecção B2B com LeadFlow Pro!</strong>
</div>
