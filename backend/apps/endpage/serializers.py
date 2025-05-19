from rest_framework import serializers
from apps.user.serializers import UserSerializer
from apps.user.models import User
from apps.endpage.models import EndPage, EndPageImage, EndPageFile, Video, Scenario, Scene, Avatar
from django.conf import settings
from datetime import datetime
import os

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ['id', 'mode', 'sexe', 'pseudo']

class EndPageImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = EndPageImage
        fields = ['id', 'image', 'image_url']

    def get_image_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.image}' if obj.image else None

class EndPageFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = EndPageFile
        fields = ['id', 'fichier', 'file_url']

    def get_file_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.fichier}' if obj.fichier else None

class VideoSerializer(serializers.ModelSerializer):
    audio_file_url = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'end_page', 'emplacement', 'audio_file', 'audio_file_url', 'context', 'created_at']
        read_only_fields = ['id', 'created_at', 'audio_file_url']

    def get_audio_file_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.audio_file}' if obj.audio_file else None

    def validate_end_page(self, value):
        if not EndPage.objects.filter(id=value.id, user=self.context['request'].user).exists():
            raise serializers.ValidationError("Page de fin invalide ou non autorisée.")
        return value
    
    def get_created_at(self, obj):
        return datetime.strftime(obj.created_at, '%d-%m-%Y')

class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ['id', 'scenario', 'texte', 'action']
        read_only_fields = ['id']

    def validate_scenario(self, value):
        if not Scenario.objects.filter(id=value.id, end_page__user=self.context['request'].user).exists():
            raise serializers.ValidationError("Scénario invalide ou non autorisé.")
        return value

    def validate_action(self, value):
        valid_actions = [choice[0] for choice in Scene._meta.get_field('action').choices]
        if value not in valid_actions:
            raise serializers.ValidationError("Action invalide.")
        return value

class ScenarioSerializer(serializers.ModelSerializer):
    scenes = SceneSerializer(many=True, read_only=True)
    avatar = AvatarSerializer(read_only=True)

    class Meta:
        model = Scenario
        fields = ['id', 'end_page', 'context', 'scenes', 'avatar']
        read_only_fields = ['id']

    def validate_end_page(self, value):
        if not EndPage.objects.filter(id=value.id, user=self.context['request'].user).exists():
            raise serializers.ValidationError("Page de fin invalide ou non autorisée.")
        return value

class EndPageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_profile_url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()
    videos = serializers.SerializerMethodField()
    scenarios = serializers.SerializerMethodField()
    reaction_coeurs = serializers.SerializerMethodField()
    reaction_feux = serializers.SerializerMethodField()
    reaction_larmes = serializers.SerializerMethodField()
    reaction_applaudissements = serializers.SerializerMethodField()
    reaction_sourires = serializers.SerializerMethodField()
    reaction_chocs = serializers.SerializerMethodField()
    coeurs_count = serializers.SerializerMethodField()
    feux_count = serializers.SerializerMethodField()
    larmes_count = serializers.SerializerMethodField()
    applaudissements_count = serializers.SerializerMethodField()
    sourires_count = serializers.SerializerMethodField()
    chocs_count = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = EndPage
        fields = [
            'id', 'user', 'user_profile_url', 'titre', 'version_des_faits', 'resumer_des_faits', 'identifiant',
            'type', 'ton', 'expression', 'fin_voulue', 'perpective', 'couleur', 'police', 'taille',
            'mots_adieu', 'created_at', 'updated_at', 'reaction_coeurs', 'reaction_feux', 'reaction_larmes',
            'reaction_applaudissements', 'reaction_sourires', 'reaction_chocs', 'coeurs_count', 'feux_count',
            'larmes_count', 'applaudissements_count', 'sourires_count', 'chocs_count', 'images', 'files',
            'videos', 'scenarios','photo_url'
        ]
        read_only_fields = ['created_at', 'updated_at']
        
    
    def get_created_at(self, obj):
        return datetime.strftime(obj.created_at, '%d-%m-%Y')
    
    def get_updated_at(self, obj):
        return datetime.strftime(obj.updated_at, '%d-%m-%Y')

    def get_user_profile_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.user.profile}' if obj.user.profile else None

    def get_images(self, obj):
        images = EndPageImage.objects.filter(end_page=obj)
        return EndPageImageSerializer(images, many=True).data
    
    def get_photo_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.photo.url}' if obj.photo else None

    def get_files(self, obj):
        files = EndPageFile.objects.filter(end_page=obj)
        return EndPageFileSerializer(files, many=True).data

    def get_videos(self, obj):
        videos = Video.objects.filter(end_page=obj)
        return VideoSerializer(videos, many=True).data

    def get_scenarios(self, obj):
        scenarios = Scenario.objects.filter(end_page=obj)
        return ScenarioSerializer(scenarios, many=True).data

    def get_reaction_coeurs(self, obj):
        return UserSerializer(obj.reaction_coeurs.all(), many=True).data

    def get_reaction_feux(self, obj):
        return UserSerializer(obj.reaction_feux.all(), many=True).data

    def get_reaction_larmes(self, obj):
        return UserSerializer(obj.reaction_larmes.all(), many=True).data

    def get_reaction_applaudissements(self, obj):
        return UserSerializer(obj.reaction_applaudissements.all(), many=True).data

    def get_reaction_sourires(self, obj):
        return UserSerializer(obj.reaction_sourires.all(), many=True).data

    def get_reaction_chocs(self, obj):
        return UserSerializer(obj.reaction_chocs.all(), many=True).data

    def get_coeurs_count(self, obj):
        return obj.reaction_coeurs.count()

    def get_feux_count(self, obj):
        return obj.reaction_feux.count()

    def get_larmes_count(self, obj):
        return obj.reaction_larmes.count()

    def get_applaudissements_count(self, obj):
        return obj.reaction_applaudissements.count()

    def get_sourires_count(self, obj):
        return obj.reaction_sourires.count()

    def get_chocs_count(self, obj):
        return obj.reaction_chocs.count()

    def to_representation(self, instance):
        detail = self.context.get('detail', False)
        representation = super().to_representation(instance)
        representation['reactions'] = {
            'feux': representation.pop('feux_count'),
            'larmes': representation.pop('larmes_count'),
            'sourires': representation.pop('sourires_count'),
            'applaudissements': representation.pop('applaudissements_count')
        }
        if not detail:
            representation.pop('reaction_videos', None)
            representation.pop('reaction_scenarios', None)
            representation.pop('reaction_coeurs', None)
            representation.pop('reaction_chocs', None)
            representation.pop('chocs_count', None)
            representation.pop('coeurs_count', None)
            representation.pop('reaction_feux', None)
            representation.pop('reaction_larmes', None)
            representation.pop('reaction_sourires', None)
            representation.pop('reaction_applaudissements', None)
        audio_ton_emotion_url = self.get_audio_ton_emotion_url(instance.ton, instance.expression)
        if audio_ton_emotion_url is not None:
            representation['audio_ton_emotion_url'] = audio_ton_emotion_url
        return representation
    
    def get_audio_ton_emotion_url(self, ton, emotion):
        emotion = emotion.replace('è','e')
        audio_path = f'/media/endpage/audio/{ton.lower()}_{emotion.lower()}.mp3'
        if not os.path.exists(os.path.join(settings.BASE_DIR,audio_path)):
            audio_path = '/media/endpage/audio/default.mp3'
        return f'{settings.BASE_URL}{audio_path}'

    def validate_fin_voulue(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("La fin voulue ne peut pas être vide si fournie.")
        return value

class EndPageCreateSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(write_only=True, required=True,)
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False, allow_empty=True)
    files = serializers.ListField(child=serializers.FileField(), write_only=True, required=False, allow_empty=True)

    class Meta:
        model = EndPage
        fields = [
            'titre', 'version_des_faits', 'resumer_des_faits', 'type', 'ton', 'expression',
            'fin_voulue', 'perpective', 'couleur', 'police', 'taille', 'mots_adieu', 'images', 'files','photo'
        ]
        extra_kwargs = {
            'resumer_des_faits': {'required': False, 'allow_blank': True},
            'mots_adieu': {'required': False, 'allow_blank': True},
        }

    def validate_type(self, value):
        valid_types = [choice[0] for choice in EndPage.TYPE_CHOICES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Type invalide. Valeurs valides: {valid_types}")
        return value

    def validate_ton(self, value):
        valid_tons = [choice[0] for choice in EndPage.TON_CHOICES]
        if value not in valid_tons:
            raise serializers.ValidationError(f"Ton invalide. Valeurs valides: {valid_tons}")
        return value

    def validate_expression(self, value):
        valid_expressions = [choice[0] for choice in EndPage.EXPRESSION_CHOICES]
        if value not in valid_expressions:
            raise serializers.ValidationError(f"Expression invalide. Valeurs valides: {valid_expressions}")
        return value

    def validate_fin_voulue(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("La fin voulue ne peut pas être vide si fournie.")
        return value

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        files = validated_data.pop('files', [])
        end_page = EndPage.objects.create(user=self.context['request'].user, **validated_data)

        for image in images:
            EndPageImage.objects.create(end_page=end_page, image=image)
        for file in files:
            EndPageFile.objects.create(end_page=end_page, fichier=file)

        return end_page

class EndPageReactionSerializer(serializers.Serializer):
    reaction_type = serializers.ChoiceField(choices=[
        'coeurs', 'feux', 'larmes', 'applaudissements', 'sourires', 'chocs'
    ])
    action = serializers.ChoiceField(choices=['add', 'remove'])

    def validate(self, data):
        end_page_id = self.context['end_page_id']
        if not EndPage.objects.filter(id=end_page_id).exists():
            raise serializers.ValidationError("La page de fin spécifiée n'existe pas.")
        return data