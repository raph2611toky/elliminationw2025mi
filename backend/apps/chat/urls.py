from django.urls import path
from apps.chat.views import (
    ConversationCreateView,
    ConversationListView,
    ConversationDetailView,
    MessageDeleteView,
    ConversationDeleteView,
    ConversationUpdatetitreView,
)

urlpatterns = [
    path('conversations/create/', ConversationCreateView.as_view(), name='conversation-create'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<uuid:conversation_id>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('messages/<uuid:message_id>/delete/', MessageDeleteView.as_view(), name='message-delete'),
    path('conversations/<uuid:conversation_id>/delete/', ConversationDeleteView.as_view(), name='conversation-delete'),
    path('conversations/<uuid:conversation_id>/update-title/', ConversationUpdatetitreView.as_view(), name='conversation-update-title'),
]