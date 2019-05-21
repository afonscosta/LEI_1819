from rest_framework import permissions


class IsBackofficeUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.groups.filter(name='backofficeUser'):
            return True
        return False
