from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.cuida24.permissions import *
from .services import *
from .services_habits import *

# Serve Vue Application
index_view = never_cache(TemplateView.as_view(template_name='index.html'))
logger = logging.getLogger("mylogger")


class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'backofficeUserWithoutRespMedication'],
        'POST': ['backofficeUserWithoutRespMedication'],
        'DELETE': ['backofficeUserWithoutRespMedication'],
        'PUT': ['backofficeUserWithoutRespMedication']
    }
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def destroy(self, request, *args, **kwargs):
        logger.info("DELETE GOAL")
        goal = get_object_or_404(Goal, pk=self.kwargs['pk'])
        serializer_goal = GoalSerializer(goal)
        req_data = copy.deepcopy(serializer_goal.data)
        req_data['disable'] = True
        logger.info(req_data)
        serializer = GoalSerializer(instance=goal, data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET GOALS CAREGIVER BY PK")
        logger.info(self.kwargs['pk'])
        return_data = getGoals(self.kwargs['pk'])
        return Response(return_data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'])
    def typeGoal(self, request):
        logger.info("GET TYPE GOAL")
        choices_value = Goal.TYPE
        enum_values = []
        for choice in choices_value:
            dict = {'value': choice[0], 'title': choice[1]}
            enum_values.append(dict)
        return Response(enum_values)

    def list(self, request, *args, **kwargs):
        logger.info("Get BACKOFFICE GOALS")
        goals = Goal.objects.filter(disable=False)
        serializer_goal = GoalSerializer(goals, many=True)
        return Response(serializer_goal.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def list_goals_caregiver(self, request):
        logger.info("GET GOALS CAREGIVER BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        logger.info(caregiver)
        return_data = getGoals(caregiver)

        return Response(return_data, status=status.HTTP_200_OK)


class PhysicalActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'backofficeUserWithoutRespMedication'],
        'POST': ['backofficeUserWithoutRespMedication'],
        'DELETE': ['backofficeUserWithoutRespMedication'],
        'PUT': ['backofficeUserWithoutRespMedication']
    }
    queryset = PhysicalActivity.objects.all()
    serializer_class = PhysicalActivitySerializer


class SocialLeisureViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'backofficeUserWithoutRespMedication'],
        'POST': ['backofficeUserWithoutRespMedication'],
        'DELETE': ['backofficeUserWithoutRespMedication'],
        'PUT': ['backofficeUserWithoutRespMedication']
    }
    queryset = SocialLeisure.objects.all()
    serializer_class = SocialLeisureSerializer


class IndividualLeisureViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'backofficeUserWithoutRespMedication'],
        'POST': ['backofficeUserWithoutRespMedication'],
        'DELETE': ['backofficeUserWithoutRespMedication'],
        'PUT': ['backofficeUserWithoutRespMedication']
    }
    queryset = IndividualLeisure.objects.all()
    serializer_class = IndividualLeisureSerializer


class WaterViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = Water.objects.all()
    serializer_class = WaterSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST WATER")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        logger.info(req_data)
        query_set = Water.objects.filter(caregiver_id=req_data['caregiver'], date=req_data['date'])
        if query_set:
            water = get_object_or_404(Water, caregiver_id=req_data['caregiver'], date=req_data['date'])
            req_data['water'] = int(req_data['water']) + water.quantity
            logger.info(req_data)
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
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
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
        logger.info("GET WATER BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Water.objects.filter(caregiver_id=caregiver)
        serializer = WaterSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET WATER BY PK")
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = Water.objects.filter(caregiver_id=caregiver)
        serializer = WaterSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SleepViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = Sleep.objects.all()
    serializer_class = SleepSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST SLEEP")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        query_set = Sleep.objects.filter(caregiver_id=req_data['caregiver'], date=req_data['date'])
        if query_set:
            sleep = get_object_or_404(Sleep, caregiver_id=req_data['caregiver'], date=req_data['date'])
            serializer = SleepSerializer(instance=sleep, data=req_data)
        else:
            serializer = SleepSerializer(data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT SLEEP")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        sleep = get_object_or_404(Sleep, pk=req_data['pk'])
        serializer = SleepSerializer(instance=sleep, data=req_data)
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
        logger.info("GET SLEEP BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Sleep.objects.filter(caregiver_id=caregiver)
        serializer = SleepSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET SLEEP BY PK")
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = Sleep.objects.filter(caregiver_id=caregiver)
        serializer = SleepSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NapViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = Nap.objects.all()
    serializer_class = NapSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST NAP")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        logger.info(req_data)
        query_set = Nap.objects.filter(caregiver_id=req_data['caregiver'], date=req_data['date'])
        if query_set:
            nap = get_object_or_404(Nap, caregiver_id=req_data['caregiver'], date=req_data['date'])
            req_data['naps'] = int(req_data['naps']) + nap.quantity
            logger.info(req_data)
            serializer = NapSerializer(instance=nap, data=req_data)
        else:
            serializer = NapSerializer(data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT NAP")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        nap = get_object_or_404(Nap, pk=req_data['pk'])
        serializer = NapSerializer(instance=nap, data=req_data)
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
        logger.info("GET NAP BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Nap.objects.filter(caregiver_id=caregiver)
        serializer = NapSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET NAP BY PK")
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = Nap.objects.filter(caregiver_id=caregiver)
        serializer = NapSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SOSViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = SOS.objects.all()
    serializer_class = SOSSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST SOS")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = SOSFrontToBackJSON(request_data, request.user)
        logger.info(req_data)
        query_set = SOS.objects.filter(caregiver=req_data['caregiver'], date=req_data['date'],
                                       patient=req_data['patient'])
        if query_set:
            sos = get_object_or_404(SOS, caregiver=req_data['caregiver'], date=req_data['date'],
                                    patient=req_data['patient'])
            req_data['sos'] = int(req_data['sos']) + sos.quantity
            logger.info(req_data)
            serializer = SOSSerializer(instance=sos, data=req_data)
        else:
            serializer = SOSSerializer(data=req_data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            logger.info("SERIALIZER RETURN DATA")
            logger.info(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.info(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        logger.info("PUT SOS")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = SOSFrontToBackJSON(request_data, request.user)
        sos = get_object_or_404(SOS, pk=req_data['pk'])
        serializer = SOSSerializer(instance=sos, data=req_data)
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
        logger.info("GET SOS BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = SOS.objects.filter(caregiver_id=caregiver)
        serializer = SOSSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET SOS BY PK")
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = SOS.objects.filter(caregiver_id=caregiver)
        serializer = SOSSerializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    @action(detail=False, methods=['get'])
    def duration(self, request):
        logger.info("GET DURATION")
        choices_value = Activity.DURATION
        enum_values = []
        for choice in choices_value:
            dict = {'value': choice[0], 'title': choice[1]}
            enum_values.append(dict)
        return Response(enum_values)

    def create(self, request, *args, **kwargs):
        logger.info("POST ACTIVITY")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        logger.info(req_data)
        serializer = ActivitySerializer(data=req_data)
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
        logger.info("GET ACTIVITY BY TOKEN")
        request_type = dict(request.GET)['type'][0]
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Activity.objects.filter(caregiver_id=caregiver, type=request_type)
        serializer = ActivitySerializer(query_set, many=True)
        for activity in serializer.data:
            type = activity['type']
            if type == 'LI':
                act = IndividualLeisure.objects.get(pk=activity['act']).description
                activity['act'] = act
            elif type == 'LS':
                act = SocialLeisure.objects.get(pk=activity['act']).description
                activity['act'] = act
            elif type == 'AF':
                act = PhysicalActivity.objects.get(pk=activity['act']).description
                activity['act'] = act
            else:
                Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info('GET ACTIVITY BY PK')
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = Activity.objects.filter(caregiver_id=caregiver)
        serializer = ActivitySerializer(query_set, many=True)
        for activity in serializer.data:
            type = activity['type']
            if type == 'LI':
                act = IndividualLeisure.objects.get(pk=activity['act']).description
                activity['act'] = act
            elif type == 'LS':
                act = SocialLeisure.objects.get(pk=activity['act']).description
                activity['act'] = act
            elif type == 'AF':
                act = PhysicalActivity.objects.get(pk=activity['act']).description
                activity['act'] = act
            else:
                Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MealViewSet(viewsets.ModelViewSet):
    permission_classes = (HasGroupPermission,)
    required_groups = {
        'GET': ['caregiver', 'coordinator'],
        'POST': ['caregiver'],
        'DELETE': [],
        'PUT': ['caregiver']
    }
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

    def create(self, request, *args, **kwargs):
        logger.info("POST MEAL")
        request_data = json.loads(request.body.decode())
        logger.info(request_data)
        req_data = habitsFrontToBackJSON(request_data, request.user)
        logger.info(req_data)
        serializer = MealSerializer(data=req_data, context={'request': req_data})
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
        logger.info("GET MEAL BY TOKEN")
        caregiver = get_object_or_404(Caregiver, info=request.user.pk).pk
        query_set = Meal.objects.filter(caregiver_id=caregiver)
        serializer = MealSerializer(query_set, many=True)
        food = []
        for meal in serializer.data:
            logger.info(meal)
            query_set2 = Constitution.objects.filter(meal=meal['pk']).values('food')
            for const in query_set2:
                food.append(const['food'])
            meal['food'] = food
            logger.info(food)
            food = []
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        logger.info("GET MEAL BY PK")
        caregiver = get_object_or_404(Caregiver, pk=self.kwargs['pk']).pk
        query_set = Meal.objects.filter(caregiver_id=caregiver)
        serializer = MealSerializer(query_set, many=True)
        food = []
        for meal in serializer.data:
            logger.info(meal)
            query_set2 = Constitution.objects.filter(meal=meal['pk']).values('food')
            for const in query_set2:
                food.append(const['food'])
            meal['food'] = food
            logger.info(food)
            food = []
        logger.info(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def constitution(self, request):
        logger.info("GET CONSTITUTION")
        choices_value = Constitution.TYPE
        enum_values = []
        for choice in choices_value:
            dict = {'value': choice[0], 'title': choice[1]}
            enum_values.append(dict)
        return Response(enum_values)
