param(
  [string]$BaseBranch = "main",
  [string]$CommitMessage = "chore: prepare design system release"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

function Invoke-Git([string[]]$Arguments) {
  & git @Arguments
  if ($LASTEXITCODE -ne 0) { throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE." }
}

try {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "Git is required." }

  $branch = (git branch --show-current).Trim()
  if (-not $branch -or $branch -eq $BaseBranch) { throw "Create or switch to a feature branch before deploying. Current branch: '$branch'." }

  Invoke-Git @("fetch", "origin", $BaseBranch)
  $baseSha = (git rev-parse "origin/$BaseBranch").Trim()
  $headSha = (git rev-parse HEAD).Trim()
  & git merge-base --is-ancestor $baseSha $headSha
  if ($LASTEXITCODE -ne 0) { throw "Your branch is behind or diverged from origin/$BaseBranch. Rebase it before deploying." }

  $preStaged = @(git diff --cached --name-only)
  if ($preStaged.Count -gt 0) { throw "The Git index already has staged files. Unstage/review them before running this deployment script." }

  # Stage only existing project source, release notes, and docs. Secrets, generated
  # artifacts, local build output, and unrelated files such as prompt.md are excluded.
  $stagePaths = @(".changeset", "packages", "apps/dashboard/app", "apps/docs/app", "docs", "README.md", "package.json", "scripts") |
    Where-Object { Test-Path -LiteralPath $_ }
  if ($stagePaths.Count -eq 0) { throw "No recognized project paths were found to stage." }
  Invoke-Git (@("add", "-A", "--") + $stagePaths)
  $generated = @(git ls-files ":(glob)**/.turbo/**" ":(glob)**/dist/**" ":(glob)**/build/**" ":(glob)**/coverage/**")
  if ($generated.Count -gt 0) { Invoke-Git (@("restore", "--staged", "--") + $generated) }

  # This repo currently has generated Turbo logs in its unpushed release commit.
  # If they are only in HEAD, remove them from that commit while preserving other changes.
  $headParent = (git rev-parse "HEAD^").Trim()
  $committedLogs = @(git diff --name-only "$baseSha...HEAD" | Where-Object { $_ -match "(^|/)\.turbo/" })
  if ($committedLogs.Count -gt 0) {
    if ($headParent -ne $baseSha) { throw "Generated .turbo logs are in an older commit. Clean them from the branch before deploying." }
    Invoke-Git (@("restore", "--source=origin/$BaseBranch", "--staged", "--") + $committedLogs)
    Invoke-Git @("commit", "--amend", "--no-edit")
  }

  $staged = @(git diff --cached --name-only)
  if ($staged.Count -gt 0) { Invoke-Git @("commit", "-m", $CommitMessage) }

  $releaseNotes = @(git diff --name-only "origin/$BaseBranch...HEAD" -- .changeset)
  if ($releaseNotes.Count -eq 0) { throw "No Changeset found in this branch. Add one with pnpm changeset before publishing packages." }
  $badPaths = @(git diff --name-only "origin/$BaseBranch...HEAD" | Where-Object { $_ -match "(^|/)\.turbo/|(^|/)(dist|build)/" })
  if ($badPaths.Count -gt 0) { throw "Generated files are included in the release diff: $($badPaths -join ', '). Remove them before deploying." }

  $confirmation = Read-Host "Commit and push the release branch $branch? Type DEPLOY to continue"
  if ($confirmation -cne "DEPLOY") { throw "Deployment cancelled." }

  Invoke-Git @("push", "--force-with-lease", "-u", "origin", $branch)
  $remote = (git remote get-url origin).Trim()
  if ($remote -match "^https://github\.com/([^/]+)/([^/]+?)(?:\.git)?$") {
    $owner = $Matches[1]
    $repo = $Matches[2]
  } elseif ($remote -match "^git@github\.com:([^/]+)/([^/]+?)(?:\.git)?$") {
    $owner = $Matches[1]
    $repo = $Matches[2]
  } else {
    throw "Could not build a GitHub PR link from origin URL '$remote'. Open your repository and compare $BaseBranch with $branch."
  }
  $compareUrl = "https://github.com/$owner/$repo/compare/${BaseBranch}...${branch}?expand=1"
  Write-Host ""
  Write-Host "Branch pushed. Create the code PR here: $compareUrl"
  Write-Host "After its checks pass, merge it in GitHub. Then merge the Changesets PR titled 'chore: release packages' to publish."
  Write-Host "Approve the package-release environment in GitHub Actions if requested."
}
finally {
  Pop-Location
}
