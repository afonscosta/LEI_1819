from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import viewsets, status

from backend.settings.dev import LOGGING
from .models import Message, MessageSerializer
from .models import DefActivity, DefActivitySerializer
from .models import Event, EventSerializer
from .models import Calendar, CalendarSerializer
from .models import Caregiver, CaregiverSerializer
from .models import Patient, PatientSerializer
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
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = DefActivity.objects.all()
    serializer_class = DefActivitySerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
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
        '''
        try:
            event['data']['calendar'] = Calendar.objects.get(color=event['data']['color']).id
        except Calendar.DoesNotExist:
            logger.info('Calendario selecionado não existe!!')
            return Response(event, status=status.HTTP_400_BAD_REQUEST)
        '''
        event['data']['visible'] = event['visible']
        serializer = EventSerializer(data=event['data'], context={'request': request.data})
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
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer


class CaregiverViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
