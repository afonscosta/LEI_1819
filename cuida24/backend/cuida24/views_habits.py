from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import status, generics, viewsets
from rest_framework.response import Response

from backend.cuida24.permissions import *
from .services import *
from .services_habits import *

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
    '''
    Get physical activities, it's not important return goal associate
    '''
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

    '''
        Get physical activities, it's not important return goal associate
    '''
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

    '''
        Get physical activities, it's not important return goal associate
    '''
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = SocialLeisureSerializer(queryset, fields=("description", "pk"), many=True)
        return Response(serializer.data)



class WaterViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'patient', 'backofficeUser'],
        'POST': ['caregiver', 'backofficeUser'],
        'DELETE': ['caregiver', 'backofficeUser'],
        'PUT': ['caregiver', 'backofficeUser']
    }
    queryset = Water.objects.all()
    serializer_class = WaterSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST WATER")
        logger.info(request)
        req_data = waterFrontToBackJSON(request.data, request.user)
        query_set = Water.objects.filter(caregiver_id=req_data['caregiver'], date=req_data['date'])
        if query_set:
            water = get_object_or_404(Water, caregiver_id=req_data['caregiver'], date=req_data['date'])
            req_data['water'] = int(req_data['water']) + water.quantity
            serializer = WaterSerializer(instance=water, data=req_data)
        else:
            serializer = WaterSerializer(data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT WATER")
        logger.info(request.data)
        req_data = waterFrontToBackJSON(request.data, request.user)
        water = get_object_or_404(Water, pk=req_data['pk'])
        serializer = WaterSerializer(instance=water, data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    """
    Get method by user id
    """

    def list(self, request, *args, **kwargs):
        logger.info("GET WATER")
        logger.info(request.GET)
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Water.objects.filter(caregiver_id=caregiver)
        serializer = WaterSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
