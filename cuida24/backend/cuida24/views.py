from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import viewsets, status

from backend.settings.dev import LOGGING
from .models import Message, MessageSerializer
from .models import DefAtividade, DefAtividadeSerializer
from .models import Event, EventSerializer
from .models import Calendar, CalendarSerializer
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


class DefAtividadeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = DefAtividade.objects.all()
    serializer_class = DefAtividadeSerializer


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
        logger.info(request.data)
        data = request.data
        try:
            data['data']['calendar'] = 'http://127.0.0.1:8000/cuida24/calendars/' + \
                                       str(Calendar.objects.get(color=data['data']['color']).id) + '/'
        except Calendar.DoesNotExist:
            logger.info('Calendario selecionado não existe!!')
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        data['data']['visible'] = data['visible']
        serializer = EventSerializer(data=data['data'], context={'request': request})
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method
    """
    def list(self, request, *args, **kwargs):
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
