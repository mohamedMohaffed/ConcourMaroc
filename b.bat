@echo off
REM Activate virtual environment (adjust path if needed)
call myvenv\Scripts\activate

REM Change to backend directory
cd backend

REM Run Django development server
python manage.py runserver
