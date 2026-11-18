param(
    [string]$Repo = (Get-Location).Path,
    [ValidateSet('Unit', 'Integration', 'All')][string]$Mode = 'Unit'
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repoPath = (Resolve-Path -LiteralPath $Repo).Path
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& (Join-Path $scriptDir 'gd5-0-preflight.ps1') -Repo $repoPath

function Step([string]$Label, [string[]]$Arguments) {
    Write-Host "[GD5.0] $Label" -ForegroundColor Cyan
    & dotnet @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Label thất bại (exit $LASTEXITCODE)." }
}

$oldTest = [Environment]::GetEnvironmentVariable('FOOTBALLBOOKING_TEST_CONNECTION', 'Process')
$oldApp = [Environment]::GetEnvironmentVariable('ConnectionStrings__DefaultConnection', 'Process')
try {
    if ($Mode -ne 'Unit') {
        $conn = $oldTest
        if ([string]::IsNullOrWhiteSpace($conn)) {
            Write-Warning 'Integration tests sẽ xóa/tạo lại CHỈ database football_booking_gd0_test trên MySQL localhost.'
            $secure = Read-Host 'Nhập mật khẩu MySQL root dùng cho TEST DB' -AsSecureString
            $password = [System.Net.NetworkCredential]::new('', $secure).Password
            $conn = "Server=127.0.0.1;Port=3306;Database=football_booking_gd0_test;User=root;Password=$password;SslMode=Preferred"
        }
        # Fail closed before invoking any test that may call EnsureDeletedAsync().
        if ($conn -notmatch '(?i)(?:^|;)\s*(?:Database|Initial Catalog)\s*=\s*football_booking_gd0_test\s*(?:;|$)' -or
            $conn -notmatch '(?i)(?:^|;)\s*(?:Server|Host)\s*=\s*(?:127\.0\.0\.1|localhost)\s*(?:;|$)') {
            throw 'TỪ CHỐI: integration test chỉ dùng football_booking_gd0_test trên localhost/127.0.0.1.'
        }
        $env:FOOTBALLBOOKING_TEST_CONNECTION = $conn
        $env:ConnectionStrings__DefaultConnection = $conn
    }

    Step 'Restore' @('restore', (Join-Path $repoPath 'FootballBooking.slnx'))
    Step 'Build' @('build', (Join-Path $repoPath 'FootballBooking.slnx'), '-c', 'Release', '--no-restore')
    $testArgs = @('test', (Join-Path $repoPath 'tests/FootballBooking.Tests/FootballBooking.Tests.csproj'),
              '-c', 'Release', '--no-build', '--logger', 'console;verbosity=normal')
    if ($Mode -eq 'Unit') {
        $testArgs += @('--filter', 'FullyQualifiedName!~FootballBooking.Tests.Integration')
    } elseif ($Mode -eq 'Integration') {
        $testArgs += @('--filter', 'FullyQualifiedName~FootballBooking.Tests.Integration')
    }
    Step "$Mode test suite" $testArgs
    Write-Host '[GD5.0] TESTS PASSED' -ForegroundColor Green
}
finally {
    [Environment]::SetEnvironmentVariable('FOOTBALLBOOKING_TEST_CONNECTION', $oldTest, 'Process')
    [Environment]::SetEnvironmentVariable('ConnectionStrings__DefaultConnection', $oldApp, 'Process')
}
