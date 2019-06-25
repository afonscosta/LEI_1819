from django.contrib.auth.models import Group
from rest_framework import permissions

import logging
logger = logging.getLogger("mylogger")

class IsBackofficeUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.groups.filter(name='backofficeUser'):
            return True
        return False

class FixPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        logger.info('REQUEST PRINT' + str(request.user) + str(request.user.id))
        logger.info('TYPE OF REQUEST:' + request.method)
        return True

def is_in_group(user, group_name):
    """
    Takes a user and a group name, and returns `True` if the user is in that group.
    """
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None

class HasGroupPermission(permissions.BasePermission):
    """
    Ensure user is in required groups.
    """
    def has_permission(self, request, view):
        # Get a mapping of methods -> required group.
        required_groups_mapping = getattr(view, "required_groups", {})

        # Determine the required groups for this particular request method.
        required_groups = required_groups_mapping.get(request.method, [])

        # Return True if the user has one of the required groups
        return any([is_in_group(request.user, group_name) if group_name != "__all__" else True for group_name in
                    required_groups])
