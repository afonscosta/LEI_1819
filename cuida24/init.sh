#! /bin/bash

psql -U postgres -f updatedb.sql
rm backend/cuida24/migrations/0002*
python manage.py makemigrations
python manage.py migrate
#python manage.py initdata
python manage.py loaddata initial_data.json initial_data_users.json 
#python manage.py createsuperuser
