from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.conf import settings

from apps.user.models import User

from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import PasswordField

from uuid import uuid4
# from apps.aventure.models import Avatar
# from apps.aventure.serializers import AvatarSerializer

class UserSerializer(serializers.ModelSerializer):
    profile_url = serializers.SerializerMethodField()
    # avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'profile_url','is_active']
        
    def get_profile_url(self, obj):
        return f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.profile}' if obj.profile else None

    
    # def get_avatar(self, obj):
    #     if not obj.is_staff and not obj.is_superuser:
    #         try:
    #             avatar = obj.avatar
    #             return AvatarSerializer(avatar).data
    #         except Avatar.DoesNotExist:
    #             return None
    #     return None
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = PasswordField()
    
    def validate(self, attrs):
        users = authenticate(**attrs)
        if not users:
            raise AuthenticationFailed()
        users_logged = User.objects.get(id=users.id)
        users_logged.is_active = True
        update_last_login(None, users_logged)
        users_logged.save()
        data = {}
        refresh = self.get_token(users_logged)
        data['access'] = str(refresh.access_token)
        data['name'] = users_logged.name
        return data
    
    def get_token(self, users):
        token = RefreshToken.for_user(users)
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    sexe = serializers.ChoiceField(choices=['MASCULIN', 'FEMININ', 'INCONNU'], required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'sexe']

    def validate(self, attrs):
        self.create(attrs)
        return attrs
    
    def create(self, validated_data):
        is_staff=False
        user = User.objects.create(
            name=validated_data['name'].capitalize(),
            email=validated_data['email'],
            is_superuser=False,
            is_staff=is_staff,
            sexe=validated_data['sexe'],
        )
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        # Avatar.objects.create(
        #     user=user,
        #     pseudo=user.name+'-'+str(user.id),
        #     sexe=sexe,
        #     peau_couleur='#544',
        #     cheveux_couleur='#000',
        #     cheveux_intensite=1.0,
        #     cheveux_format='NORMAL',
        #     cheveux_type='LISSE',
        #     vetement_couleur='#000',
        #     vetement_type='LONGUE',
        #     taille=1.80
        # )
        user_created = User.objects.get(id=user.id)
        data = {
            'email': user_created.email
        }
        return data