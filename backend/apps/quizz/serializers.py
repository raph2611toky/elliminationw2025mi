from rest_framework import serializers
from .models import Quizz, Question, Reponse, ReponseQuizz, ReponseUnitaire
from apps.user.serializers import UserSerializer
from django.conf import settings
from django.db.models import Max, Sum


class ReponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reponse
        fields = ['id', 'contenu', 'note']
        read_only_fields = ['note']


class QuestionSerializer(serializers.ModelSerializer):
    reponses = ReponseSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'contenu', 'reponses']


class QuizzSerializer(serializers.ModelSerializer):
    creer_par = UserSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    nombre_questions = serializers.SerializerMethodField()
    note_maximale = serializers.SerializerMethodField()

    class Meta:
        model = Quizz
        fields = ['id', 'nom', 'categorie', 'creer_le', 'creer_par', 'nombre_questions', 'note_maximale', 'questions']

    def get_nombre_questions(self, obj):
        return obj.questions.count()

    def get_note_maximale(self, obj):
        max_notes = obj.questions.annotate(max_note=Max('reponses__note')).aggregate(total=Sum('max_note'))
        return max_notes['total'] or 0.0

    def to_representation(self, instance):
        detail = self.context.get('detail', False)
        if not detail:
            self.fields.pop('questions', None)
        return super().to_representation(instance)


class ReponseUnitaireSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    reponses_choisies = ReponseSerializer(many=True)

    class Meta:
        model = ReponseUnitaire
        fields = ['id', 'question', 'reponses_choisies', 'note_obtenue']


class ReponseQuizzSerializer(serializers.ModelSerializer):
    utilisateur = UserSerializer(read_only=True)
    quizz = QuizzSerializer(read_only=True)
    reponses_unitaires = ReponseUnitaireSerializer(many=True, read_only=True)

    class Meta:
        model = ReponseQuizz
        fields = ['id', 'utilisateur', 'quizz', 'derniere_moyenne', 'reponses_unitaires']


class QuestionResponseSerializer(serializers.Serializer):
    question_id = serializers.UUIDField(required=True)
    reponse_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=True
    )


class SubmitReponseQuizzSerializer(serializers.Serializer):
    quizz_id = serializers.UUIDField(required=True)
    reponses_par_questions = serializers.ListField(
        child=QuestionResponseSerializer(),
        allow_empty=False
    )

    def validate(self, data):
        quizz_id = data['quizz_id']
        if not Quizz.objects.filter(id=quizz_id).exists():
            raise serializers.ValidationError("Le quizz spécifié n'existe pas.")

        for reponse in data['reponses_par_questions']:
            question_id = reponse['question_id']
            reponse_ids = reponse['reponse_ids']

            if not Question.objects.filter(id=question_id, quizz_id=quizz_id).exists():
                raise serializers.ValidationError(f"La question {question_id} n'appartient pas au quizz.")

            for reponse_id in reponse_ids:
                if not Reponse.objects.filter(id=reponse_id, question_id=question_id).exists():
                    raise serializers.ValidationError(f"La réponse {reponse_id} n'appartient pas à la question {question_id}.")

        return data