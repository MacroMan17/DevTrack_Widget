# Create Desktop Shortcut for DevTrack Widget
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "DevTrack Widget.lnk"
$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodePath = Join-Path $ProjectPath "node_modules\.bin\electron.cmd"
$MainPath = Join-Path $ProjectPath "main.js"

# Create WScript Shell object
$WshShell = New-Object -ComObject WScript.Shell

# Create shortcut
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $NodePath
$Shortcut.Arguments = "`"$MainPath`""
$Shortcut.WorkingDirectory = $ProjectPath
$Shortcut.IconLocation = Join-Path $ProjectPath "src\assets\tray-icon.png"
$Shortcut.Description = "DevTrack Widget - Track GitHub and LeetCode progress"
$Shortcut.Save()

Write-Host "Desktop shortcut created at: $ShortcutPath"
