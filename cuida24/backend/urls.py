"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from .cuida24.views import *
from .cuida24.views_habits import *
from .cuida24.views_calendar import *

router = routers.DefaultRouter()
router.register('calendars', CalendarViewSet)
router.register('caregivers', CaregiverViewSet)
router.register('patients', PatientViewSet)
router.register('appointments', AppointmentViewSet)
router.register('appointmentNotes', AppointmentNoteViewSet)
router.register('backoffice_user', BackofficeUserViewSet)
router.register('sessions', SessionsViewSet)
router.register('evaluation', EvaluationViewSet)
router.register('medicine', MedicineViewSet)
router.register('prescriptions', MedicationViewSet)
router.register('physicalActivity', PhysicalActivityViewSet),
router.register('socialLeisure', SocialLeisureViewSet),
router.register('individualLeisure', IndividualLeisureViewSet)

noteCategory = AppointmentNoteViewSet.as_view({'get': 'noteCategory'})

urlpatterns = [

    # http://localhost:8000/
    path('', index_view, name='index'),

    # http://localhost:8000/cuida24/<router-viewsets>
    path('cuida24/', include(router.urls)),

    # StaticPages is only a read request
    path('cuida24/staticPages/', StaticPagesView.as_view()),

    # Autenticate user is only read request
    path('cuida24/authenticateUser/', AuthenticateUserView.as_view()),

    path('cuida24/events/', EventViewSet.as_view()),

    # http://localhost:8000/cuida24/admin/
    path('cuida24/admin/', admin.site.urls),

    # extra action on appointmentNotes
    path('cuida24/appointmentNotes/', noteCategory),

    # foi necessário criar um superuser para conseguir pedir o token (python manage.py createsuperuser)

    path('cuida24/token/', obtain_auth_token, name='token')
]

