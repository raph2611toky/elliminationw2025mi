from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db import transaction
from apps.endpage.models import EndPage, EndPageImage, EndPageFile, Video, Scenario, Scene, Avatar
from apps.endpage.serializers import (
    EndPageSerializer, EndPageImageSerializer, EndPageFileSerializer,
    VideoSerializer, ScenarioSerializer, SceneSerializer, EndPageReactionSerializer, EndPageCreateSerializer, AvatarSerializer
)
from django.db.models import Count, F, Value
from django.db.models.functions import Coalesce
from rest_framework.parsers import MultiPartParser, FormParser
from helpers.services.chat.api import simple_chat
from helpers.services.evenlabs.tts import text_to_speech
from helpers.services.sadtalker.gradio import animate
from django.conf import settings
import traceback, os

class EndPageListView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lister toutes les pages de fin",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'type', openapi.IN_QUERY, description="Filter by EndPage type (e.g., DEMISSION, DEPART)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TYPE_CHOICES]
            ),
            openapi.Parameter(
                'ton', openapi.IN_QUERY, description="Filter by EndPage ton (e.g., DRAMATIQUE, OPTIMISTE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TON_CHOICES]
            ),
            openapi.Parameter(
                'expression', openapi.IN_QUERY, description="Filter by EndPage expression (e.g., TRISTE, JOIE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.EXPRESSION_CHOICES]
            ),
        ],
        responses={
            200: openapi.Response(
                description="Liste des pages de fin récupérée avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'titre': openapi.Schema(type=openapi.TYPE_STRING),
                            'version_des_faits': openapi.Schema(type=openapi.TYPE_STRING),
                            'resumer_des_faits': openapi.Schema(type=openapi.TYPE_STRING),
                            'identifiant': openapi.Schema(type=openapi.TYPE_STRING),
                            'type': openapi.Schema(type=openapi.TYPE_STRING),
                            'ton': openapi.Schema(type=openapi.TYPE_STRING),
                            'expression': openapi.Schema(type=openapi.TYPE_STRING),
                            'fin_voulue': openapi.Schema(type=openapi.TYPE_STRING),
                            'perpective': openapi.Schema(type=openapi.TYPE_STRING),
                            'couleur': openapi.Schema(type=openapi.TYPE_STRING),
                            'police': openapi.Schema(type=openapi.TYPE_STRING),
                            'taille': openapi.Schema(type=openapi.TYPE_STRING),
                            'mots_adieu': openapi.Schema(type=openapi.TYPE_STRING),
                            'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date'),
                            'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                            'user': openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'email': openapi.Schema(type=openapi.TYPE_STRING),
                                }
                            ),
                            'coeurs_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'feux_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'larmes_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'applaudissements_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'sourires_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'chocs_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                        }
                    )
                )
            )
        }
    )
    def get(self, request):
        type_filter = request.query_params.get('type')
        ton_filter = request.query_params.get('ton')
        expression_filter = request.query_params.get('expression')

        queryset = EndPage.objects.all()
        if type_filter:
            if type_filter not in [choice[0] for choice in EndPage.TYPE_CHOICES]:
                return Response({"error": f"Type invalide. Valeurs valides: {[choice[0] for choice in EndPage.TYPE_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(type=type_filter)
        if ton_filter:
            if ton_filter not in [choice[0] for choice in EndPage.TON_CHOICES]:
                return Response({"error": f"Ton invalide. Valeurs valides: {[choice[0] for choice in EndPage.TON_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(ton=ton_filter)
        if expression_filter:
            if expression_filter not in [choice[0] for choice in EndPage.EXPRESSION_CHOICES]:
                return Response({"error": f"Expression invalide. Valeurs valides: {[choice[0] for choice in EndPage.EXPRESSION_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(expression=expression_filter)
        end_pages = queryset
        serializer = EndPageSerializer(end_pages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EndPageDetailView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Récupérer les détails d'une page de fin. Ajouter ?detail=true pour inclure les vidéos et scénarios.",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'detail',
                openapi.IN_QUERY,
                description="Inclure les vidéos et scénarios si true",
                type=openapi.TYPE_BOOLEAN,
                required=False,
                default=False
            )
        ],
        responses={
            200: EndPageSerializer,
            404: openapi.Response(
                description="Page de fin non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Page de fin non trouvée")
                    }
                )
            )
        }
    )
    def get(self, request, end_page_id):
        try:
            end_page = EndPage.objects.get(id=end_page_id)
            detail = request.query_params.get('detail', 'false').lower() == 'true'
            serializer = EndPageSerializer(end_page, context={'detail': detail})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(traceback.format_exc())
            return Response({"erreur": str(e)}, status=500)

class EndPageCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    @swagger_auto_schema(
        operation_description="Créer une nouvelle page de fin avec des données multipart/form-data",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'titre', openapi.IN_FORM, description="Titre de la page de fin",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'version_des_faits', openapi.IN_FORM, description="Description des faits",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'type', openapi.IN_FORM, description="Type de page de fin",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TYPE_CHOICES], required=True
            ),
            openapi.Parameter(
                'ton', openapi.IN_FORM, description="Ton de la page de fin",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TON_CHOICES], required=True
            ),
            openapi.Parameter(
                'expression', openapi.IN_FORM, description="Expression de la page de fin",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.EXPRESSION_CHOICES], required=True
            ),
            openapi.Parameter(
                'fin_voulue', openapi.IN_FORM, description="Fin voulue (optionnel)",
                type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                'perpective', openapi.IN_FORM, description="Perspective",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'couleur', openapi.IN_FORM, description="Couleur de la page",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'police', openapi.IN_FORM, description="Police de texte",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                'taille', openapi.IN_FORM, description="Taille du texte",
                type=openapi.TYPE_STRING, enum=['PETIT', 'MOYEN', 'GRAND'], required=True
            ),
            openapi.Parameter(
                'avatar_pseudo', openapi.IN_FORM, description="Pseudo de l'avatar",
                type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                'avatar_mode', openapi.IN_FORM, description="Mode de l'avatar",
                type=openapi.TYPE_STRING, enum=['RELAX', 'PRO'], required=False
            ),
            openapi.Parameter(
                'avatar_sexe', openapi.IN_FORM, description="Sexe de l'avatar",
                type=openapi.TYPE_STRING, enum=['MASCULIN', 'FEMININ'], required=False
            ),
            openapi.Parameter(
                'images', openapi.IN_FORM, description="Images à uploader (multiple, optionnel)",
                type=openapi.TYPE_FILE, required=False
            ),
            openapi.Parameter(
                'files', openapi.IN_FORM, description="Fichiers à uploader (multiple, optionnel)",
                type=openapi.TYPE_FILE, required=False
            ),
            openapi.Parameter(
                'photo', openapi.IN_FORM, description="Fichiers à uploader (multiple, optionnel)",
                type=openapi.TYPE_FILE, required=True
            ),
        ],
        responses={
            201: EndPageSerializer,
            400: openapi.Response(
                description="Données invalides",
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
            data = request.data
            data['user'] = request.user
            # avatar = Avatar.objects.get_or_create(user=request.user, defaults={"mode":"RELAX","sexe":request.user.sexe, "pseudo":request.user.name})
            # if 'avatar_mode' in request.data:
            #     avatar.mode = request.data.get('avatar_mode')
            # if 'avatar_sexe' in request.data:
            #     avatar.sexe = request.data.get('avatar_sexe')
            # if 'avatar_pseudo' in request.data:
            #     avatar.pseudo = request.data.get('avatar_pseudo')
            # avatar.save()
            version_des_faits = request.data.get('version_des_faits')
            data['resumer_des_faits'] = simple_chat(f"resumer moi ma version de fait de ceci comme je le ractonte, et fait le à la première personne du singulier s'il s'agit de mon personnage.\n {request.data.get('version_des_faits')}. Et Sache que je suis vraiement {request.data.get('expression')}")
            data['mots_adieu'] = simple_chat(f"Fait moi maintenant un mot d'adieu à celui qui m'a rendu {request.data.get('expression')} dans ma version des faits suivants: {request.data.get('version_des_faits')}. Racontez le à la première personne et exprimer y mon expression qui est très {request.data.get('expression')} sur ce sujet.")
            
            serializer = EndPageCreateSerializer(data=data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                end_page = serializer.save()
                ma_version_audio = text_to_speech(text=version_des_faits, sexe=request.user.sexe)
                animate(os.path.join(settings.MEDIA_ROOT, 'endpage',end_page.photo.url),ma_version_audio)
                images = request.FILES.getlist('images')
                fichiers = request.FILES.getlist('fichiers')
                for image in images:
                    EndPageImage.objects.create(end_page=end_page, image=image)
                for fichier in fichiers:
                    EndPageImage.objects.create(end_page=end_page, fichier=fichier)
                return Response(EndPageSerializer(end_page).data, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(traceback.format_exc())
            return Response({'erreur':str(e)},status=400)

class EndPageUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Mettre à jour une page de fin",
        tags=["EndPage"],
        request_body=EndPageCreateSerializer,
        responses={
            200: EndPageSerializer,
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Données invalides")
                    }
                )
            ),
            403: openapi.Response(
                description="Accès refusé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Vous n'êtes pas autorisé à modifier cette page")
                    }
                )
            ),
            404: openapi.Response(
                description="Page de fin non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Page de fin non trouvée")
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def put(self, request, end_page_id):
        try:
            end_page = EndPage.objects.get(id=end_page_id)
            if end_page.user != request.user:
                return Response({"error": "Vous n'êtes pas autorisé à modifier cette page"}, status=status.HTTP_403_FORBIDDEN)
            serializer = EndPageCreateSerializer(end_page, data=request.data, context={'request': request})
            if serializer.is_valid():
                end_page = serializer.save()
                return Response(EndPageSerializer(end_page).data, status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class TopTotalReactionsView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve the top 10 EndPages by total reaction count, with optional filters for type, ton, and expression",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'type', openapi.IN_QUERY, description="Filter by EndPage type (e.g., DEMISSION, DEPART)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TYPE_CHOICES]
            ),
            openapi.Parameter(
                'ton', openapi.IN_QUERY, description="Filter by EndPage ton (e.g., DRAMATIQUE, OPTIMISTE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TON_CHOICES]
            ),
            openapi.Parameter(
                'expression', openapi.IN_QUERY, description="Filter by EndPage expression (e.g., TRISTE, JOIE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.EXPRESSION_CHOICES]
            ),
        ],
        responses={
            200: openapi.Response(
                description="Top 10 EndPages by total reaction count",
                schema=EndPageSerializer(many=True)
            )
        }
    )
    def get(self, request):
        # Get filter parameters
        type_filter = request.query_params.get('type')
        ton_filter = request.query_params.get('ton')
        expression_filter = request.query_params.get('expression')

        # Base queryset with optional filters
        queryset = EndPage.objects.all()
        if type_filter:
            if type_filter not in [choice[0] for choice in EndPage.TYPE_CHOICES]:
                return Response({"error": f"Type invalide. Valeurs valides: {[choice[0] for choice in EndPage.TYPE_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(type=type_filter)
        if ton_filter:
            if ton_filter not in [choice[0] for choice in EndPage.TON_CHOICES]:
                return Response({"error": f"Ton invalide. Valeurs valides: {[choice[0] for choice in EndPage.TON_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(ton=ton_filter)
        if expression_filter:
            if expression_filter not in [choice[0] for choice in EndPage.EXPRESSION_CHOICES]:
                return Response({"error": f"Expression invalide. Valeurs valides: {[choice[0] for choice in EndPage.EXPRESSION_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(expression=expression_filter)

        # Annotate with total reaction count
        top_pages = queryset.annotate(
            total_reactions=Coalesce(Count('reaction_coeurs'), 0) +
                            Coalesce(Count('reaction_feux'), 0) +
                            Coalesce(Count('reaction_larmes'), 0) +
                            Coalesce(Count('reaction_applaudissements'), 0) +
                            Coalesce(Count('reaction_sourires'), 0) +
                            Coalesce(Count('reaction_chocs'), 0)
        ).order_by('-total_reactions')[:5]

        serializer = EndPageSerializer(top_pages, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class TopReactionsView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Retrieve the top 3 EndPages for each reaction type, with optional filters for type, ton, and expression",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'type', openapi.IN_QUERY, description="Filter by EndPage type (e.g., DEMISSION, DEPART)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TYPE_CHOICES]
            ),
            openapi.Parameter(
                'ton', openapi.IN_QUERY, description="Filter by EndPage ton (e.g., DRAMATIQUE, OPTIMISTE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.TON_CHOICES]
            ),
            openapi.Parameter(
                'expression', openapi.IN_QUERY, description="Filter by EndPage expression (e.g., TRISTE, JOIE)",
                type=openapi.TYPE_STRING, enum=[choice[0] for choice in EndPage.EXPRESSION_CHOICES]
            ),
        ],
        responses={
            # 200: openapi.Response(
            #     description="Top 3 EndPages for each reaction type",
            #     schema=openapi.Schema(
            #         type=openapi.TYPE_OBJECT,
            #         properties={
            #             'coeurs': EndPageSerializer(many=True),
            #             'feux': EndPageSerializer(many=True),
            #             'larmes': EndPageSerializer(many=True),
            #             'applaudissements': EndPageSerializer(many=True),
            #             'sourires': EndPageSerializer(many=True),
            #             'chocs': EndPageSerializer(many=True),
            #         }
            #     )
            # )
        }
    )
    def get(self, request):
        # Get filter parameters
        type_filter = request.query_params.get('type')
        ton_filter = request.query_params.get('ton')
        expression_filter = request.query_params.get('expression')

        # Base queryset with optional filters
        queryset = EndPage.objects.all()
        if type_filter:
            if type_filter not in [choice[0] for choice in EndPage.TYPE_CHOICES]:
                return Response({"error": f"Type invalide. Valeurs valides: {[choice[0] for choice in EndPage.TYPE_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(type=type_filter)
        if ton_filter:
            if ton_filter not in [choice[0] for choice in EndPage.TON_CHOICES]:
                return Response({"error": f"Ton invalide. Valeurs valides: {[choice[0] for choice in EndPage.TON_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(ton=ton_filter)
        if expression_filter:
            if expression_filter not in [choice[0] for choice in EndPage.EXPRESSION_CHOICES]:
                return Response({"error": f"Expression invalide. Valeurs valides: {[choice[0] for choice in EndPage.EXPRESSION_CHOICES]}"}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(expression=expression_filter)

        # Get top 3 for each reaction type
        reaction_types = [
            'reaction_coeurs', 'reaction_feux', 'reaction_larmes',
            'reaction_applaudissements', 'reaction_sourires', 'reaction_chocs'
        ]
        result = {}
        for reaction in reaction_types:
            # Map reaction field to serializer key
            reaction_key = reaction.replace('reaction_', '')
            # Annotate with count and order by count (descending)
            top_pages = queryset.annotate(
                reaction_count=Count(reaction)
            ).order_by('-reaction_count')[:3]
            serializer = EndPageSerializer(top_pages, many=True, context={'request': request})
            result[reaction_key] = serializer.data

        return Response(result, status=status.HTTP_200_OK)

class EndPageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer une page de fin",
        tags=["EndPage"],
        responses={
            204: openapi.Response(description="Page de fin supprimée avec succès"),
            403: openapi.Response(
                description="Accès refusé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Vous n'êtes pas autorisé à supprimer cette page")
                    }
                )
            ),
            404: openapi.Response(
                description="Page de fin non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Page de fin non trouvée")
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, end_page_id):
        try:
            end_page = EndPage.objects.get(id=end_page_id)
            if end_page.user != request.user:
                return Response({"error": "Vous n'êtes pas autorisé à supprimer cette page"}, status=status.HTTP_403_FORBIDDEN)
            end_page.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class EndPageReactionView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Ajouter ou supprimer une réaction sur une page de fin (bascule automatiquement : ajoute si non présent, supprime si présent)",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'reaction_type',
                openapi.IN_PATH,
                enum=['coeurs', 'feux', 'larmes', 'applaudissements'],
                type=openapi.TYPE_STRING,
                required=True,
                description="Type de réaction"
            )
        ],
        responses={
            200: EndPageSerializer,
            400: openapi.Response(
                description="Données invalides",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Données invalides")
                    }
                )
            ),
            404: openapi.Response(
                description="Page de fin non trouvée",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Page de fin non trouvée")
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def post(self, request, end_page_id):
        serializer = EndPageReactionSerializer(data=request.data, context={'end_page_id': end_page_id})
        if serializer.is_valid():
            try:
                end_page = EndPage.objects.get(id=end_page_id)
                reaction_type = serializer.validated_data['reaction_type']
                reaction_field = getattr(end_page, f'reaction_{reaction_type}')

                with transaction.atomic():
                    if request.user in reaction_field.all():
                        reaction_field.remove(request.user)
                    else:
                        reaction_field.add(request.user)

                return Response(EndPageSerializer(end_page).data, status=status.HTTP_200_OK)
            except EndPage.DoesNotExist:
                return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class VideoListView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lister toutes les vidéos d'une page de fin",
        tags=["Video"],
        responses={200: VideoSerializer(many=True)}
    )
    def get(self, request, end_page_id):
        try:
            EndPage.objects.get(id=end_page_id)
            videos = Video.objects.filter(end_page_id=end_page_id)
            serializer = VideoSerializer(videos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class VideoCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Ajouter une vidéo à une page de fin",
        tags=["Video"],
        request_body=VideoSerializer,
        responses={
            201: VideoSerializer,
            400: openapi.Response(description="Données invalides"),
            404: openapi.Response(description="Page de fin non trouvée")
        },
        security=[{'Bearer': []}]
    )
    def post(self, request, end_page_id):
        try:
            EndPage.objects.get(id=end_page_id)
            serializer = VideoSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                video = serializer.save(end_page_id=end_page_id)
                return Response(VideoSerializer(video).data, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class VideoDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer une vidéo d'une page de fin",
        tags=["Video"],
        responses={
            204: openapi.Response(description="Vidéo supprimée"),
            403: openapi.Response(description="Accès refusé"),
            404: openapi.Response(description="Vidéo non trouvée")
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, video_id):
        try:
            video = Video.objects.get(id=video_id)
            if video.end_page.user != request.user:
                return Response({"error": "Vous n'êtes pas autorisé à supprimer cette vidéo"}, status=status.HTTP_403_FORBIDDEN)
            video.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Video.DoesNotExist:
            return Response({"error": "Vidéo non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class ScenarioListView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lister tous les scénarios d'une page de fin",
        tags=["Scenario"],
        responses={200: ScenarioSerializer(many=True)}
    )
    def get(self, request, end_page_id):
        try:
            EndPage.objects.get(id=end_page_id)
            scenarios = Scenario.objects.filter(end_page_id=end_page_id)
            serializer = ScenarioSerializer(scenarios, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class ScenarioCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # @swagger_auto_schema(
    #     operation_description="Ajouter un scénario à une page de fin",
    #     tags=["Scenario"],
    #     request_body=ScenarioSerializer,
    #     responses={
    #         201: ScenarioSerializer,
    #         400: openapi.Response(description="Données invalides"),
    #         404: openapi.Response(description="Page de fin non trouvée")
    #     },
    #     security=[{'Bearer': []}]
    # )
    def post(self, request, end_page_id):
        try:
            EndPage.objects.get(id=end_page_id)
            serializer = ScenarioSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                scenario = serializer.save(end_page_id=end_page_id)
                return Response(ScenarioSerializer(scenario).data, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except EndPage.DoesNotExist:
            return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class ScenarioDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer un scénario d'une page de fin",
        tags=["Scenario"],
        responses={
            204: openapi.Response(description="Scénario supprimé"),
            403: openapi.Response(description="Accès refusé"),
            404: openapi.Response(description="Scénario non trouvé")
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, scenario_id):
        try:
            scenario = Scenario.objects.get(id=scenario_id)
            if scenario.end_page.user != request.user:
                return Response({"error": "Vous n'êtes pas autorisé à supprimer ce scénario"}, status=status.HTTP_403_FORBIDDEN)
            scenario.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Scenario.DoesNotExist:
            return Response({"error": "Scénario non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class SceneListView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lister toutes les scènes d'un scénario",
        tags=["Scene"],
        responses={200: SceneSerializer(many=True)}
    )
    def get(self, request, scenario_id):
        try:
            Scenario.objects.get(id=scenario_id)
            scenes = Scene.objects.filter(scenario_id=scenario_id)
            serializer = SceneSerializer(scenes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Scenario.DoesNotExist:
            return Response({"error": "Scénario non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class SceneCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Ajouter une scène à un scénario",
        tags=["Scene"],
        request_body=SceneSerializer,
        responses={
            201: SceneSerializer,
            400: openapi.Response(description="Données invalides"),
            404: openapi.Response(description="Scénario non trouvé")
        },
        security=[{'Bearer': []}]
    )
    def post(self, request, scenario_id):
        try:
            Scenario.objects.get(id=scenario_id)
            serializer = SceneSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                scene = serializer.save(scenario_id=scenario_id)
                return Response(SceneSerializer(scene).data, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Scenario.DoesNotExist:
            return Response({"error": "Scénario non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class SceneDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer une scène d'un scénario",
        tags=["Scene"],
        responses={
            204: openapi.Response(description="Scène supprimée"),
            403: openapi.Response(description="Accès refusé"),
            404: openapi.Response(description="Scène non trouvée")
        },
        security=[{'Bearer': []}]
    )
    def delete(self, request, scene_id):
        try:
            scene = Scene.objects.get(id=scene_id)
            if scene.scenario.end_page.user != request.user:
                return Response({"error": "Vous n'êtes pas autorisé à supprimer cette scène"}, status=status.HTTP_403_FORBIDDEN)
            scene.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Scene.DoesNotExist:
            return Response({"error": "Scène non trouvée"}, status=status.HTTP_404_NOT_FOUND)

class EndPageReactionView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Ajouter ou supprimer une réaction sur une page de fin (bascule automatiquement)",
        tags=["EndPage"],
        manual_parameters=[
            openapi.Parameter(
                'end_page_id',
                openapi.IN_PATH,
                description="ID de la page de fin",
                type=openapi.TYPE_INTEGER,
                format='uuid',
                required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'reaction_type': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['coeurs', 'feux', 'larmes', 'applaudissements', 'sourires', 'chocs'],
                    description="Type de réaction"
                )
            },
            required=['reaction_type']
        ),
        responses={
            200: EndPageSerializer,
            400: openapi.Response(description="Données invalides"),
            404: openapi.Response(description="Page de fin non trouvée")
        },
        security=[{'Bearer': []}]
    )
    def post(self, request, end_page_id):
        serializer = EndPageReactionSerializer(data=request.data, context={'end_page_id': end_page_id})
        if serializer.is_valid():
            try:
                end_page = EndPage.objects.get(id=end_page_id)
                reaction_type = serializer.validated_data['reaction_type']
                reaction_field = getattr(end_page, f'reaction_{reaction_type}')

                with transaction.atomic():
                    if request.user in reaction_field.all():
                        reaction_field.remove(request.user)
                    else:
                        reaction_field.add(request.user)

                return Response(EndPageSerializer(end_page).data, status=status.HTTP_200_OK)
            except EndPage.DoesNotExist:
                return Response({"error": "Page de fin non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)