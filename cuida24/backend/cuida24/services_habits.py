import copy
import logging
import json

from django.shortcuts import get_object_or_404

from backend.cuida24.models import *
from backend.cuida24.serializers import *

logger = logging.getLogger("mylogger")

def waterFrontToBackJSON(request_data, user):
    request_data['caregiver'] = get_object_or_404(Caregiver, info=user.pk).pk
    return request_data
