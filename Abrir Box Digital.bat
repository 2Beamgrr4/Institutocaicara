@echo off
setlocal
cd /d "%~dp0"

set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE="
if not defined NODE_EXE (
  for /f "delims=" %%N in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%N"
)
if not defined NODE_EXE (
  echo Node.js nao foi encontrado. Instale a versao LTS em https://nodejs.org/ e abra este arquivo novamente.
  pause
  exit /b 1
)

set "VITE_CLI=%~dp0node_modules\.pnpm\vite@8.3.8\node_modules\vite\bin\vite.js"
if not exist "%VITE_CLI%" set "VITE_CLI=%~dp0node_modules\vite\bin\vite.js"
if not exist "%VITE_CLI%" (
  echo As dependencias ainda nao foram instaladas.
  echo Abra o PowerShell nesta pasta e execute: npm install
  pause
  exit /b 1
)

echo Iniciando o Box Digital. O navegador abrira quando o servidor estiver pronto.
echo Mantenha esta janela aberta enquanto estiver usando o prototipo.
"%NODE_EXE%" "%VITE_CLI%" --host 0.0.0.0 --port 5176 --open

echo.
echo O servidor foi encerrado.
pause
