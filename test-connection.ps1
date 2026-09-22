# HackMe'26 Connection Test Script
# Verifies all services are running and connected

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  HackMe'26 Connection Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{
        Name = "Backend API"
        Url = "http://localhost:4000/api/v1/participants/"
        Expected = "JSON response"
    },
    @{
        Name = "Main Website"
        Url = "http://localhost:5173"
        Expected = "HTML content"
    },
    @{
        Name = "Admin Panel"
        Url = "http://localhost:5174"
        Expected = "HTML content"
    },
    @{
        Name = "Admin Portal Page"
        Url = "http://localhost:5173/admin-portal"
        Expected = "HTML content"
    }
)

$passed = 0
$failed = 0

foreach ($test in $tests) {
    Write-Host "Testing $($test.Name)..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $test.Url -TimeoutSec 5 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✓ PASSED" -ForegroundColor Green
            Write-Host "  └─ URL: $($test.Url)" -ForegroundColor DarkGray
            Write-Host "  └─ Status: $($response.StatusCode)" -ForegroundColor DarkGray
            $passed++
        } else {
            Write-Host " ✗ FAILED" -ForegroundColor Red
            Write-Host "  └─ Status: $($response.StatusCode)" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        Write-Host "  └─ Error: Service not running or unreachable" -ForegroundColor Red
        Write-Host "  └─ URL: $($test.Url)" -ForegroundColor DarkGray
        $failed++
    }
    
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($failed -gt 0) {
    Write-Host "⚠️  Some services are not running!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start all services, run:" -ForegroundColor White
    Write-Host "  .\start-all.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or start them manually:" -ForegroundColor White
    Write-Host "  Terminal 1: cd backend && python manage.py runserver 4000" -ForegroundColor Gray
    Write-Host "  Terminal 2: npm run dev" -ForegroundColor Gray
    Write-Host "  Terminal 3: cd admin && npm run dev" -ForegroundColor Gray
} else {
    Write-Host "✅ All services are running correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access your applications:" -ForegroundColor White
    Write-Host "  Main Website:    http://localhost:5173" -ForegroundColor Cyan
    Write-Host "  Admin Portal:    http://localhost:5173/admin-portal" -ForegroundColor Cyan
    Write-Host "  Admin Panel:     http://localhost:5174" -ForegroundColor Cyan
    Write-Host "  Backend API:     http://localhost:4000/api/v1" -ForegroundColor Cyan
}

Write-Host ""
