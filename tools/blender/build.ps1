# Builds every model script in tools/blender into public/models/*.glb with Blender.
# Run from anywhere:
#   powershell -ExecutionPolicy Bypass -File E:\ai\ropexpanse\tools\blender\build.ps1
# Finds Blender through its Start Menu shortcut, Program Files or AppData\Local\Programs.
param([string]$Blender = "")
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Resolve-Path (Join-Path $here "..\..")
$out = Join-Path $repo "public\models"
New-Item -ItemType Directory -Force -Path $out | Out-Null

function Find-Blender {
  if ($Blender) {
    # Accepts blender.exe, blender-launcher.exe or the folder with them.
    if (Test-Path $Blender -PathType Container) { $Blender = Join-Path $Blender "blender.exe" }
    $exe = Join-Path (Split-Path $Blender) "blender.exe"
    if (Test-Path $exe) { return $exe }
  }
  $cmd = Get-Command blender.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $menus = @("$env:APPDATA\Microsoft\Windows\Start Menu\Programs", "$env:ProgramData\Microsoft\Windows\Start Menu\Programs")
  $shell = New-Object -ComObject WScript.Shell
  foreach ($m in $menus) {
    if (-not (Test-Path $m)) { continue }
    foreach ($lnk in Get-ChildItem $m -Recurse -Filter "*Blender*.lnk" -ErrorAction SilentlyContinue) {
      $target = $shell.CreateShortcut($lnk.FullName).TargetPath
      if ($target -and $target.ToLower().EndsWith("blender.exe") -and (Test-Path $target)) { return $target }
      if ($target -and (Test-Path $target)) {
        $near = Join-Path (Split-Path $target) "blender.exe"
        if (Test-Path $near) { return $near }
      }
    }
  }
  foreach ($root in @("E:\PROGRAM FILES NEW", "$env:ProgramFiles\Blender Foundation", "$env:LOCALAPPDATA\Programs\Blender Foundation", "$env:LOCALAPPDATA\Programs")) {
    if (-not (Test-Path $root)) { continue }
    $exe = Get-ChildItem $root -Recurse -Filter blender.exe -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
    if ($exe) { return $exe.FullName }
  }
  return $null
}

$blender = Find-Blender
if (-not $blender) {
  Write-Host 'Nie znaleziono blender.exe. Uruchom recznie: & "SCIEZKA\blender.exe" -b -P tools\blender\warrior.py -- public\models\warrior.glb' -ForegroundColor Red
  exit 1
}
Write-Host "Blender: $blender"
foreach ($script in Get-ChildItem $here -Filter *.py) {
  $glb = Join-Path $out ($script.BaseName + ".glb")
  Write-Host "Buduje $($script.Name) -> $glb"
  & $blender -b --factory-startup -P $script.FullName -- $glb 2>&1 | Where-Object { $_ -match "WROTE|Error|Traceback" }
}
Write-Host "Gotowe. Modele w $out" -ForegroundColor Green
