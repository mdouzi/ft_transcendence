from rest_framework import serializers
from .models import *

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender', 'recipient', 'body', 'date', 'is_read']

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = ['friend_name']