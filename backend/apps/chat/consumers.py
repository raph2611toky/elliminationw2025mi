from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from helpers.services.chat.api import websocket_chat
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
            return
        
        self.conversation_id = self.scope['url_route']['kwargs'].get('conversation_id')
        try:
            conversation = await database_sync_to_async(Conversation.objects.get)(
                id=self.conversation_id, user=self.user
            )
            self.room_group_name = f"chat_{self.conversation_id}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        except Conversation.DoesNotExist:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')
        if not message:
            await self.send(text_data=json.dumps({
                'error': 'Message requis'
            }))
            return

        user_msg = await database_sync_to_async(Message.objects.create)(
            conversation_id=self.conversation_id,
            content=message,
            is_from_user=True
        )

        response_data = await websocket_chat(message)

        if 'response' in response_data:
            await database_sync_to_async(Message.objects.create)(
                conversation_id=self.conversation_id,
                content=response_data['response'],
                is_from_user=False
            )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'response': response_data.get('response'),
                'error': response_data.get('error')
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'response': event.get('response'),
            'error': event.get('error')
        }))