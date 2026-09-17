<#
.SYNOPSIS
  Validates that all 14 FrontendForge deliverables exist and are non-empty, and reports coverage of key required topics.

.PARAMETER PlanDir
  Path to the project's plan folder (contains the deliverable Markdown files).

.EXAMPLE
  ./validate-plan.ps1 -PlanDir "Next/Project/TaskPulse/plan"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PlanDir
)

$ErrorActionPreference = "Stop"

$required = @(
    "00-INDEX.md", "01-Project-Research.md", "02-Tech-Stack.md", "03-Architecture.md",
    "04-Product-Spec.md", "05-UIUX-Design.md", "06-Delivery-Plan.md", "07-Security-Auth.md",
    "08-Testing-Strategy.md", "09-Performance.md", "10-Internationalization.md",
    "11-Coding-Standards.md", "12-Starter-Template.md", "13-AI-Features.md"
)

# topic -> file it should appear in, and a regex proving it is covered
$topicChecks = @(
    @{ Topic = "90%+ coverage"; File = "08-Testing-Strategy.md"; Pattern = "(?i)coverage[\s\S]{0,120}?\b(9[0-9]|100)\b|\b(9[0-9]|100)\s*%" },
    @{ Topic = "Core Web Vitals"; File = "09-Performance.md"; Pattern = "LCP|INP|CLS" },
    @{ Topic = "i18n";            File = "10-Internationalization.md"; Pattern = "i18n|locale|Intl" },
    @{ Topic = "Auth";            File = "07-Security-Auth.md"; Pattern = "OAuth|OIDC|auth" },
    @{ Topic = "AI streaming";    File = "13-AI-Features.md"; Pattern = "SSE|stream|EventSource|ReadableStream" }
)

$missing = @()
$empty = @()

foreach ($file in $required) {
    $path = Join-Path $PlanDir $file
    if (-not (Test-Path $path)) {
        $missing += $file
    }
    elseif ((Get-Item $path).Length -lt 200) {
        $empty += $file
    }
}

Write-Host "== FrontendForge plan validation =="
Write-Host "Present : $($required.Count - $missing.Count)/$($required.Count)"

if ($missing.Count) { Write-Warning "Missing: $($missing -join ', ')" }
if ($empty.Count)   { Write-Warning "Too small / likely stub: $($empty -join ', ')" }

foreach ($check in $topicChecks) {
    $path = Join-Path $PlanDir $check.File
    if (Test-Path $path) {
        $hit = Select-String -Path $path -Pattern $check.Pattern -Quiet
        $status = if ($hit) { "OK " } else { "GAP" }
        Write-Host ("[{0}] {1}" -f $status, $check.Topic)
    }
    else {
        Write-Host ("[GAP] {0} (file missing)" -f $check.Topic)
    }
}

if ($missing.Count -eq 0 -and $empty.Count -eq 0) {
    Write-Host "All deliverables present and non-empty." -ForegroundColor Green
    exit 0
}
else {
    exit 1
}
