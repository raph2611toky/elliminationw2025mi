from django.db import models
from django.conf import settings
from django.utils import timezone as django_timezone
from datetime import timedelta
from dotenv import load_dotenv
import uuid
import os

load_dotenv()

def default_created_at():
    tz = os.getenv("TIMEZONE_HOURS")
    if tz.strip().startswith("-"):
        return django_timezone.now() - timedelta(hours=int(tz.replace("-","").strip()))
    return django_timezone.now() + timedelta(hours=int(tz))

class Quizz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=200)
    categorie = models.CharField(max_length=200, choices=[(x, x) for x in ['COUPLE', 'TRAVAIL', 'ETUDE', 'COMPETITION', 'SOCIAL']])
    creer_le = models.DateTimeField(default=default_created_at)
    creer_par = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quizzes')

    def __str__(self):
        return self.nom

    class Meta:
        db_table = 'quizz'
        verbose_name = 'Quizz'
        verbose_name_plural = 'Quizz'

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quizz = models.ForeignKey(Quizz, on_delete=models.CASCADE, related_name='questions')
    contenu = models.TextField()
    creer_le = models.DateTimeField(default=default_created_at)

    def __str__(self):
        return f"{self.quizz.nom} - {self.contenu[:50]}"

    class Meta:
        db_table = 'question'
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'

class Reponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='reponses')
    contenu = models.TextField()
    note = models.FloatField(default=0.0)
    creer_le = models.DateTimeField(default=default_created_at)

    def __str__(self):
        return f"{self.question.contenu[:20]} - {self.contenu[:20]} ({self.note}/10)"

    class Meta:
        db_table = 'reponse'
        verbose_name = 'Réponse'
        verbose_name_plural = 'Réponses'

class ReponseQuizz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reponses_quizz')
    quizz = models.ForeignKey(Quizz, on_delete=models.CASCADE, related_name='reponses_quizz')
    derniere_moyenne = models.FloatField(default=0.0)
    creer_le = models.DateTimeField(default=default_created_at)
    modifier_le = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.utilisateur.name} - {self.quizz.nom} ({self.derniere_moyenne}/10)"

    class Meta:
        db_table = 'reponse_quizz'
        verbose_name = 'Réponse de quizz'
        verbose_name_plural = 'Réponses de quizz'
        unique_together = ('utilisateur', 'quizz')

class ReponseUnitaire(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reponse_quizz = models.ForeignKey(ReponseQuizz, on_delete=models.CASCADE, related_name='reponses_unitaires')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='reponses_unitaires')
    reponses_choisies = models.ManyToManyField(Reponse, related_name='reponses_unitaires')
    note_obtenue = models.FloatField(default=0.0)
    creer_le = models.DateTimeField(default=default_created_at)

    def __str__(self):
        return f"{self.reponse_quizz.utilisateur.name} - {self.question.contenu[:20]}"

    class Meta:
        db_table = 'reponse_unitaire'
        verbose_name = 'Réponse unitaire'
        verbose_name_plural = 'Réponses unitaires'
        unique_together = ('reponse_quizz', 'question')