@echo off
call myenv\Scripts\activate.bat
cd backend
python manage.py runserver
pause