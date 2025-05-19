from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse, path
from django.utils.html import format_html
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from apps.user.models import User
from django.conf import settings

class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_active', 'is_staff', 'profile_url', 'actions_column')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('name', 'email')
    ordering = ('name',)

    def profile_url(self, obj):
        if obj.profile:
            p_url = f'{settings.BASE_URL}{settings.MEDIA_URL}{obj.profile}'
            return mark_safe(f'<a href="{p_url}" target="_blank"><img src="{p_url}" width="50" height="50"></a>')
        return 'Aucune image'
    profile_url.short_description = 'Photo de profil'

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        toggle_url = reverse('admin:user_user_toggle_active', args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a> '
            '<button class="button toggle-button {}" title="{}" onclick="toggleActive({})"><i class="fas {}"></i></button>',
            edit_url,
            delete_url,
            'active' if obj.is_active else 'inactive',
            'Désactiver' if obj.is_active else 'Activer',
            obj.pk,
            'fa-check' if obj.is_active else 'fa-times'
        )
    actions_column.short_description = 'Actions'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:user_id>/toggle_active/', self.admin_site.admin_view(self.toggle_active_view), name='user_user_toggle_active'),
        ]
        return custom_urls + urls

    def toggle_active_view(self, request, user_id):
        user = self.get_object(request, user_id)
        if user:
            user.is_active = not user.is_active
            user.save()
            messages.success(request, f"Utilisateur {user.name} {'activé' if user.is_active else 'désactivé'}.")
        return HttpResponseRedirect(reverse('admin:user_user_changelist'))

# class GroupAdmin(BaseGroupAdmin):
#     class Meta:
#         verbose_name = 'Groupe'
#         verbose_name_plural = 'Groupes'

# class PermissionAdmin(admin.ModelAdmin):
#     list_display = ('name', 'codename', 'content_type')
#     list_filter = ('content_type',)
#     search_fields = ('name', 'codename')
#     ordering = ('name',)

#     class Meta:
#         verbose_name = 'Permission'
#         verbose_name_plural = 'Permissions'

admin.site.register(User, UserAdmin)
# admin.site.register(Group, GroupAdmin)
# admin.site.register(Permission, PermissionAdmin)