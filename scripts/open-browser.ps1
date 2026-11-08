$address = 'http://127.0.0.1:3000'
for ($attempt = 0; $attempt -lt 120; $attempt++) {
  try {
    $page = Invoke-WebRequest -Uri $address -TimeoutSec 2 -UseBasicParsing
    if ($page.StatusCode -eq 200 -and $page.Content.Contains('Ta vie scolaire,')) {
      Start-Process $address
      exit 0
    }
  } catch { }
  Start-Sleep -Milliseconds 500
}
