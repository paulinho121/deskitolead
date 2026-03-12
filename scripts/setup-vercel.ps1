# 🚀 Script de Setup Vercel para GitHub Actions (PowerShell)
# Gera automaticamente as credenciais necessárias

param(
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Cores para output
function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Log-Info($Message) {
    Write-ColorOutput Green "[$(Get-Date -Format 'HH:mm:ss')] $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "[INFO] $Message"
}

function Write-Warning($Message) {
    Write-ColorOutput Yellow "[WARNING] $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "[ERROR] $Message"
    if (-not $Force) {
        exit 1
    }
}

# Verificar Vercel CLI
function Test-VercelCLI {
    try {
        $Version = vercel --version
        if (-not $Version) {
            throw "Vercel não encontrado"
        }
        Log-Info "✅ Vercel CLI $Version pronto"
    } catch {
        Write-Warning "Vercel CLI não encontrado. Instalando..."
        npm install -g vercel
        Log-Info "✅ Vercel CLI instalado"
    }
}

# Login na Vercel
function Connect-Vercel {
    Write-Info "Fazendo login na Vercel..."
    vercel login
    Log-Info "✅ Login concluído"
}

# Obter Organization ID
function Get-VercelOrgId {
    Write-Info "Obtendo Organization ID..."
    
    try {
        $Output = vercel ls 2>$null
        if ($Output) {
            $FirstLine = $Output -split "`n" | Select-Object -First 1
            $OrgId = ($FirstLine -split '\s+')[1]
            
            if ($OrgId) {
                Log-Info "✅ Organization ID: $OrgId"
                return $OrgId
            }
        }
        throw "Não foi possível obter Organization ID"
    } catch {
        Write-Error "Não foi possível obter Organization ID. Verifique se está logado: vercel login"
    }
}

# Obter Project ID
function Get-VercelProjectId {
    Write-Info "Obtendo Project ID..."
    
    try {
        # Tentar obter do .vercel
        $ProjectJsonPath = ".vercel\project.json"
        if (Test-Path $ProjectJsonPath) {
            $Content = Get-Content $ProjectJsonPath | ConvertFrom-Json
            $ProjectId = $Content.projectId
            
            if ($ProjectId) {
                Log-Info "✅ Project ID: $ProjectId"
                return $ProjectId
            }
        }
        
        # Tentar via CLI
        $Output = vercel project ls 2>$null
        if ($Output) {
            $FirstLine = $Output -split "`n" | Select-Object -Skip 1 -First 1
            $ProjectId = ($FirstLine -split '\s+')[1]
            
            if ($ProjectId) {
                Log-Info "✅ Project ID: $ProjectId"
                return $ProjectId
            }
        }
        
        throw "Não foi possível obter Project ID"
    } catch {
        Write-Error "Não foi possível obter Project ID. Execute: vercel link"
    }
}

# Gerar Token
function New-VercelToken {
    Write-Info "Gerando Vercel Token..."
    
    $TokenName = "github-actions-$(Get-Date -Format 'yyyyMMddHHmmss')"
    
    try {
        # Tentar criar token automaticamente
        $Token = vercel tokens create $TokenName --scope=project 2>$null
        
        if ($Token) {
            Log-Info "✅ Token gerado automaticamente"
            return $Token
        }
    } catch {
        Write-Warning "Falha ao criar token automaticamente"
    }
    
    # Criar manualmente
    Write-Info "Criando token manualmente..."
    Write-Info "1. Acesse: https://vercel.com/account/tokens"
    Write-Info "2. Clique 'Create Token'"
    Write-Info "3. Nome: $TokenName"
    Write-Info "4. Scope: Project"
    Write-Info "5. Copie o token gerado"
    
    $Token = Read-Host "Cole o token aqui"
    
    if (-not $Token) {
        Write-Error "Token não fornecido"
    }
    
    Log-Info "✅ Token configurado"
    return $Token
}

# Mostrar instruções
function Show-Instructions($Token, $OrgId, $ProjectId) {
    Write-Host ""
    Log-Info "🎯 Credenciais Geradas!"
    Write-Host ""
    Write-Info "Configure estes secrets no GitHub:"
    Write-Host ""
    Write-Info "📍 Repository: Settings → Secrets and variables → Actions"
    Write-Host ""
    Write-Info "🔑 Secrets a adicionar:"
    Write-Host ""
    
    Write-Host "VERCEL_TOKEN:" -ForegroundColor Green
    Write-Host $Token
    Write-Host ""
    
    Write-Host "VERCEL_ORG_ID:" -ForegroundColor Green
    Write-Host $OrgId
    Write-Host ""
    
    Write-Host "VERCEL_PROJECT_ID:" -ForegroundColor Green
    Write-Host $ProjectId
    Write-Host ""
    
    Write-Info "📋 Copie cada valor acima e cole nos secrets correspondentes"
    Write-Host ""
    Write-Warning "⚠️  Mantenha estes valores seguros e privados!"
    Write-Host ""
    Log-Info "🚀 Após configurar, faça: git push origin main"
}

# Função principal
function Main {
    Log-Info "🚀 Setup Vercel para GitHub Actions"
    Log-Info "=================================="
    
    Test-VercelCLI
    Connect-Vercel
    
    $OrgId = Get-VercelOrgId
    $ProjectId = Get-VercelProjectId
    $Token = New-VercelToken
    
    Show-Instructions -Token $Token -OrgId $OrgId -ProjectId $ProjectId
    
    Log-Info "✅ Setup concluído!"
}

# Executar script
try {
    Main
} catch {
    Write-Error "Erro durante setup: $_"
    exit 1
}
