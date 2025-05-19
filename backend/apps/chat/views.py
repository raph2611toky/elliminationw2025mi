from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Conversation, Message
from .serializers import ConversationSerializer, ConversationCreateSerializer, MessageSerializer
from helpers.services.chat.api import simple_chat


class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Créer une nouvelle conversation ou ajouter un message à une conversation existante",
        tags=["Chat"],
        request_body=ConversationCreateSerializer,
        responses={
            201: openapi.Response(
                description="Response de donnée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            404: openapi.Response(
                description="Conversation non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        try:
            conversation_id = request.data.get('conversation_id')
            domain = request.data.get('domain')
            titre = request.data.get('titre', '')
            print(request.data)

            # Cas 1 : Conversation existante
            if conversation_id:
                try:
                    conversation = Conversation.objects.get(id=conversation_id, user=request.user, domain=domain, titre=titre)
                except Conversation.DoesNotExist:
                    return Response({"error": "Conversation non trouvée"}, status=status.HTTP_404_NOT_FOUND)
            # Cas 2 : Nouvelle conversation
            else:
                serializer = ConversationCreateSerializer(data=request.data, context={'request': request})
                if not serializer.is_valid():
                    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                conversation = serializer.save()

            # Gestion du message
            if request.data.get('message') is not None:
                serializer = MessageSerializer(
                    data={'content': str(request.data.get('message')), 'is_from_user': True},
                    context={'conversation': conversation}
                )
                if not serializer.is_valid():
                    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                serializer.save()
                # reponse_bot = simple_chat(str(request.data.get('message')))
                # Message.objects.create(conversation=conversation, content=reponse_bot, is_from_user=False)
                return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)

            return Response(ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Lister toutes les conversations de l'utilisateur",
        tags=["Chat"],
        responses={
            200: ConversationSerializer(many=True)
        },
        security=[{'Bearer': []}]
    )
    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Récupérer les détails d'une conversation",
        tags=["Chat"],
        responses={
            200: ConversationSerializer,
            404: openapi.Response(
                description="Conversation non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class MessageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer un message",
        tags=["Chat"],
        responses={
            204: openapi.Response(description="Message supprimé"),
            403: openapi.Response(
                description="Accès refusé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            404: openapi.Response(
                description="Message non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, message_id):
        try:
            message = Message.objects.get(id=message_id, conversation__user=request.user)
            message.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Message.DoesNotExist:
            return Response({"error": "Message non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class ConversationDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer une conversation",
        tags=["Chat"],
        responses={
            204: openapi.Response(description="Conversation supprimée"),
            403: openapi.Response(
                description="Accès refusé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            404: openapi.Response(
                description="Conversation non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            conversation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class ConversationUpdatetitreView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Modifier le titre d'une conversation",
        tags=["Chat"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'titre': openapi.Schema(type=openapi.TYPE_STRING, description="Nouveau titre")
            },
            required=['titre']
        ),
        responses={
            200: ConversationSerializer,
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            404: openapi.Response(
                description="Conversation non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def put(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=request.user)
            titre = request.data.get('titre')
            if not titre or not titre.strip():
                return Response({"error": "Le titre ne peut pas être vide"}, status=status.HTTP_400_BAD_REQUEST)
            conversation.titre = titre
            conversation.save()
            return Response(ConversationSerializer(conversation).data, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=status.HTTP_404_NOT_FOUND)