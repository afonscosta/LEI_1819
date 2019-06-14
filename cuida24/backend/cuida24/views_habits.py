from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import status, generics, viewsets
from rest_framework.response import Response

from backend.cuida24.permissions import *
from .services import *

# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
logger = logging.getLogger("mylogger")

class PhysicalActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'patient', 'backofficeUser'],
        'POST': ['backofficeUser'],
        'DELETE': ['backofficeUser'],
        'PUT': ['backofficeUser']
    }
    queryset = PhysicalActivity.objects.all()
    serializer_class = PhysicalActivitySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = PhysicalActivitySerializer(queryset, fields=("description", "pk"), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SocialLeisureViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'patient', 'backofficeUser'],
        'POST': ['backofficeUser'],
        'DELETE': ['backofficeUser'],
        'PUT': ['backofficeUser']
    }
    queryset = SocialLeisure.objects.all()
    serializer_class = SocialLeisureSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = SocialLeisureSerializer(queryset, fields=("description", "pk"), many=True)
        return Response(serializer.data)

class IndividualLeisureViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'patient', 'backofficeUser'],
        'POST': ['backofficeUser'],
        'DELETE': ['backofficeUser'],
        'PUT': ['backofficeUser']
    }
    queryset = IndividualLeisure.objects.all()
    serializer_class = IndividualLeisureSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = SocialLeisureSerializer(queryset, fields=("description", "pk"), many=True)
        return Response(serializer.data)
