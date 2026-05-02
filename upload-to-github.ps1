# Upload current folder to GitHub

$RepoUrl = "https://github.com/alex-smirnoff/design.git"
$Branch = "main"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git was not found." -ForegroundColor Red
    exit 1
}

Write-Host "Current folder:" -ForegroundColor Cyan
Get-Location

if (-not (Test-Path ".git")) {
    Write-Host "Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    git branch -M $Branch
    git remote add origin $RepoUrl
} else {
    Write-Host "Git repository already exists." -ForegroundColor Green

    $RemoteExists = git remote | Select-String "origin"

    if (-not $RemoteExists) {
        git remote add origin $RepoUrl
    } else {
        git remote set-url origin $RepoUrl
    }

    git branch -M $Branch
}

Write-Host ""
Write-Host "Largest files:" -ForegroundColor Cyan
Get-ChildItem -Recurse -File |
    Sort-Object Length -Descending |
    Select-Object -First 10 FullName, @{Name="MB";Expression={[math]::Round($_.Length / 1MB, 2)}} |
    Format-Table -AutoSize

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Cyan
git add -A

$Status = git status --porcelain

if (-not $Status) {
    Write-Host "No changes to commit." -ForegroundColor Green
} else {
    git commit -m "Update portfolio files"
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin $Branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Done. Files were uploaded to GitHub." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed." -ForegroundColor Red
    exit 1
}