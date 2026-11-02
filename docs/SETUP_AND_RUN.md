# SETUP AND RUN GUIDE

Tài liệu này đóng luồng từ máy trắng đến repository chạy được trong Visual Studio và Codex app.

---

## 1. Công cụ cần cài trên Windows

### 1.1. Visual Studio

Cài Visual Studio bản hiện hành hỗ trợ .NET 10.

Trong Visual Studio Installer chọn workload:

- **ASP.NET and web development**.

Nên có thêm:

- .NET desktop development, không bắt buộc.
- Git for Windows nếu máy chưa có Git.

Sau cài đặt, mở terminal:

```powershell
dotnet --info
dotnet --list-sdks
```

Phải thấy SDK `10.0.x`.

### 1.2. Node.js

Cài Node.js LTS.

Kiểm tra:

```powershell
node --version
npm --version
```

### 1.3. Git

```powershell
git --version
```

Thiết lập tên/email nếu chưa có:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 1.4. EF Core CLI

```powershell
dotnet tool install --global dotnet-ef
```

Nếu đã có:

```powershell
dotnet tool update --global dotnet-ef
```

Kiểm tra:

```powershell
dotnet ef --version
```

### 1.5. MySQL

Cài MySQL Server 8.4+ hoặc chạy MySQL bằng Docker. Có thể dùng MySQL Workbench/DBeaver để xem dữ liệu, nhưng không dùng công cụ GUI thay cho EF Core migration.

---

## 2. Tạo thư mục và Git repository

Chọn nơi lưu code, ví dụ:

```powershell
cd D:\Projects
mkdir FootballBooking
cd FootballBooking
git init
```

Giải nén bộ tài liệu vào đây để root có:

```text
AGENTS.md
README.md
TASKS.md
docs/
```

Tạo `.gitignore`:

```powershell
dotnet new gitignore
```

Bổ sung nếu chưa có:

```gitignore
# Local database and uploads
**/App_Data/*.db
**/App_Data/*.db-shm
**/App_Data/*.db-wal
**/wwwroot/uploads/*
!**/wwwroot/uploads/.gitkeep

# Node
node_modules/

# Local secrets/settings
appsettings.Local.json
```

---

## 3. Tạo solution bằng CLI — phương án khuyến nghị

CLI tạo cấu trúc chính xác và dễ cho Codex tái tạo.

```powershell
dotnet new sln -n FootballBooking
mkdir src
mkdir tests

dotnet new mvc -n FootballBooking.Web -o src/FootballBooking.Web --framework net10.0
dotnet new classlib -n FootballBooking.Application -o src/FootballBooking.Application --framework net10.0
dotnet new classlib -n FootballBooking.Domain -o src/FootballBooking.Domain --framework net10.0
dotnet new classlib -n FootballBooking.Infrastructure -o src/FootballBooking.Infrastructure --framework net10.0
dotnet new xunit -n FootballBooking.Tests -o tests/FootballBooking.Tests --framework net10.0
```

Thêm vào solution:

```powershell
dotnet sln FootballBooking.sln add src/FootballBooking.Web/FootballBooking.Web.csproj
dotnet sln FootballBooking.sln add src/FootballBooking.Application/FootballBooking.Application.csproj
dotnet sln FootballBooking.sln add src/FootballBooking.Domain/FootballBooking.Domain.csproj
dotnet sln FootballBooking.sln add src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj
dotnet sln FootballBooking.sln add tests/FootballBooking.Tests/FootballBooking.Tests.csproj
```

Project references:

```powershell
dotnet add src/FootballBooking.Application/FootballBooking.Application.csproj reference src/FootballBooking.Domain/FootballBooking.Domain.csproj

dotnet add src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj reference src/FootballBooking.Application/FootballBooking.Application.csproj
dotnet add src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj reference src/FootballBooking.Domain/FootballBooking.Domain.csproj

dotnet add src/FootballBooking.Web/FootballBooking.Web.csproj reference src/FootballBooking.Application/FootballBooking.Application.csproj
dotnet add src/FootballBooking.Web/FootballBooking.Web.csproj reference src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj

dotnet add tests/FootballBooking.Tests/FootballBooking.Tests.csproj reference src/FootballBooking.Domain/FootballBooking.Domain.csproj
dotnet add tests/FootballBooking.Tests/FootballBooking.Tests.csproj reference src/FootballBooking.Application/FootballBooking.Application.csproj
dotnet add tests/FootballBooking.Tests/FootballBooking.Tests.csproj reference src/FootballBooking.Infrastructure/FootballBooking.Infrastructure.csproj
dotnet add tests/FootballBooking.Tests/FootballBooking.Tests.csproj reference src/FootballBooking.Web/FootballBooking.Web.csproj
```

Xóa file mẫu `Class1.cs` trong các class library khi bắt đầu code thật.

---

## 4. Package nền tảng

Cài vào Infrastructure:

```powershell
dotnet add src/FootballBooking.Infrastructure package Pomelo.EntityFrameworkCore.MySql
dotnet add src/FootballBooking.Infrastructure package Microsoft.EntityFrameworkCore.Design
dotnet add src/FootballBooking.Infrastructure package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

Cài test integration:

```powershell
dotnet add tests/FootballBooking.Tests package Microsoft.AspNetCore.Mvc.Testing
```

Không thêm package UI/backend ngoài danh sách nếu chưa có nhu cầu cụ thể.

Lưu ý: package nên cùng major version với .NET/EF Core 10. Lệnh không chỉ định version sẽ chọn bản tương thích hiện hành; review file csproj sau khi cài.

---

## 5. Cấu hình csproj

Trong mỗi project đảm bảo:

```xml
<PropertyGroup>
  <TargetFramework>net10.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
</PropertyGroup>
```

Có thể bật cảnh báo nghiêm hơn sau baseline, không biến toàn bộ warning thành error trước khi team thống nhất.

---

## 6. Mở trong Visual Studio

1. Mở Visual Studio.
2. Chọn **Open a project or solution**.
3. Chọn `FootballBooking.sln`.
4. Trong Solution Explorer, bấm phải `FootballBooking.Web`.
5. Chọn **Set as Startup Project**.
6. Chọn profile HTTPS.
7. Nhấn `Ctrl+F5` để chạy không debug hoặc `F5` để debug.

Visual Studio không phải nơi tạo thêm project tùy ý sau khi đã dùng CLI; nếu cần project mới, tạo đúng kiến trúc và thêm vào solution.

### 6.1. Development settings

`src/FootballBooking.Web/Properties/launchSettings.json` do template tạo.

Không hard-code port vào tài liệu nghiệp vụ. Dùng URL Visual Studio hiển thị.

### 6.2. User Secrets

```powershell
dotnet user-secrets init --project src/FootballBooking.Web

dotnet user-secrets set "SeedOwner:Email" "owner@example.local" --project src/FootballBooking.Web
dotnet user-secrets set "SeedOwner:Password" "ChangeThisLocalOnly!123" --project src/FootballBooking.Web
```

Sau khi đăng nhập lần đầu, đổi password local nếu cần. Không dùng password mẫu ở production.

---

## 7. Thiết lập Codex app

### 7.1. Chuẩn bị trước

Codex làm tốt nhất khi repository:

- Đã có Git.
- Có `AGENTS.md` ở root.
- Có `TASKS.md`.
- Có docs.
- Baseline build được.

### 7.2. Thêm project

1. Mở Codex app.
2. Đăng nhập bằng tài khoản ChatGPT.
3. Chọn **Add project** hoặc project selector.
4. Chọn đúng thư mục root `FootballBooking`, không chọn riêng `src/FootballBooking.Web`.
5. Xác nhận chế độ local/project.
6. Để Codex đọc repository.

### 7.3. Task đầu tiên cho Codex

Không yêu cầu “build toàn bộ dự án”. Dùng prompt:

```text
Read AGENTS.md, TASKS.md, docs/ARCHITECTURE.md and docs/SETUP_AND_RUN.md.
Inspect the repository and report whether Phase 0 foundation matches the docs.
Do not edit files yet. List missing tools, project-reference problems and the exact next task.
```

Sau khi review:

```text
Implement only the next unchecked Phase 0 task in TASKS.md.
Do not add business entities. Run the required build/tests and update TASKS.md only if verified.
```

### 7.4. Quyền chạy lệnh

Giai đoạn đầu nên để Codex yêu cầu duyệt các lệnh thay đổi hoặc cài package. Chỉ tăng tự động hóa sau khi hiểu diff và command của nó.

Luôn review:

- Files changed.
- Package added.
- Migration.
- Shell command.
- Test result.

### 7.5. Luồng giữa Codex và Visual Studio

- Codex: tạo/sửa code và chạy check.
- Visual Studio: debug, breakpoint, xem UI, inspect database/log.
- Git: nguồn sự thật về diff.

Trước khi mở task Codex mới:

```powershell
git status
```

Nên commit hoặc stash thay đổi thủ công để tránh trộn diff.

---

## 8. Frontend setup

Chạy tại root repository:

```powershell
npm init -y
npm install -D tailwindcss @tailwindcss/cli @tailwindcss/forms esbuild concurrently
npm install preline
```

Chưa cài FullCalendar và Chart.js ở Phase 0. Cài đúng lúc triển khai module để tránh dependency chưa dùng:

```powershell
# Phase 8 — lịch nội bộ, theo FullCalendar v7
npm install fullcalendar temporal-polyfill

# Phase 9 — dashboard và báo cáo
npm install chart.js
```

Tạo:

```text
src/FootballBooking.Web/Styles/input.css
```

Nội dung khởi đầu Tailwind v4:

```css
@import "tailwindcss";

/* Razor Views được quét từ vị trí của input.css */
@source "../Views/**/*.cshtml";
@source "../Areas/**/*.cshtml";

/* Preline UI */
@source "../../../node_modules/preline/dist/*.js";
@import "../../../node_modules/preline/variants.css";
@plugin "@tailwindcss/forms";
```

Tạo JavaScript entry:

```text
src/FootballBooking.Web/Scripts/site.js
```

Nội dung tối thiểu:

```javascript
import "../../../node_modules/preline/dist/preline.js";
```

Tạo thư mục output nếu chưa có:

```powershell
mkdir src/FootballBooking.Web/wwwroot/js -ErrorAction SilentlyContinue
```

`package.json` scripts gợi ý:

```json
{
  "scripts": {
    "css:dev": "npx @tailwindcss/cli -i ./src/FootballBooking.Web/Styles/input.css -o ./src/FootballBooking.Web/wwwroot/css/site.css --watch",
    "js:dev": "esbuild ./src/FootballBooking.Web/Scripts/site.js --bundle --sourcemap --outfile=./src/FootballBooking.Web/wwwroot/js/site.js --watch",
    "dev": "concurrently -k \"npm:css:dev\" \"npm:js:dev\"",
    "css:build": "npx @tailwindcss/cli -i ./src/FootballBooking.Web/Styles/input.css -o ./src/FootballBooking.Web/wwwroot/css/site.css --minify",
    "js:build": "esbuild ./src/FootballBooking.Web/Scripts/site.js --bundle --minify --outfile=./src/FootballBooking.Web/wwwroot/js/site.js",
    "build": "npm run css:build && npm run js:build"
  }
}
```

Trong cả hai layout, load asset đã build:

```html
<link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
<script src="~/js/site.js" asp-append-version="true" defer></script>
```

Pipeline này dùng Tailwind CLI cho CSS và esbuild cho JavaScript. Nó không biến dự án thành SPA.

Khi đến Phase 8, tạo entry riêng như `Scripts/admin-schedule.js` và import FullCalendar v7 từ package `fullcalendar`; khi đến Phase 9, tạo entry dashboard và import Chart.js. Không nhồi toàn bộ thư viện vào public bundle nếu trang không sử dụng.

---

## 9. Identity và MySQL setup — thực hiện Phase 1

Không làm trong Phase 0 nếu chưa được task cho phép.

Connection string gợi ý:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=football_booking;User=footballbooking;Password=your-local-password;SslMode=Preferred;AllowPublicKeyRetrieval=True"
  },
  "Database": {
    "ServerVersion": "8.4.0"
  },
  "Business": {
    "TimeZoneId": "Asia/Ho_Chi_Minh"
  },
  "BookingSettings": {
    "HoldMinutes": 10,
    "MinimumDurationMinutes": 60,
    "OtpExpirationMinutes": 5,
    "CancellationHoursBeforeStart": 12
  }
}
```

Không commit mật khẩu production. Ưu tiên cấu hình local bằng User Secrets:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=football_booking;User=footballbooking;Password=your-local-password" --project src/FootballBooking.Web
```

Migration commands:

```powershell
dotnet ef migrations add InitialCreate `
  --project src/FootballBooking.Infrastructure `
  --startup-project src/FootballBooking.Web

dotnet ef database update `
  --project src/FootballBooking.Infrastructure `
  --startup-project src/FootballBooking.Web
```

---

## 10. Cách chạy hằng ngày

### 10.1. Lần đầu sau clone

```powershell
git pull
dotnet restore
npm ci
dotnet ef database update `
  --project src/FootballBooking.Infrastructure `
  --startup-project src/FootballBooking.Web
npm run build
dotnet run --project src/FootballBooking.Web
```

`npm ci` chỉ dùng khi đã có `package-lock.json`. Nếu chưa có lock file ở lần khởi tạo, dùng `npm install` rồi commit lock file.

### 10.2. Phát triển frontend + backend

Terminal A:

```powershell
npm run dev
```

Terminal B:

```powershell
dotnet watch --project src/FootballBooking.Web
```

Hoặc dùng Visual Studio F5 và giữ Terminal A chạy Tailwind watch.

### 10.3. Chỉ backend

Nếu không sửa class Tailwind:

```powershell
dotnet watch --project src/FootballBooking.Web
```

### 10.4. Chạy production-like local

```powershell
npm run build
dotnet publish src/FootballBooking.Web -c Release -o artifacts/publish
```

Chạy publish output cần cấu hình environment/connection phù hợp; không dùng secrets development cho production.

---

## 11. Luồng làm việc Git hợp lý

### Bắt đầu task

```powershell
git status
git pull
```

Tạo branch:

```powershell
git switch -c feat/phase-0-foundation
```

### Sau khi Codex hoặc Visual Studio sửa

```powershell
git diff
dotnet build
dotnet test
npm run build
git status
```

Commit:

```powershell
git add .
git commit -m "chore: initialize solution foundation"
```

Không để Codex trộn nhiều phase vào cùng branch nếu chưa review.

---

## 12. Troubleshooting

### `dotnet` không nhận

- Cài .NET 10 SDK, không chỉ runtime.
- Mở terminal mới.
- Kiểm tra PATH.

### Visual Studio không có .NET 10

- Update Visual Studio.
- Mở Visual Studio Installer.
- Update workload ASP.NET and web development.

### `dotnet ef` không nhận

```powershell
dotnet tool update --global dotnet-ef
```

Mở terminal mới.

### Không kết nối được MySQL

- Kiểm tra MySQL đang chạy và port 3306 có thể truy cập.
- Kiểm tra database/user/quyền truy cập trong connection string.
- Đặt `Database:ServerVersion` đúng phiên bản server.
- Dùng User Secrets hoặc biến môi trường thay vì commit mật khẩu thật.

### Tailwind không sinh class

- Kiểm tra `@source` trỏ đúng Views/Areas.
- Chạy `npm run build` và xem lỗi.
- Không tạo class động kiểu nối chuỗi mà Tailwind không phát hiện; dùng mapping class đầy đủ.

### Preline dropdown không hoạt động

- Kiểm tra JS Preline được load sau DOM.
- Kiểm tra không có lỗi console.
- Không trộn nhiều bản Preline/CDN/package.

---

## 13. Checklist đóng luồng foundation

- [ ] `dotnet --list-sdks` có 10.0.x.
- [ ] Visual Studio mở solution.
- [ ] Codex app chọn đúng root.
- [ ] AGENTS.md được Codex đọc.
- [ ] Project references đúng.
- [ ] `dotnet restore` pass.
- [ ] `dotnet build` pass.
- [ ] `dotnet test` pass.
- [ ] `npm run build` pass.
- [ ] Public placeholder tải được.
- [ ] `/admin` placeholder hoặc route foundation tải được theo phase.
- [ ] Git baseline committed.
- [ ] `git status` sạch.
