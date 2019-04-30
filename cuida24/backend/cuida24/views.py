from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions

from .models import Message, MessageSerializer
from .models import DefAtividade, DefAtividadeSerializer
from .models import Event, EventSerializer
from .models import Calendar, CalendarSerializer
from .models import Cuidador, CuidadorSerializer
from .models import Utente, UtenteSerializer
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


class FixAnAppointmentPermssion(permissions.BasePermission):
  def has_permission(self, request, view):
    logger.info('REQUEST PRINT' + request.user.username + str(request.user.id))
    return True

class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    """
    Post method
    """

    @permission_classes((FixAnAppointmentPermssion,))
    def create(self, request, *args, **kwargs):
        logger.info(request.data)
        event = request.data['event']
        users = request.data['users'] # Fazer a ligação entre os users e o event!
        logger.info(users)
        try:
            event['data']['calendar'] = 'http://127.0.0.1:8000/cuida24/calendars/' + \
                                       str(Calendar.objects.get(color=event['data']['color']).id) + '/'
        except Calendar.DoesNotExist:
            logger.info('Calendario selecionado não existe!!')
            return Response(event, status=status.HTTP_400_BAD_REQUEST)
        event['data']['visible'] = event['visible']
        serializer = EventSerializer(data=event['data'], context={'request': request})
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


class CaregiverViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Cuidador.objects.all()
    serializer_class = CuidadorSerializer


class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows messages to be viewed or edited.
    """
    queryset = Utente.objects.all()
    serializer_class = UtenteSerializer
