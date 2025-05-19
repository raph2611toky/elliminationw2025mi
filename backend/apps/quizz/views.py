from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db import transaction
from django.db.models import Avg
from .models import Quizz, Question, Reponse, ReponseQuizz, ReponseUnitaire
from .serializers import QuizzSerializer, ReponseQuizzSerializer, SubmitReponseQuizzSerializer
import traceback

class QuizzListView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Lister tous les quizzes disponibles. Par défaut, retourne une liste courte (sans questions). Ajoutez ?detail=true pour les détails complets.",
        tags=["Quizz"],
        manual_parameters=[
            openapi.Parameter(
                'detail',
                openapi.IN_QUERY,
                description="Si true, inclut les détails des questions et réponses",
                type=openapi.TYPE_BOOLEAN,
                required=False,
                default=False
            )
        ],
        responses={
            200: openapi.Response(
                description="Liste des quizzes récupérée avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                            "nom": openapi.Schema(type=openapi.TYPE_STRING, example="Quiz de culture générale"),
                            "categorie": openapi.Schema(type=openapi.TYPE_STRING, example="ETUDE"),
                            "creer_le": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                            "creer_par": openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                    "email": openapi.Schema(type=openapi.TYPE_STRING),
                                    "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                }
                            ),
                            "nombre_questions": openapi.Schema(type=openapi.TYPE_INTEGER, example=3),
                            "note_maximale": openapi.Schema(type=openapi.TYPE_NUMBER, example=27.0),
                            "questions": openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                        "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                        "reponses": openapi.Schema(
                                            type=openapi.TYPE_ARRAY,
                                            items=openapi.Schema(
                                                type=openapi.TYPE_OBJECT,
                                                properties={
                                                    "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                                    "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                                    "note": openapi.Schema(type=openapi.TYPE_NUMBER),
                                                }
                                            )
                                        )
                                    }
                                ),
                                description="Inclus uniquement si detail=true"
                            )
                        },
                        required=["id", "nom", "categorie", "creer_le", "creer_par", "nombre_questions", "note_maximale"]
                    )
                )
            )
        }
    )
    def get(self, request):
        quizzes = Quizz.objects.all()
        # Check for 'detail' query parameter
        detail = request.query_params.get('detail', 'false').lower() == 'true'
        serializer = QuizzSerializer(quizzes, many=True, context={'detail': detail})
        return Response(serializer.data, status=status.HTTP_200_OK)

class QuizzDetailView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Récupérer les détails complets d'un quizz",
        tags=["Quizz"],
        responses={
            200: openapi.Response(
                description="Détails du quizz récupérés avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                        "nom": openapi.Schema(type=openapi.TYPE_STRING, example="Quiz de culture générale"),
                        "categorie": openapi.Schema(type=openapi.TYPE_STRING, example="ETUDE"),
                        "creer_le": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                        "creer_par": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                "email": openapi.Schema(type=openapi.TYPE_STRING),
                                "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                        "nombre_questions": openapi.Schema(type=openapi.TYPE_INTEGER, example=3),
                        "note_maximale": openapi.Schema(type=openapi.TYPE_NUMBER, example=27.0),
                        "questions": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                    "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                    "reponses": openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(
                                            type=openapi.TYPE_OBJECT,
                                            properties={
                                                "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                                "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                                "note": openapi.Schema(type=openapi.TYPE_NUMBER),
                                            }
                                        )
                                    )
                                }
                            )
                        )
                    }
                )
            ),
            404: openapi.Response(
                description="Quizz non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Quizz non trouvé")
                    }
                )
            )
        }
    )
    def get(self, request, quizz_id):
        try:
            quizz = Quizz.objects.get(id=quizz_id)
            serializer = QuizzSerializer(quizz, context={'detail': True})  # Always include details
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Quizz.DoesNotExist:
            return Response({"error": "Quizz non trouvé"}, status=status.HTTP_404_NOT_FOUND)

class SubmitQuizzView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Soumettre les réponses à un quizz",
        tags=["Quizz"],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "quizz_id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid", description="ID du quizz"),
                "reponses_par_questions": openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "question_id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid", description="ID de la question"),
                            "reponse_ids": openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                description="Liste des IDs des réponses choisies"
                            )
                        },
                        required=["question_id", "reponse_ids"]
                    ),
                    description="Liste des réponses par question"
                )
            },
            required=["quizz_id", "reponses_par_questions"]
        ),
        responses={
            201: openapi.Response(
                description="Réponses soumises avec succès",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                        "utilisateur": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                "email": openapi.Schema(type=openapi.TYPE_STRING),
                                "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                        "quizz": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                "nom": openapi.Schema(type=openapi.TYPE_STRING),
                                "categorie": openapi.Schema(type=openapi.TYPE_STRING),
                                "creer_le": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                                "creer_par": openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                                        "email": openapi.Schema(type=openapi.TYPE_STRING),
                                        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                    }
                                ),
                                "nombre_questions": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "note_maximale": openapi.Schema(type=openapi.TYPE_NUMBER),
                                "questions": openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                            "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                            "reponses": openapi.Schema(
                                                type=openapi.TYPE_ARRAY,
                                                items=openapi.Schema(
                                                    type=openapi.TYPE_OBJECT,
                                                    properties={
                                                        "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                                        "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                                        "note": openapi.Schema(type=openapi.TYPE_NUMBER),
                                                    }
                                                )
                                            )
                                        }
                                    )
                                )
                            }
                        ),
                        "derniere_moyenne": openapi.Schema(type=openapi.TYPE_NUMBER),
                        "reponses_unitaires": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                    "question": openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                            "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                            "reponses": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
                                        }
                                    ),
                                    "reponses_choisies": openapi.Schema(
                                        type=openapi.TYPE_ARRAY,
                                        items=openapi.Schema(
                                            type=openapi.TYPE_OBJECT,
                                            properties={
                                                "id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
                                                "contenu": openapi.Schema(type=openapi.TYPE_STRING),
                                                "note": openapi.Schema(type=openapi.TYPE_NUMBER),
                                            }
                                        )
                                    ),
                                    "note_obtenue": openapi.Schema(type=openapi.TYPE_NUMBER),
                                }
                            )
                        )
                    }
                )
            ),
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
                description="Quizz non trouvé",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, example="Quizz non trouvé")
                    }
                )
            )
        },
        security=[{'Bearer': []}]
    )
    def post(self, request):
        try:
            serializer = SubmitReponseQuizzSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            quizz_id = serializer.validated_data['quizz_id']
            quizz = Quizz.objects.get(id=quizz_id)

            with transaction.atomic():
                reponse_quizz, created = ReponseQuizz.objects.get_or_create(
                    utilisateur=request.user,
                    quizz=quizz,
                    defaults={'derniere_moyenne': 0.0}
                )

                total_note = 0
                answered_questions = 0
                for reponse_data in serializer.validated_data['reponses_par_questions']:
                    question_id = reponse_data['question_id']
                    reponse_ids = reponse_data['reponse_ids']

                    question = Question.objects.get(id=question_id)
                    reponses_choisies = Reponse.objects.filter(id__in=reponse_ids)

                    note_obtenue = reponses_choisies.aggregate(Avg('note'))['note__avg'] or 0.0 if reponses_choisies.exists() else 0.0

                    reponse_unitaire, _ = ReponseUnitaire.objects.get_or_create(
                        reponse_quizz=reponse_quizz,
                        question=question,
                        defaults={'note_obtenue': note_obtenue}
                    )
                    reponse_unitaire.reponses_choisies.set(reponses_choisies)
                    reponse_unitaire.note_obtenue = note_obtenue
                    reponse_unitaire.save()

                    if reponses_choisies.exists():
                        total_note += note_obtenue
                        answered_questions += 1

                reponse_quizz.derniere_moyenne = total_note / answered_questions if answered_questions > 0 else 0.0
                reponse_quizz.save()

            serializer = ReponseQuizzSerializer(reponse_quizz, context={'detail': True})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Quizz.DoesNotExist:
            return Response({"error": "Quizz non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(traceback.format_exc())
            return Response({"erreur": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)