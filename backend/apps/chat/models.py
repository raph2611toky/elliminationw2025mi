from django.db import models
from apps.user.models import User, default_created_at


class Conversation(models.Model):
    DOMAIN_CHOICES = [
        ('ENDPAGE', 'EndPage'),
        ('CONSEIL', 'Conseil'),
        ('REHABILITATION', 'Réhabilitation'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversations")
    domain = models.CharField(max_length=50, choices=DOMAIN_CHOICES)
    titre = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(default=default_created_at)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name} - {self.domain} - {self.titre or 'Sans titre'}"

    class Meta:
        db_table = 'conversation'
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    is_from_user = models.BooleanField(default=True)
    creer_le = models.DateTimeField(default=default_created_at)

    def __str__(self):
        return f"{self.conversation} - {'User' if self.is_from_user else 'AI'} - {self.content[:50]}..."

    class Meta:
        db_table = 'message'
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'