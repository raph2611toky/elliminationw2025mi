from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count
from .models import EndPage, EndPageImage, EndPageFile, Video, Avatar, Scenario, Scene


# Inline pour EndPageImage
class EndPageImageInline(admin.TabularInline):
    model = EndPageImage
    extra = 1
    fields = ['image', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 150px; object-fit: contain;" />', obj.image.url)
        return "Aucune image"
    image_preview.short_description = "Aperçu"


# Inline pour EndPageFile
class EndPageFileInline(admin.TabularInline):
    model = EndPageFile
    extra = 1
    fields = ['fichier', 'file_url']
    readonly_fields = ['file_url']

    def file_url(self, obj):
        if obj.fichier:
            return format_html('<a href="{}" target="_blank">Télécharger</a>', obj.fichier.url)
        return "Aucun fichier"
    file_url.short_description = "URL du fichier"


# Inline pour Video
class VideoInline(admin.TabularInline):
    model = Video
    extra = 1
    fields = ['emplacement', 'audio_file', 'context', 'audio_file_url', 'created_at']
    readonly_fields = ['audio_file_url', 'created_at']

    def audio_file_url(self, obj):
        if obj.audio_file:
            return format_html('<a href="{}" target="_blank">Télécharger</a>', obj.audio_file.url)
        return "Aucun fichier"
    audio_file_url.short_description = "URL de l'audio"


# Inline pour Scene
class SceneInline(admin.TabularInline):
    model = Scene
    extra = 1
    fields = ['texte', 'action', 'audio_base64_preview']
    readonly_fields = ['audio_base64_preview']

    def audio_base64_preview(self, obj):
        if obj.audio_base64:
            return format_html('<span>Audio présent ({} premiers caractères: {})</span>', len(obj.audio_base64), obj.audio_base64[:20])
        return "Aucun audio"
    audio_base64_preview.short_description = "Aperçu audio"


# Admin pour Avatar
class AvatarAdmin(admin.ModelAdmin):
    list_display = ['id', 'pseudo', 'mode', 'sexe', 'scenario_link']
    list_filter = ['mode', 'sexe']
    search_fields = ['pseudo']
    readonly_fields = ['scenario_link']

    def scenario_link(self, obj):
        if hasattr(obj, 'scenario'):
            url = reverse('admin:endpage_scenario_change', args=[obj.scenario.id])
            return format_html('<a href="{}">{}</a>', url, obj.scenario)
        return "Aucun scénario"
    scenario_link.short_description = "Scénario associé"


# Admin pour EndPage
class EndPageAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'version_des_faits_summary', 'type', 'ton', 'expression',
        'fin_voulue_summary', 'couleur', 'police', 'taille', 'created_at', 'reaction_summary'
    ]
    list_filter = ['type', 'ton', 'expression', 'taille', 'created_at', 'user']
    search_fields = ['version_des_faits', 'fin_voulue', 'user__name', 'user__email']
    inlines = [EndPageImageInline, EndPageFileInline, VideoInline]
    readonly_fields = [
        'created_at', 'updated_at', 'reaction_summary',
        'reaction_coeurs', 'reaction_feux', 'reaction_larmes',
        'reaction_applaudissements', 'reaction_sourires', 'reaction_chocs'
    ]
    actions = ['reset_reactions', 'duplicate_endpage']
    list_per_page = 25

    def version_des_faits_summary(self, obj):
        return obj.version_des_faits[:50] + "..." if len(obj.version_des_faits) > 50 else obj.version_des_faits
    version_des_faits_summary.short_description = "Version des faits"

    def fin_voulue_summary(self, obj):
        return obj.fin_voulue[:50] + "..." if obj.fin_voulue and len(obj.fin_voulue) > 50 else obj.fin_voulue or "Non spécifié"
    fin_voulue_summary.short_description = "Fin voulue"

    def reaction_summary(self, obj):
        return format_html(
            "❤️: {} | 🔥: {} | 😢: {} | 👏: {} | 😊: {} | 😲: {}",
            obj.reaction_coeurs.count(),
            obj.reaction_feux.count(),
            obj.reaction_larmes.count(),
            obj.reaction_applaudissements.count(),
            obj.reaction_sourires.count(),
            obj.reaction_chocs.count()
        )
    reaction_summary.short_description = "Réactions"

    def reset_reactions(self, request, queryset):
        for endpage in queryset:
            endpage.reaction_coeurs.clear()
            endpage.reaction_feux.clear()
            endpage.reaction_larmes.clear()
            endpage.reaction_applaudissements.clear()
            endpage.reaction_sourires.clear()
            endpage.reaction_chocs.clear()
        self.message_user(request, f"Réactions réinitialisées pour {queryset.count()} pages de fin.")
    reset_reactions.short_description = "Réinitialiser toutes les réactions"

    def duplicate_endpage(self, request, queryset):
        for endpage in queryset:
            new_endpage = EndPage.objects.create(
                user=endpage.user,
                version_des_faits=endpage.version_des_faits + " (Copie)",
                type=endpage.type,
                ton=endpage.ton,
                expression=endpage.expression,
                fin_voulue=endpage.fin_voulue,
                couleur=endpage.couleur,
                police=endpage.police,
                taille=endpage.taille
            )
            # Dupliquer les images
            for img in endpage.images.all():
                EndPageImage.objects.create(end_page=new_endpage, image=img.image)
            # Dupliquer les fichiers
            for file in endpage.files.all():
                EndPageFile.objects.create(end_page=new_endpage, fichier=file.fichier)
            # Dupliquer les vidéos
            for video in endpage.video.all():
                Video.objects.create(
                    end_page=new_endpage,
                    emplacement=video.emplacement,
                    audio_file=video.audio_file,
                    context=video.context
                )
        self.message_user(request, f"{queryset.count()} pages de fin dupliquées avec succès.")
    duplicate_endpage.short_description = "Dupliquer les pages de fin"


# Admin pour EndPageImage
class EndPageImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'end_page_link', 'image', 'image_preview']
    list_filter = ['end_page__type', 'end_page__user']
    search_fields = ['end_page__version_des_faits', 'end_page__user__name']
    readonly_fields = ['image_preview']

    def end_page_link(self, obj):
        url = reverse('admin:endpage_endpage_change', args=[obj.end_page.id])
        return format_html('<a href="{}">{}</a>', url, obj.end_page)
    end_page_link.short_description = "Page de fin"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 150px; max-width: 150px; object-fit: contain;" />', obj.image.url)
        return "Aucune image"
    image_preview.short_description = "Aperçu"


# Admin pour EndPageFile
class EndPageFileAdmin(admin.ModelAdmin):
    list_display = ['id', 'end_page_link', 'fichier', 'file_url']
    list_filter = ['end_page__type', 'end_page__user']
    search_fields = ['end_page__version_des_faits', 'end_page__user__name']
    readonly_fields = ['file_url']

    def end_page_link(self, obj):
        url = reverse('admin:endpage_endpage_change', args=[obj.end_page.id])
        return format_html('<a href="{}">{}</a>', url, obj.end_page)
    end_page_link.short_description = "Page de fin"

    def file_url(self, obj):
        if obj.fichier:
            return format_html('<a href="{}" target="_blank">Télécharger</a>', obj.fichier.url)
        return "Aucun fichier"
    file_url.short_description = "URL du fichier"


# Admin pour Video
class VideoAdmin(admin.ModelAdmin):
    list_display = ['id', 'end_page_link', 'emplacement', 'context_summary', 'audio_file', 'audio_file_url', 'created_at']
    list_filter = ['end_page__type', 'end_page__user', 'created_at']
    search_fields = ['emplacement', 'context', 'end_page__version_des_faits']
    readonly_fields = ['audio_file_url', 'created_at']

    def end_page_link(self, obj):
        url = reverse('admin:endpage_endpage_change', args=[obj.end_page.id])
        return format_html('<a href="{}">{}</a>', url, obj.end_page)
    end_page_link.short_description = "Page de fin"
    
    def audio_preview(self, obj):
        if obj.audio_file:
            return format_html('<audio controls><source src="{}" type="audio/mpeg">Votre navigateur ne supporte pas l\'audio.</audio>', obj.audio_file.url)
        return "Aucun audio"
    audio_preview.short_description = "Lecture audio"

    def context_summary(self, obj):
        return obj.context[:50] + "..." if obj.context and len(obj.context) > 50 else obj.context or "Aucun contexte"
    context_summary.short_description = "Contexte"

    def audio_file_url(self, obj):
        if obj.audio_file:
            return format_html('<a href="{}" target="_blank">Télécharger</a>', obj.audio_file.url)
        return "Aucun fichier"
    audio_file_url.short_description = "URL de l'audio"


# Admin pour Scenario
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'end_page_link', 'avatar_pseudo', 'context_summary']
    list_filter = ['end_page__type', 'end_page__user']
    search_fields = ['context', 'end_page__version_des_faits', 'avatar__pseudo']
    inlines = [SceneInline]

    def end_page_link(self, obj):
        url = reverse('admin:endpage_endpage_change', args=[obj.end_page.id])
        return format_html('<a href="{}">{}</a>', url, obj.end_page)
    end_page_link.short_description = "Page de fin"

    def avatar_pseudo(self, obj):
        return obj.avatar.pseudo if obj.avatar else "Aucun avatar"
    avatar_pseudo.short_description = "Avatar"

    def context_summary(self, obj):
        return obj.context[:50] + "..." if obj.context and len(obj.context) > 50 else obj.context or "Aucun contexte"
    context_summary.short_description = "Contexte"


# Admin pour Scene
class SceneAdmin(admin.ModelAdmin):
    list_display = ['id', 'scenario_link', 'texte_summary', 'action', 'audio_base64_preview']
    list_filter = [ 'action', 'scenario__end_page__type', 'scenario__end_page__user']
    search_fields = ['texte', 'scenario__context', 'scenario__end_page__version_des_faits']
    readonly_fields = ['audio_base64_preview']

    def scenario_link(self, obj):
        url = reverse('admin:endpage_scenario_change', args=[obj.scenario.id])
        return format_html('<a href="{}">{}</a>', url, obj.scenario)
    scenario_link.short_description = "Scénario"

    def texte_summary(self, obj):
        return obj.texte[:50] + "..." if len(obj.texte) > 50 else obj.texte
    texte_summary.short_description = "Texte"

    def audio_base64_preview(self, obj):
        if obj.audio_base64:
            return format_html('<span>Audio présent ({} premiers caractères: {})</span>', len(obj.audio_base64), obj.audio_base64[:20])
        return "Aucun audio"
    audio_base64_preview.short_description = "Aperçu audio"


admin.site.register(EndPage, EndPageAdmin)
admin.site.register(EndPageImage, EndPageImageAdmin)
admin.site.register(EndPageFile, EndPageFileAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(Avatar, AvatarAdmin)
admin.site.register(Scenario, ScenarioAdmin)
admin.site.register(Scene, SceneAdmin)