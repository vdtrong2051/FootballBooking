param(
    [string]$Repo = (Get-Location).Path
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$expectedBranch = 'feat/footballbooking-gd0-gd4'
$baseline = 'b663ab2e5884f5dc0b2daa866f90868cd35dcef4'
$repoPath = (Resolve-Path -LiteralPath $Repo).Path

& git -C $repoPath rev-parse --is-inside-work-tree | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Không tìm thấy Git repository.' }
$branch = (& git -C $repoPath branch --show-current).Trim()
if ($branch -ne $expectedBranch) { throw "Sai nhánh. Đang ở $branch; cần $expectedBranch." }
& git -C $repoPath merge-base --is-ancestor $baseline HEAD
if ($LASTEXITCODE -ne 0) { throw 'Baseline b663ab2 không thuộc lịch sử HEAD. Dừng để tránh nhầm phiên bản.' }
$head = (& git -C $repoPath rev-parse --short HEAD).Trim()
Write-Host "[GD5.0] Branch: $branch / HEAD: $head" -ForegroundColor Cyan

$required = @(
    'FootballBooking.slnx',
    'tests/FootballBooking.Tests/FootballBooking.Tests.csproj',
    'tests/FootballBooking.Tests/Integration/MySqlTestDatabase.cs',
    'src/FootballBooking.Web/Controllers/LanDemoPaymentController.cs',
    'src/FootballBooking.Application/Bookings/BookingService.cs',
    'tests/FootballBooking.Tests/Regression/Gd5BaselineBookingTests.cs',
    'tests/FootballBooking.Tests/Regression/Gd5BaselinePermissionAndConfigTests.cs'
)
foreach ($relative in $required) {
    if (-not (Test-Path -LiteralPath (Join-Path $repoPath $relative) -PathType Leaf)) {
        throw "Thiếu file: $relative"
    }
}

$dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
if (-not $dotnet) { throw 'Chưa cài .NET SDK 10.' }
$version = (& dotnet --version).Trim()
if ($version -notmatch '^10\.') { throw "Yêu cầu .NET SDK 10; máy hiện dùng $version" }
Write-Host "[GD5.0] .NET SDK $version" -ForegroundColor Green

$status = & git -C $repoPath status --short
if ($status) {
    Write-Warning 'Working tree có thay đổi. Script không tự sửa, reset hay commit.'
    $status | ForEach-Object { Write-Host $_ }
}
Write-Host '[GD5.0] Preflight OK: không thao tác database, không backup, không seed.' -ForegroundColor Green
Write-Host '[GD5.0] Integration tests hiện có CHỈ được chạy trên football_booking_gd0_test và có reset dữ liệu.' -ForegroundColor Yellow
