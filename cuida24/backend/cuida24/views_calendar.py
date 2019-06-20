from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.cuida24.permissions import *
from .services import *

# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
logger = logging.getLogger("mylogger")

class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer

class EventViewSet(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    """
       Get method by user id 
    """
    def list(self, request, *args, **kwargs):
        logger.info("GET EVENT")
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['users'][0])
        # logger.info(request.data)
        # data = request.data['users']
        is_patient = False
        sent_data = {'appointments': [], 'sessions': []}
        participants = []
        for user in data['caregivers']:
            user = get_object_or_404(Caregiver, pk=user)
            participants.append(user.info)
            serializer_data = getAppointments(user, is_patient)
            sent_data['appointments'].append(getAppointmentBackToFrontJSON(serializer_data))
        for user in data['patients']:
            user = get_object_or_404(Patient, pk=user)
            participants.append(user.info)
            serializer_data = getAppointments(user, is_patient)
            sent_data['appointments'].append(getAppointmentBackToFrontJSON(serializer_data))
        # get session
        serializer_data = getSessions(participants)
        sent_data['sessions'].append(getSessionBackToFrontJSON(serializer_data))
        logger.info(sent_data)
        return Response(sent_data, status=status.HTTP_200_OK)


'''
Appointments Views
'''

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'patient', 'backofficeUser'],
        'POST': ['backofficeUser'],
        'PUT': ['backofficeUser'],
        'DELETE': ['backofficeUser']
    }
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    '''
    Post method
    '''
    def create(self, request, *args, **kwargs):
        logger.info("POST APPOINTMENTS")
        logger.info(request.data)
        req_data = appointmentFrontToBackJSON(request.data)
        serializer = AppointmentSerializer(data=req_data, context={'request': req_data})
        logger.info("DATA SENT TO SERIALIZER")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = appointmentBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method by user id
    """
    def list(self, request, *args, **kwargs):
        logger.info(request.user)
        logger.info(request.method)
        logger.info("GET APPOINTMENT")
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['users'][0])
        is_patient = False
        if data['caregivers']:
            user = get_object_or_404(Caregiver, pk=data['caregivers'][0])
        else:
            user = get_object_or_404(Patient, pk=data['patients'][0])
            is_patient = True
        serializer_data = getAppointments(user, is_patient)
        logger.info("SERIALIZER RETURN DATA")
        logger.info(serializer_data)
        sent_data = getAppointmentBackToFrontJSON(serializer_data)
        logger.info("RETURN DATA")
        logger.info(sent_data)
        return Response(sent_data, status=status.HTTP_200_OK)

    """
    Update method
    """
    def put(self, request):
        logger.info("PUT APPOINTMENT")
        logger.info(request.data)
        req_data = appointmentFrontToBackJSON(request.data)
        appointment = get_object_or_404(Appointment, details=req_data['details']['pk'])
        serializer = AppointmentSerializer(data=req_data, instance=appointment, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = appointmentBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentNoteViewSet(viewsets.ModelViewSet):
    queryset = AppointmentNote.objects.all()
    serializer_class = AppointmentNoteSerializer

    @action(detail=False, methods=['get'])
    def noteCategory(self, request):
        logger.info("GET NOTE CATEGORY")
        choices_value = AppointmentNote.CATEGORY
        enum_values = []
        for choice in choices_value:
            dict = {'value': choice[0], 'title': choice[1]}
            enum_values.append(dict)
        return Response(enum_values)

    """
    Get method by appoinment
    """
    def list(self, request, *args, **kwargs):
        logger.info("GET NOTE APPOINTMENT")
        logger.info(request.user.id)
        logger.info(json.loads(dict(request.GET)['appointment'][0]))
        data = json.loads(dict(request.GET)['appointment'][0])
        appointment = get_object_or_404(Appointment, pk=data)
        queryset = AppointmentNote.objects.filter(appointment=appointment)
        appointment_note_serializer = AppointmentNoteSerializer(queryset, many=True)
        logger.info("SERIALIZER RETURN DATA")
        logger.info(appointment_note_serializer.data)
        return Response(appointment_note_serializer.data, status=status.HTTP_200_OK)

    """
    Update method 
    """
    def put(self, request):
        logger.info("PUT NOTE APPOINTMENT")
        logger.info(request.data)
        data = request.data
        appointment_note = get_object_or_404(AppointmentNote, pk=data['pk'])
        serializer = AppointmentNoteSerializer(data=data, instance=appointment_note, context={'request': data})
        logger.info("DATA SENT")
        logger.info(data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
Session Views
'''


class SessionsViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST SESSION")
        logger.info(request.data)
        req_data = sessionFrontToBackJSON(request.data)
        serializer = SessionSerializer(data=req_data, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = sessionBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
        Update method
    """
    def put(self, request):
        logger.info("PUT SESSION")
        logger.info(request.data)
        req_data = sessionFrontToBackJSON(request.data)
        session = get_object_or_404(Session, pk=req_data['pk'])
        logger.info(session.topic)
        logger.info("DATA SENT")
        logger.info(req_data)
        serializer = SessionSerializer(data=req_data, instance=session, context={'request': req_data})
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = sessionBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
      Get method by session participants
    """
    def list(self, request, *args, **kwargs):
        # logger.info(request.data)
        # data = request.data['users']
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['users'][0])
        sent_data = []
        participants = []
        for user in data['caregivers']:
            user = get_object_or_404(Caregiver, pk=user)
            participants.append(user.info)
        for user in data['patients']:
            user = get_object_or_404(Patient, pk=user)
            participants.append(user.info)
        serializer_data = getSessions(participants)
        sent_data.append(getSessionBackToFrontJSON(serializer_data))
        return Response(sent_data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'])
    def typeSession(self, request):
        logger.info("GET TYPE SESSION")
        choices_value = Session.TYPE
        enum_values = []
        for choice in choices_value:
            enum_values.append(choice[1])
        return Response(enum_values)

    @action(detail=False, methods=['get'])
    def statusSession(self, request):
        logger.info("GET Status session")
        choices_value = Session.STATE
        enum_values = []
        for choice in choices_value:
            enum_values.append(choice[1])
        return Response(enum_values)


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST EVALUATION")
        logger.info(request.data)
        req_data = evaluationFrontToBackJSON(request.data)
        serializer = EvaluationSerializer(data=req_data, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = evaluationBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT EVALUATION")
        logger.info(request.data)
        req_data = evaluationFrontToBackJSON(request.data)
        evaluation = get_object_or_404(Evaluation, pk=req_data['pk'])
        logger.info("DATA SENT")
        logger.info(req_data)
        serializer = EvaluationSerializer(data=req_data, instance=evaluation, context={'request': req_data})
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            sent_data = evaluationBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    """
    Get method by session pk
    """
    def list(self, request, *args, **kwargs):
        # logger.info(request.data)
        # data = request.data['sessionPK']
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['sessionPK'][0])
        queryset = Evaluation.objects.filter(session=data)
        serializer_evaluation = EvaluationSerializer(queryset, many=True)
        sent_data = []
        for evaluation in serializer_evaluation.data:
            sent_data.append(getEvaluationBackToFrontJSON(evaluation))
        return Response(sent_data, status=status.HTTP_200_OK)


'''
Medication Views
'''

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer


class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST PRESCRIPTION")
        logger.info(request.data)
        req_data = prescriptionFrontToBackJSON(request.data, request.user)
        serializer = MedicationSerializer(data=req_data, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            author_user = serializer.data['prescription']['author']
            serializer.data['prescription']['author'] = get_object_or_404(BackofficeUser, info=author_user).pk
            logger.info(serializer.data['prescription']['author'])
            sent_data = prescriptionBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT PRESCRIPTION")
        logger.info(request.data)
        req_data = prescriptionFrontToBackJSON(request.data, request.user)
        medication = get_object_or_404(Medication, pk=req_data['pk'])
        serializer = MedicationSerializer(data=req_data, instance=medication, context={'request': req_data})
        logger.info("DATA SENT")
        logger.info(req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            author_user = serializer.data['prescription']['author']
            serializer.data['prescription']['author'] = get_object_or_404(BackofficeUser, info=author_user).pk
            logger.info(serializer.data['prescription']['author'])
            sent_data = prescriptionBackToFrontJSON(request.data, serializer.data)
            logger.info("RETURN DATA")
            logger.info(sent_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method by user id
    """

    def list(self, request, *args, **kwargs):
        logger.info("GET PRESCRIPTION")
        logger.info(request.GET)
        data = json.loads(dict(request.GET)['users'][0])
        if data['patients'][0]:
            serializer_data = getPrescriptions(data['patients'][0])
            # associar o backoffice user à pk auth
            for medication in serializer_data:
                author_user = medication['prescription']['author']
                medication['prescription']['author'] = get_object_or_404(BackofficeUser, info=author_user).pk
            sent_data = getPrescriptionBackToFrontJSON(serializer_data)
            return Response(sent_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class TakeViewSet(viewsets.ModelViewSet):
    queryset = Take.objects.all()
    serializer_class = TakeSerializer
