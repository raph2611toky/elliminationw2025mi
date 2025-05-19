from rest_framework import serializers
from .models import Conversation, Message
from apps.user.serializers import UserSerializer
from helpers.services.chat.api import simple_chat


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'content', 'is_from_user', 'creer_le']
        read_only_fields = ['id', 'conversation', 'is_from_user', 'creer_le']

    def create(self, validated_data):
        conversation = self.context['conversation']
        user_message = validated_data['content']
        
        user_msg = Message.objects.create(
            conversation=conversation,
            content=user_message,
            is_from_user=True
        )
        
        ai_response = simple_chat(user_message)
        
        ai_msg = Message.objects.create(
            conversation=conversation,
            content=ai_response,
            is_from_user=False
        )
        
        return user_msg


class ConversationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'domain', 'titre', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_domain(self, value):
        valid_domains = [choice[0] for choice in Conversation.DOMAIN_CHOICES]
        if value not in valid_domains:
            raise serializers.ValidationError("Domaine invalide.")
        return value

    def validate_titre(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide si fourni.")
        return value


class ConversationCreateSerializer(serializers.ModelSerializer):
    message = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Conversation
        fields = ['domain', 'titre', 'message']

    def validate_domain(self, value):
        valid_domains = [choice[0] for choice in Conversation.DOMAIN_CHOICES]
        if value not in valid_domains:
            raise serializers.ValidationError("Domaine invalide.")
        return value

    def validate_titre(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide si fourni.")
        return value

    def create(self, validated_data):
        message = validated_data.pop('message', None)
        conversation = Conversation.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        if message:
            Message.objects.create(
                conversation=conversation,
                content=message,
                is_from_user=True
            )
            ai_response = simple_chat(message)
            Message.objects.create(
                conversation=conversation,
                content=ai_response,
                is_from_user=False
            )
        return conversation