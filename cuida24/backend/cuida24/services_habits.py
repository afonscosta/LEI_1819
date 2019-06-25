import copy
import logging
import json
from django.utils import timezone

from django.shortcuts import get_object_or_404

from backend.cuida24.models import *
from backend.cuida24.serializers import *

logger = logging.getLogger("mylogger")

def habitsFrontToBackJSON(request_data, user):
    request_data['caregiver'] = get_object_or_404(Caregiver, info=user.pk).pk
    return request_data

def SOSFrontToBackJSON(request_data, user):
    request_data['caregiver'] = get_object_or_404(Caregiver, info=user.pk).pk
    request_data['patient'] = get_object_or_404(Patient, caregiver=request_data['caregiver']).pk
    return request_data

def getGoals(caregiver):
    date_now = timezone.now()
    goals = Goal.objects.filter(disable=False)
    choices_value = dict(Goal.TYPE)
    return_data = {}
    for goal in goals:
        dateB = goal.dateBegin
        dateE = goal.dateEnd
        logger.info(goal.dateBegin)
        logger.info(date_now)
        logger.info(goal.dateEnd)
        if dateB <= date_now <= dateE:
            realized = 0
            if goal.type == 'AF' or goal.type == 'LS' or goal.type == 'LI':
                realized = Activity.objects.filter(type=goal.type, caregiver=caregiver,
                                                   date__range=(dateB, dateE)).count()

            if goal.type == 'WT':
                realized = Water.objects.filter(caregiver=caregiver,
                                                date__range=(dateB, dateE)).count()
            if goal.type == 'NP':
                realized = Nap.objects.filter(caregiver=caregiver,
                                              date__range=(dateB, dateE)).count()
            if goal.type == 'SP':
                realized = Sleep.objects.filter(caregiver=caregiver,
                                                date__range=(dateB, dateE)).count()
            if goal.type == 'SS':
                realized = SOS.objects.filter(caregiver=caregiver,
                                              date__range=(dateB, dateE)).count()
            if goal.type == 'PA' or goal.type == 'LM' or goal.type == 'AL' or goal.type == 'LT' or goal.type == 'JT':
                realized = Meal.objects.filter(type=goal.type, caregiver=caregiver,
                                               date__range=(dateB, dateE)).count()
            if goal.type == 'CB' or goal.type == 'FT' or goal.type == 'VG' or goal.type == 'FB' or goal.type == 'PC' or goal.type == 'RF' or goal.type == 'AL':
                realized = Meal.objects.filter(food=goal.type, caregiver=caregiver,
                                               date__range=(dateB, dateE)).count()
            return_data[str(goal.type)] = {'type': choices_value[goal.type], 'realized': realized, 'goal': goal.goal}
    return return_data
