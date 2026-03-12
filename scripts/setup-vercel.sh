#!/bin/bash

# 🚀 Script de Setup Vercel para GitHub Actions
# Gera automaticamente as credenciais necessárias

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar Vercel CLI
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        warning "Vercel CLI não encontrado. Instalando..."
        npm install -g vercel
    fi
    
    log "✅ Vercel CLI pronto"
}

# Login na Vercel
login_vercel() {
    info "Fazendo login na Vercel..."
    vercel login
    log "✅ Login concluído"
}

# Obter Organization ID
get_org_id() {
    info "Obtendo Organization ID..."
    ORG_ID=$(vercel ls | head -1 | awk '{print $2}')
    
    if [ -z "$ORG_ID" ]; then
        error "Não foi possível obter Organization ID"
    fi
    
    log "✅ Organization ID: $ORG_ID"
}

# Obter Project ID
get_project_id() {
    info "Obtendo Project ID..."
    
    # Link do projeto se necessário
    if ! vercel link --yes &> /dev/null; then
        warning "Projeto não encontrado. Criando link..."
        vercel link
    fi
    
    PROJECT_ID=$(vercel project ls | grep -E '^\s*│\s*' | head -1 | awk '{print $2}' || echo "")
    
    if [ -z "$PROJECT_ID" ]; then
        # Tentar obter do .vercel
        if [ -f ".vercel/project.json" ]; then
            PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
        fi
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        error "Não foi possível obter Project ID"
    fi
    
    log "✅ Project ID: $PROJECT_ID"
}

# Gerar Token
generate_token() {
    info "Gerando Vercel Token..."
    
    # Criar token com nome específico
    TOKEN_NAME="github-actions-$(date +%s)"
    
    TOKEN=$(vercel tokens create $TOKEN_NAME --scope=project 2>/dev/null || echo "")
    
    if [ -z "$TOKEN" ]; then
        warning "Falha ao criar token automaticamente. Criando manualmente..."
        echo "1. Acesse: https://vercel.com/account/tokens"
        echo "2. Clique 'Create Token'"
        echo "3. Nome: $TOKEN_NAME"
        echo "4. Scope: Project"
        echo "5. Copie o token gerado"
        read -p "Cole o token aqui: " TOKEN
    fi
    
    if [ -z "$TOKEN" ]; then
        error "Token não fornecido"
    fi
    
    log "✅ Token gerado"
}

# Mostrar instruções
show_instructions() {
    echo ""
    log "🎯 Credenciais Geradas!"
    echo ""
    info "Configure estes secrets no GitHub:"
    echo ""
    echo "📍 Repository: Settings → Secrets and variables → Actions"
    echo ""
    echo "🔑 Secrets a adicionar:"
    echo ""
    echo -e "${GREEN}VERCEL_TOKEN${NC}"
    echo "$TOKEN"
    echo ""
    echo -e "${GREEN}VERCEL_ORG_ID${NC}"
    echo "$ORG_ID"
    echo ""
    echo -e "${GREEN}VERCEL_PROJECT_ID${NC}"
    echo "$PROJECT_ID"
    echo ""
    info "📋 Copie cada valor acima e cole nos secrets correspondentes"
    echo ""
    warning "⚠️  Mantenha estes valores seguros e privados!"
    echo ""
    log "🚀 Após configurar, faça: git push origin main"
}

# Função principal
main() {
    log "🚀 Setup Vercel para GitHub Actions"
    log "=================================="
    
    check_vercel
    login_vercel
    get_org_id
    get_project_id
    generate_token
    show_instructions
    
    log "✅ Setup concluído!"
}

# Executar
main "$@"
