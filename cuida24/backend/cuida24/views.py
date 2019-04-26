from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import viewsets, status

from .models import Message, MessageSerializer
from .models import DefActivity, DefActivitySerializer
from .models import Event, EventSerializer
from .models import Calendar, CalendarSerializer
from .models import Caregiver, CaregiverSerializer
from .models import Patient, PatientSerializer
from .models import Appointment, AppointmentSerializer
from .services import  *
import logging


# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
logger = logging.getLogger("mylogger")


class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class DefActivityViewSet(viewsets.ModelViewSet):
    queryset = DefActivity.objects.all()
    serializer_class = DefActivitySerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    """
    Post method
    """
    def create(self, request, *args, **kwargs):
        logger.info("POST")
        logger.info(request.data)
        event = request.data['event']
        logger.info("EVENT")
        logger.info(event)
        req_data = EventFrontToBackJSON(request.data)
        serializer = EventSerializer(data=req_data['event'], context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(event['data'])
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method
    """
    def list(self, request, *args, **kwargs):
        logger.info("GET")
        events = Event.objects.all()
        logger.info(events)
        serializer = EventSerializer(events, many=True, context={'request': request})
        logger.info("JSON DEVOLVIDO:")
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer


class CaregiverViewSet(viewsets.ModelViewSet):
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
