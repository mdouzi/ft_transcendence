from prometheus_client import generate_latest, REGISTRY
from django.views import View
from django.http import HttpResponse
from django.http import JsonResponse
from .models import *
from .serializer import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

def render_chat(request):
    return render(request, 'index.html')

@api_view(['GET'])
def friend_messages(request, friend_id):
    messages = Message.objects.filter(sender_id=friend_id)
    messages = messages.order_by('date')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def friends_list(request):
        friends = Friends.objects.all()
        serializer = FriendsSerializer(friends, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
def msg_list(request):

    if request.method == 'GET':
        msgs = Message.objects.all()
        serializer = MessageSerializer(msgs, many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def msg_details(request, recipient):
    try:
        msg = Message.objects.get(pk=recipient)
    except Message.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MessageSerializer(msg)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        msg.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





class MetricsView(View):
    def get(self, request, *args, **kwargs):
        # Generate the latest metrics and return as a response
        return HttpResponse(generate_latest(REGISTRY), content_type="text/plain")
