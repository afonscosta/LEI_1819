from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import viewsets, status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from backend.cuida24.permissions import *
from .services import *

# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
logger = logging.getLogger("mylogger")

class StaticPagesView(generics.ListAPIView):
    permission_classes = (AllowAny,)
    queryset = StaticPages.objects.all()
    serializer_class = StaticPagesSerializer

class AuthenticateUserView(generics.ListAPIView):
    queryset = UserAuth.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        logger.info("Get user authenticated")
        user = get_object_or_404(UserAuth, email=request.user)
        try:
            caregiver = Caregiver.objects.get(info_id=user.pk)
            serializer = CaregiverSerializer(caregiver)
        except Caregiver.DoesNotExist:
            try:
                patient = Patient.objects.get(info_id=user.pk)
                serializer = PatientSerializer(patient)
            except Patient.DoesNotExist:
                try:
                    backoffice = BackofficeUser.objects.get(info_id=user.pk)
                    serializer = BackofficeUserSerializer(backoffice)
                except BackofficeUser.DoesNotExist:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CaregiverViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver','admin', 'patient', 'backofficeUser'],
        'POST': ['admin'],
        'DELETE': ['admin'],
        'PUT': ['admin']
    }
    queryset = Caregiver.objects.all()
    serializer_class = CaregiverSerializer



class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'admin', 'patient', 'backofficeUser'],
        'POST': ['admin'],
        'DELETE': ['admin'],
        'PUT': ['admin']
    }
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class BackofficeUserViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'admin', 'patient', 'backofficeUser'],
        'POST': ['admin'],
        'DELETE': ['admin'],
        'PUT': ['admin']
    }
    queryset = BackofficeUser.objects.all()
    serializer_class = BackofficeUserSerializer
