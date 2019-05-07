"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .cuida24.views import index_view, MessageViewSet, DefActivityViewSet, EventViewSet, CalendarViewSet, \
  CaregiverViewSet, PatientViewSet, AppointmentViewSet, AppointmentNoteViewSet, BackofficeUserViewSet, \
  SessionsViewSet

router = routers.DefaultRouter()
router.register('messages', MessageViewSet)
router.register('defatividades', DefActivityViewSet)
router.register('events', EventViewSet)
router.register('calendars', CalendarViewSet)
router.register('caregivers', CaregiverViewSet)
router.register('patients', PatientViewSet)
router.register('appointments', AppointmentViewSet)
router.register('appointmentNotes', AppointmentNoteViewSet)
router.register('backoffice_user', BackofficeUserViewSet)
router.register('groupSessions', SessionsViewSet)

noteCategory = AppointmentNoteViewSet.as_view({'get': 'noteCategory'})
urlpatterns = [

    # http://localhost:8000/
    path('', index_view, name='index'),

    # http://localhost:8000/cuida24/<router-viewsets>
    path('cuida24/', include(router.urls)),

    # http://localhost:8000/cuida24/admin/
    path('cuida24/admin/', admin.site.urls),

    # extra action on appointmentNotes
    path('cuida24/appointmentNotes/', noteCategory),

    # foi necessário criar um superuser para conseguir pedir o token (python manage.py createsuperuser)

    # to get the JWT token for the first time
    path('cuida24/token/', TokenObtainPairView.as_view()),

    # to refresh the JWT token
    path('cuida24/token/refresh/', TokenRefreshView.as_view())
]

