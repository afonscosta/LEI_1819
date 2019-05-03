from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions

from .models import Message, MessageSerializer
from .models import DefActivity, DefActivitySerializer
from .models import Event, EventSerializer
from .models import Calendar, CalendarSerializer
from .models import Caregiver, CaregiverSerializer
from .models import Patient, PatientSerializer
from .models import Appointment, AppointmentSerializer
from .models import AppointmentNote, AppointmentNoteSerializer
from .models import Notification, NotificationSerializer
from .models import BackofficeUser, BackofficeUserSerializer
from .services import *
import logging
import json


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


class FixAnAppointmentPermssion(permissions.BasePermission):
  def has_permission(self, request, view):
    logger.info('REQUEST PRINT' + request.user.username + str(request.user.id))
    return True

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    """
    Post method

    def create(self, request, *args, **kwargs):
        logger.info("POST")
        logger.info(request.data)
        req_data = EventFrontToBackJSON(request.data)
        serializer = EventSerializer(data=req_data['event'], context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = EventBackTofrontJSON(request.data, serializer.data)
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    Get method
    def list(self, request, *args, **kwargs):
        logger.info("GET")
        events = Event.objects.all()
        logger.info(events)
        serializer = EventSerializer(events, many=True, context={'request': request})
        logger.info("JSON DEVOLVIDO:")
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    """


class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer


class CaregiverViewSet(viewsets.ModelViewSet):
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer



class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class BackofficeUserViewSet(viewsets.ModelViewSet):
    queryset = BackofficeUser.objects.all()
    serializer_class = BackofficeUserSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    '''
    Post method
    '''

    @permission_classes((FixAnAppointmentPermssion,))
    def create(self, request, *args, **kwargs):
        logger.info("POST")
        logger.info(request.data)
        req_data = appointmentFrontToBackJSON(request.data)
        serializer = AppointmentSerializer(data=req_data, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = eventBackToFrontJSON(request.data, serializer.data)
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method 
    """
    def list(self, request, *args, **kwargs):
        logger.info("GET")
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['users'][0])
        is_patient = False
        logger.info(data)
        if data['caregivers']:
            user = get_object_or_404(Caregiver, pk=data['caregivers'][0])
        else:
            user = get_object_or_404(Patient, pk=data['patients'][0])
            is_patient = True
        queryset = Appointment.objects.filter(user=user.info)
        serializer_appointment = AppointmentSerializer(queryset, many=True)
        for appointment in serializer_appointment.data:
            queryset2 = Notification.objects.filter(event=appointment['details']['pk']).values('dateTime')
            serializer_notification = NotificationSerializer(queryset2, many=True)
            appointment['details']['notification'] = serializer_notification.data
            if is_patient:
                appointment['patientPK'] = user.pk
            else:
                appointment['caregiverPK'] = user.pk
        logger.info(serializer_appointment.data)
        sent_data = appointmentBackToFrontJSON(serializer_appointment.data)
        return Response(sent_data, status=status.HTTP_200_OK)

    """
    Update method
    """
    def put(self, request):
        logger.info("PUT")
        logger.info(request.data)
        req_data = appointmentFrontToBackJSON(request.data)
        appointment = get_object_or_404(Appointment, pk=req_data['details']['pk'])
        serializer = AppointmentSerializer(data=req_data, instance=appointment, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = eventBackToFrontJSON(request.data, serializer.data)
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentNoteViewSet(viewsets.ModelViewSet):
    queryset = AppointmentNote.objects.all()
    serializer_class = AppointmentNoteSerializer



