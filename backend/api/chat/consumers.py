import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import date, datetime

User = get_user_model()


class DirectMessageConsumer(AsyncWebsocketConsumer):

    triger = True
    async def connect(self):
        # await self.accept()
        # token = self.scope.get('query_string', b'')
        # user = self.scope['user']
        # session = self.scope["room_name"]
        # print(session)

        # await receive()
        # user = JWTAuthentication.authenticate(self.scope, token)
        # print(user)
        # self.user = await self.get_user(user)
        # print(self.user.is_authenticated)
        # if user.is_authenticated:
        await self.accept()
        # else:
        #     self.disconnect()
        # await self.channel_layer.group_add(f"user_{self.user.username}", self.channel_name)

    # async def disconnect(self, close_code):
        # await self.channel_layer.group_discard(f"user_{self.user.username}", self.channel_name)

    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        # await self.channel_layer.group_add(f"user_{text_data_json.get('sender')}", self.channel_name)

        # print("///////////////  ///////////////")w
        if message_type == 'chat':
            await self.handle_chat_message(text_data_json)
        elif message_type == 'fetch_messages':
            await self.handle_fetch_messages(text_data_json)
        elif  message_type == 'notif':
            recipient = text_data_json.get('recipient')
            await self.channel_layer.group_send(
                f"user_{recipient}",
                {
                    'type': 'notif',
                    'message': await self.get_notif_nbr(),
                }
            )
            
        # await self.channel_layer.group_discard(f"user_{text_data_json.get('sender')}", self.channel_name)

        
    def get_notif_nbr():
        print("wdw")
    
    async def handle_chat_message(self, data):
        body = data.get('body')
        recipient = data.get('recipient')
        sender = data.get('sender')
        # print(body + "   " + recipient + "    " + sender)
        if body and recipient:
            await self.save_message(sender, recipient, body)
            
            await self.channel_layer.group_send(
                f"user_{recipient}",
                {
                    'type': 'chat_message',
                    'message': body,
                    'sender__username': sender,
                    'recipient__username': recipient
                }
            )
            
            await self.channel_layer.group_send(
                f"user_{sender}",
                {
                    'type': 'chat_message',
                    'message': body,
                    'sender__username': sender,
                    'recipient__username': recipient
                }
            )
        else:
            print("Invalid chat message format")

    async def handle_fetch_messages(self, data):
        otheruser = data.get('other_user')
        sender = data.get('sender')
        await self.channel_layer.group_discard(f"user_{sender}", self.channel_name)
        await self.channel_layer.group_add(f"user_{sender}", self.channel_name)
        # print(otheruser)
        if otheruser:
            messages = await self.get_conversation(sender, otheruser)
            # print(messages)
            await self.send(text_data=json.dumps({
                'type': 'conversation_history',
                'messages': messages
            }))
        else:
            print("Invalid fetch_messages request")

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender__username']
        receiver = event['recipient__username']

        await self.send(text_data=json.dumps({
            'type': 'chat',
            'body': message,
            'sender__username': sender,
            'recipient__username': receiver
        }))

    # @database_sync_to_async
    # def get_user(self, username):
    #     return User.objects.get_or_create(username=username)[0]

    @database_sync_to_async
    def save_message(self, sender, recipient, body):
        sender_user = User.objects.get(username=sender)
        recipient_user = User.objects.get(username=recipient)
        Message.objects.create(sender=sender_user, recipient=recipient_user, body=body)

    @database_sync_to_async
    def get_conversation(self, user1, user2):
        # Retrieve the Message objects (not just values)
        messages = Message.objects.filter(
            (Q(sender__username=user1) & Q(recipient__username=user2)) |
            (Q(sender__username=user2) & Q(recipient__username=user1))
        ).order_by('date')
        
        # Convert each Message instance to a dictionary with the 'serializable_date' field
        result = []
        for message in messages:
            result.append({
                'sender__username': message.sender.username,
                'recipient__username': message.recipient.username,
                'body': message.body,
                'date': message.serializable_date,  # Use the serializable_date property
                'is_read': message.is_read,
            })

        return result

    # def get_conversation(self, user1, user2):
    #     return list(Message.objects.filter(
    #         (Q(sender__username=user1) & Q(recipient__username=user2)) |
    #         (Q(sender__username=user2) & Q(recipient__username=user1))
    #     ).order_by('date').values('sender__username', 'recipient__username', 'body', 'date', 'is_read'))
