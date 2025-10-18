# QR Code Free Generator

## Features
- Single-page HTML app; no build tools or external dependencies required.
- Generate QR codes for URLs, plain text, or email actions.
- Live preview with configurable size, margin, and foreground/background colors.
- Download the rendered QR code instantly as a PNG file.

## Usage
- Open `index.html` in a modern desktop or mobile browser.
- Choose the content type, fill in the form, and adjust the appearance options as needed.
- The preview updates automatically; use the **Tạo mã QR** button if you prefer manual refresh.
- Click **Tải về PNG** to save the current QR code image.

## Recent Fix
- Resolved the `bad rs block @ typeNumber:1/errorCorrectionLevel:0` error by normalizing how error-correction levels are handled when building QR matrices.
