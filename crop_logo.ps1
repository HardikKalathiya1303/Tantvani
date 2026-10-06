Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\Abhishek\.gemini\antigravity-ide\brain\0785c699-ecc9-47a5-915f-d7e6311943a6\.user_uploaded\media_1791281599078.png"
$outputPath = "d:\Tantvani\frontend\public\logo.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $isWhite = ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) -or ($c.A -lt 10)
        if (-not $isWhite) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Found bounding box: X = $minX to $maxX, Y = $minY to $maxY"

$pad = 10
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($bmp.Width - 1, $maxX + $pad)
$maxY = [Math]::Min($bmp.Height - 1, $maxY + $pad)

$width = $maxX - $minX + 1
$height = $maxY - $minY + 1

Write-Host "Cropped dimensions: Width = $width, Height = $height"

$cropped = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($cropped)
$srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $width, $height
$destRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height

$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Dispose()

$cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Write-Host "Successfully cropped logo!"
