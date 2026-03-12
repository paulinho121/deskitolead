#!/bin/bash

# 🚀 Script de Deploy Automático - LeadFlow Pro
# Uso: ./scripts/deploy.sh [staging|production]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar ambiente
check_environment() {
    log "🔍 Verificando ambiente..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não encontrado. Instale Node.js 18+"
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
        error "Node.js $NODE_VERSION encontrado. Versão $REQUIRED_VERSION ou superior requerida"
    fi
    
    log "✅ Node.js $NODE_VERSION OK"
    
    # Verificar Vercel CLI
    if ! command -v vercel &> /dev/null; then
        warning "Vercel CLI não encontrado. Instalando..."
        npm install -g vercel
    fi
    
    log "✅ Vercel CLI OK"
    
    # Verificar variáveis de ambiente
    if [ ! -f ".env" ]; then
        warning "Arquivo .env não encontrado. Usando .env.example"
        cp .env.example .env
        warning "⚠️  Configure suas API keys no arquivo .env"
    fi
}

# Build do projeto
build_project() {
    log "🔨 Iniciando build do projeto..."
    
    # Limpar builds anteriores
    rm -rf dist/
    
    # Instalar dependências
    log "📦 Instalando dependências..."
    npm ci
    
    # Build
    log "🏗️  Compilando projeto..."
    npm run build
    
    if [ $? -eq 0 ]; then
        log "✅ Build concluído com sucesso"
        log "📊 Tamanho do build: $(du -sh dist/ | cut -f1)"
    else
        error "❌ Build falhou"
    fi
}

# Deploy para Vercel
deploy_to_vercel() {
    local environment=${1:-production}
    
    log "🚀 Iniciando deploy para $environment..."
    
    case $environment in
        "staging"|"preview")
            info "Deploy para ambiente de staging..."
            vercel
            ;;
        "production"|"prod")
            info "Deploy para ambiente de produção..."
            vercel --prod
            ;;
        *)
            error "Ambiente inválido. Use: staging ou production"
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        log "🎉 Deploy concluído com sucesso!"
        
        # Tentar obter URL do deploy
        DEPLOY_URL=$(vercel ls 2>/dev/null | head -1 | awk '{print $2}' || echo "N/A")
        log "🌐 URL: $DEPLOY_URL"
    else
        error "❌ Deploy falhou"
    fi
}

# Verificação pós-deploy
post_deploy_checks() {
    log "🔍 Executando verificações pós-deploy..."
    
    # Verificar se o dist foi gerado
    if [ ! -d "dist" ]; then
        error "Diretório dist não encontrado"
    fi
    
    # Verificar arquivos essenciais
    if [ ! -f "dist/index.html" ]; then
        error "index.html não encontrado no build"
    fi
    
    log "✅ Verificações concluídas"
}

# Função principal
main() {
    local environment=${1:-production}
    
    log "🚀 LeadFlow Pro - Deploy Automático"
    log "================================"
    
    check_environment
    build_project
    deploy_to_vercel $environment
    post_deploy_checks
    
    log "🎯 Deploy finalizado! Seu LeadFlow Pro está no ar!"
    log "📈 Acompanhe as métricas em: https://vercel.com/dashboard"
}

# Executar script
main "$@"
