from django.db import models
from apps.user.models import User, default_created_at
import uuid

class EndPage(models.Model):
    TYPE_CHOICES = [
        ('démission', 'Démission'),
        ('départ', 'Départ'),
        ('rupture', 'Rupture'),
        ('ABANDON', 'Abandon d’études'),
    ]

    TON_CHOICES = [
        ('DRAMATIQUE', 'Dramatique'),
        ('IRONIQUE', 'Ironique'),
        ('HUMORISTIQUE', 'Humoristique'),
        ('SERIEUX', 'Sérieux'),
        ('OPTIMISTE', 'Optimiste'),
        ('NOSTALGIQUE', 'Nostalgique'),
        ('POETIQUE', 'Poétique'),
        ('SARCASTIQUE', 'Sarcastique'),
        ('REFLEXIF', 'Réflexif'),
        ('EMOTIF', 'Émotif'),
    ]

    EXPRESSION_CHOICES = [
        ('triste', 'Triste'),
        ('colère', 'Colère'),
        ('joie', 'Joie'),
        ('surpris', 'Surprise'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="end_pages")
    
    titre = models.CharField(max_length=100)
    version_des_faits = models.TextField()
    resumer_des_faits = models.TextField(null=True)
    identifiant = models.UUIDField(unique=True)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)
    ton = models.CharField(max_length=100, choices=TON_CHOICES)
    expression = models.CharField(max_length=100, choices=EXPRESSION_CHOICES)
    fin_voulue = models.CharField(max_length=200, null=True, blank=True)
    perpective = models.TextField()
    photo = models.ImageField(upload_to='endpage/images', null=True)
    
    couleur = models.CharField(max_length=100, default='#A99')
    police = models.CharField(max_length=100, default='Arial')
    taille = models.CharField(max_length=100, choices=[(x, x.lower().capitalize()) for x in ['PETIT', 'MOYEN', 'GRAND']])
    mots_adieu = models.TextField(null=True)
    
    created_at = models.DateTimeField(default=default_created_at)
    updated_at = models.DateTimeField(auto_now=True)

    reaction_coeurs = models.ManyToManyField(User, related_name="reaction_coeurs", blank=True)
    reaction_feux = models.ManyToManyField(User, related_name="reaction_feux", blank=True)
    reaction_larmes = models.ManyToManyField(User, related_name="reaction_larmes", blank=True)
    reaction_applaudissements = models.ManyToManyField(User, related_name="reaction_applaudissements", blank=True)
    reaction_sourires = models.ManyToManyField(User, related_name="reaction_sourires", blank=True)
    reaction_chocs = models.ManyToManyField(User, related_name="reaction_chocs", blank=True)

    def save(self, *args, **kwargs):
        if not self.identifiant:
            self.identifiant = uuid.uuid4()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} - {self.version_des_faits[:50]}..."

    class Meta:
        db_table = 'endpage'
        verbose_name = 'Page de fin'
        verbose_name_plural = 'Pages de fin'


class EndPageImage(models.Model):
    end_page = models.ForeignKey(EndPage, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='endpage/images/')

    class Meta:
        db_table = 'endpage_image'
        verbose_name = 'Image de page de fin'
        verbose_name_plural = 'Images de pages de fin'

class EndPageFile(models.Model):
    end_page = models.ForeignKey(EndPage, on_delete=models.CASCADE, related_name='files')
    fichier = models.FileField(upload_to='endpage/files/')

    class Meta:
        db_table = 'endpage_file'
        verbose_name = 'Fichier de page de fin'
        verbose_name_plural = 'Fichiers de pages de fin'

class Video(models.Model):
    end_page = models.ForeignKey(EndPage, on_delete=models.CASCADE, related_name="video")
    emplacement = models.CharField(max_length=200)
    audio_file = models.FileField(upload_to='endpage/video')
    context = models.TextField(null=True)
    
    created_at = models.DateTimeField(default=default_created_at)
    
    def __str__(self):
        return self.emplacement
    
    class Meta:
        db_table = 'videoendpage'

class Avatar(models.Model):
    mode = models.CharField(max_length=100,choices=[(x,x)for x in ['PRO','RELAX']], default='RELAX')
    sexe = models.CharField(max_length=100, choices=[(x, x.lower().capitalize()) for x in ['FEMININ', 'MASCULIN']])
    pseudo = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='avatar')
    
    class Meta:
        db_table = 'avatar'

class Scenario(models.Model):
    end_page = models.OneToOneField(EndPage, on_delete=models.CASCADE, related_name="scenario")
    context = models.TextField(null=True)
    avatar = models.OneToOneField(Avatar, on_delete=models.CASCADE, related_name='scenario')
    
    def __str__(self):
        return self.context or "No context"
    
    class Meta:
        db_table = "scenarioendpage"

class Scene(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, related_name='scenes')
    texte = models.TextField()
    action = models.CharField(max_length=100, choices=[(x, x.lower().capitalize()) for x in ['ANGRY', 'CRYING', 'SAD', 'HAPPY', 'IDLE', 'REJECTED', 'THANKFUL', 'STAMPING', 'PUNCHING', 'ENUMERATING']])
    audio_base64 = models.TextField(null=True)
    
    class Meta:
        db_table = 'sceneendpage'