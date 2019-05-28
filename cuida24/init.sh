#! /bin/bash

psql -U postgres -f updatedb.sql
rm backend/cuida24/migrations/0002*
python manage.py makemigrations
python manage.py migrate
python manage.py initdata
#python manage.py loaddata fixtures/init_data.json
#python manage.py createsuperuser
