
from rest_framework.permissions import BasePermission

# {"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjgwMTE0OSwiaWF0IjoxNzMyNzE0NzQ5LCJqdGkiOiJmYWNkN2IzYTA3MGQ0YzI1YTcyYjEyMzhlZjA5NDg3MyIsInVzZXJfaWQiOjd9.4TWfz58leY-groMrmyLQIS_5wjFU5hye0fP9zomBt2s",
# "access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyNzE1MDQ5LCJpYXQiOjE3MzI3MTQ3NDksImp0aSI6ImU3NjQ3OWQzOGFkYjQyZDZiOTI5NDQxMzkzNzlhYzgzIiwidXNlcl9pZCI6N30.MRSW67TteBeEKvx0t9aDEGCyKPEByDxPEgmB_k5efUs"}
class IsDeveloper(BasePermission):
    """
    Allows access only to the developer with a specific username or email.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.username == "hh"
        # Or, based on email:
        # return request.user.is_authenticated and request.user.email == "developer@example.com"
