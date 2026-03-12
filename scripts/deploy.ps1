# 🚀 Script de Deploy Automático - LeadFlow Pro (PowerShell)
# Uso: .\scripts\deploy.ps1 [staging|production]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production", "prod")]
    [string]$Environment = "production"
)

# Cores para output
function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Log-Info($Message) {
    Write-ColorOutput Green "[$(Get-Date -Format 'HH:mm:ss')] $Message"
}

function Log-Error($Message) {
    Write-ColorOutput Red "[ERROR] $Message"
    exit 1
}

function Log-Warning($Message) {
    Write-ColorOutput Yellow "[WARNING] $Message"
}

function Log-Info($Message) {
    Write-ColorOutput Cyan "[INFO] $Message"
}

# Verificar ambiente
function Check-Environment {
    Log-Info "🔍 Verificando ambiente..."
    
    # Verificar Node.js
    try {
        $NodeVersion = node -v
        if (-not $NodeVersion) {
            Log-Error "Node.js não encontrado. Instale Node.js 18+"
        }
        $VersionNumber = $NodeVersion -replace 'v', ''
        Log-Info "✅ Node.js $VersionNumber OK"
    } catch {
        Log-Error "Node.js não encontrado. Instale Node.js 18+"
    }
    
    # Verificar Vercel CLI
    try {
        $VercelVersion = vercel --version
        if (-not $VercelVersion) {
            Log-Warning "Vercel CLI não encontrado. Instalando..."
            npm install -g vercel
        }
        Log-Info "✅ Vercel CLI OK"
    } catch {
        Log-Warning "Vercel CLI não encontrado. Instalando..."
        npm install -g vercel
    }
    
    # Verificar variáveis de ambiente
    if (-not (Test-Path ".env")) {
        Log-Warning "Arquivo .env não encontrado. Usando .env.example"
        Copy-Item ".env.example" ".env"
        Log-Warning "⚠️  Configure suas API keys no arquivo .env"
    }
}

# Build do projeto
function Build-Project {
    Log-Info "🔨 Iniciando build do projeto..."
    
    # Limpar builds anteriores
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
    }
    
    # Instalar dependências
    Log-Info "📦 Instalando dependências..."
    npm ci
    
    if ($LASTEXITCODE -ne 0) {
        Log-Error "❌ Falha ao instalar dependências"
    }
    
    # Build
    Log-Info "🏗️  Compilando projeto..."
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Log-Info "✅ Build concluído com sucesso"
        
        if (Test-Path "dist") {
            $BuildSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Length / 1MB
            Log-Info "📊 Tamanho do build: $([math]::Round($BuildSize, 2)) MB"
        }
    } else {
        Log-Error "❌ Build falhou"
    }
}

# Deploy para Vercel
function Deploy-ToVercel {
    param([string]$Env)
    
    Log-Info "🚀 Iniciando deploy para $Env..."
    
    switch ($Env) {
        "staging" {
            Log-Info "Deploy para ambiente de staging..."
            vercel
        }
        "production" {
            Log-Info "Deploy para ambiente de produção..."
            vercel --prod
        }
        default {
            Log-Error "Ambiente inválido. Use: staging ou production"
        }
    }
    
    if ($LASTEXITCODE -eq 0) {
        Log-Info "🎉 Deploy concluído com sucesso!"
        Log-Info "🌐 Acompanhe em: https://vercel.com/dashboard"
    } else {
        Log-Error "❌ Deploy falhou"
    }
}

# Verificação pós-deploy
function Post-Deploy-Checks {
    Log-Info "🔍 Executando verificações pós-deploy..."
    
    # Verificar se o dist foi gerado
    if (-not (Test-Path "dist")) {
        Log-Error "Diretório dist não encontrado"
    }
    
    # Verificar arquivos essenciais
    if (-not (Test-Path "dist\index.html")) {
        Log-Error "index.html não encontrado no build"
    }
    
    Log-Info "✅ Verificações concluídas"
}

# Função principal
function Main {
    Log-Info "🚀 LeadFlow Pro - Deploy Automático"
    Log-Info "================================"
    
    Check-Environment
    Build-Project
    Deploy-ToVercel $Environment
    Post-Deploy-Checks
    
    Log-Info "🎯 Deploy finalizado! Seu LeadFlow Pro está no ar!"
}

# Executar script
Main
