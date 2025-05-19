from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse, path
from django.utils.html import format_html
from django.http import HttpResponseRedirect
from django.contrib import messages
from .models import Quizz, Question, Reponse, ReponseQuizz, ReponseUnitaire

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ('contenu', 'creer_le')
    readonly_fields = ('creer_le',)

class ReponseInline(admin.TabularInline):
    model = Reponse
    extra = 1
    fields = ('contenu', 'note', 'creer_le')
    readonly_fields = ('creer_le',)

class ReponseUnitaireInline(admin.TabularInline):
    model = ReponseUnitaire
    extra = 0
    fields = ('question', 'note_obtenue', 'creer_le')
    readonly_fields = ('question', 'note_obtenue', 'creer_le')
    can_delete = False

    def get_reponses_choisies(self, obj):
        return ", ".join([r.contenu for r in obj.reponses_choisies.all()])

    get_reponses_choisies.short_description = 'Réponses choisies'

class QuizzAdmin(admin.ModelAdmin):
    list_display = ('nom', 'categorie', 'creer_le', 'creer_par', 'nombre_questions', 'actions_column')
    list_filter = ('categorie', 'creer_le', 'creer_par')
    search_fields = ('nom', 'categorie')
    ordering = ('nom',)
    inlines = [QuestionInline]

    def nombre_questions(self, obj):
        return obj.questions.count()
    nombre_questions.short_description = 'Nb. Questions'

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a>',
            edit_url,
            delete_url
        )
    actions_column.short_description = 'Actions'

admin.site.register(Quizz, QuizzAdmin)

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quizz', 'contenu_tronque', 'creer_le', 'nombre_reponses', 'actions_column')
    list_filter = ('quizz', 'creer_le')
    search_fields = ('contenu', 'quizz__nom')
    ordering = ('quizz', 'creer_le')
    inlines = [ReponseInline]

    def contenu_tronque(self, obj):
        return obj.contenu[:50] + ('...' if len(obj.contenu) > 50 else '')
    contenu_tronque.short_description = 'Contenu'

    def nombre_reponses(self, obj):
        return obj.reponses.count()
    nombre_reponses.short_description = 'Nb. Réponses'

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a>',
            edit_url,
            delete_url
        )
    actions_column.short_description = 'Actions'

admin.site.register(Question, QuestionAdmin)

class ReponseAdmin(admin.ModelAdmin):
    list_display = ('question', 'contenu_tronque', 'note', 'creer_le', 'actions_column')
    list_filter = ('question__quizz', 'creer_le')
    search_fields = ('contenu', 'question__contenu')
    ordering = ('question', 'creer_le')

    def contenu_tronque(self, obj):
        return obj.contenu[:50] + ('...' if len(obj.contenu) > 50 else '')
    contenu_tronque.short_description = 'Contenu'

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a>',
            edit_url,
            delete_url
        )
    actions_column.short_description = 'Actions'

admin.site.register(Reponse, ReponseAdmin)

class ReponseQuizzAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'quizz', 'derniere_moyenne', 'creer_le', 'modifier_le', 'actions_column')
    list_filter = ('quizz', 'creer_le', 'modifier_le')
    search_fields = ('utilisateur__name', 'quizz__nom')
    ordering = ('quizz', 'utilisateur')
    inlines = [ReponseUnitaireInline]

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a>',
            edit_url,
            delete_url
        )
    actions_column.short_description = 'Actions'

admin.site.register(ReponseQuizz, ReponseQuizzAdmin)

class ReponseUnitaireAdmin(admin.ModelAdmin):
    list_display = ('reponse_quizz', 'question', 'note_obtenue', 'reponses_choisies_list', 'creer_le', 'actions_column')
    list_filter = ('reponse_quizz__quizz', 'creer_le')
    search_fields = ('reponse_quizz__utilisateur__name', 'question__contenu')
    ordering = ('reponse_quizz', 'question')

    def reponses_choisies_list(self, obj):
        return ", ".join([r.contenu[:30] for r in obj.reponses_choisies.all()])
    reponses_choisies_list.short_description = 'Réponses choisies'

    def actions_column(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        delete_url = reverse('admin:%s_%s_delete' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])

        return format_html(
            '<a href="{}" class="button edit-button" title="Modifier"><i class="fas fa-edit"></i></a> '
            '<a href="{}" class="button delete-button" title="Supprimer"><i class="fas fa-trash-alt"></i></a>',
            edit_url,
            delete_url
        )
    actions_column.short_description = 'Actions'

admin.site.register(ReponseUnitaire, ReponseUnitaireAdmin)