@echo off
REM Activate virtual environment (adjust path if needed)
call & "C:/Users/yu123/OneDrive/سطح المكتب/ProjectGalaxy/ConcourMaroc/venv/Scripts/Activate.ps1"

REM Change to backend directory
cd backend

REM Run Django development server
python manage.py runserver

