@echo off
echo ========================================
echo PickMyDesk Research Paper PDF Converter
echo ========================================
echo.

echo Available conversion methods:
echo 1. Open HTML file in browser (then Print to PDF)
echo 2. Instructions for LaTeX to PDF conversion
echo 3. Instructions for online conversion tools
echo.

set /p choice="Choose an option (1-3): "

if "%choice%"=="1" (
    echo.
    echo Opening HTML file in your default browser...
    echo Once opened, press Ctrl+P and select "Save as PDF"
    start "" "PickMyDesk_Research_Paper.html"
    echo.
    echo Instructions:
    echo 1. The HTML file should open in your browser
    echo 2. Press Ctrl+P to print
    echo 3. Select "Save as PDF" or "Microsoft Print to PDF"
    echo 4. Choose location and save as "PickMyDesk_Research_Paper.pdf"
    echo.
    pause
) else if "%choice%"=="2" (
    echo.
    echo LaTeX to PDF Conversion Instructions:
    echo =====================================
    echo.
    echo 1. Install MiKTeX or TeX Live:
    echo    - Download from: https://miktex.org/ or https://www.tug.org/texlive/
    echo.
    echo 2. Open Command Prompt in this folder and run:
    echo    pdflatex PickMyDesk_Research_Paper.tex
    echo.
    echo 3. Run it twice to generate proper references:
    echo    pdflatex PickMyDesk_Research_Paper.tex
    echo    pdflatex PickMyDesk_Research_Paper.tex
    echo.
    echo This will create: PickMyDesk_Research_Paper.pdf
    echo.
    pause
) else if "%choice%"=="3" (
    echo.
    echo Online Conversion Tools:
    echo =======================
    echo.
    echo Option A - HTML to PDF:
    echo 1. Go to: https://www.ilovepdf.com/html-to-pdf
    echo 2. Upload: PickMyDesk_Research_Paper.html
    echo 3. Convert and download PDF
    echo.
    echo Option B - Markdown to PDF:
    echo 1. Go to: https://www.markdowntopdf.com/
    echo 2. Upload: PickMyDesk_Research_Paper.md
    echo 3. Convert and download PDF
    echo.
    echo Option C - LaTeX Online:
    echo 1. Go to: https://www.overleaf.com/
    echo 2. Create new project
    echo 3. Copy content from PickMyDesk_Research_Paper.tex
    echo 4. Compile and download PDF
    echo.
    pause
) else (
    echo Invalid choice. Please run the script again.
    pause
)

echo.
echo Conversion complete! Your PDF should be ready.
echo.
pause
