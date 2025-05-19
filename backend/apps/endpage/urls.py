from django.urls import path
from .views import (
    EndPageListView, EndPageDetailView, EndPageCreateView, EndPageUpdateView, EndPageDeleteView,
    VideoListView, VideoCreateView, VideoDeleteView,
    ScenarioListView, ScenarioCreateView, ScenarioDeleteView,
    SceneListView, SceneCreateView, SceneDeleteView,
    EndPageReactionView, TopReactionsView, TopTotalReactionsView,
)

urlpatterns = [
    path('endpage/', EndPageListView.as_view(), name='endpage-list'),
    path('endpage/<int:end_page_id>/details/', EndPageDetailView.as_view(), name='endpage-detail'),
    path('endpage/create/', EndPageCreateView.as_view(), name='endpage-create'),
    path('endpage/<int:end_page_id>/update/', EndPageUpdateView.as_view(), name='endpage-update'),
    path('endpage/<int:end_page_id>/delete/', EndPageDeleteView.as_view(), name='endpage-delete'),
    path('endpage/reactions/', EndPageReactionView.as_view(), name='endpage-reaction'),
    path('top-reactions/', TopReactionsView.as_view(), name='top-reactions'),
    path('top-total-reactions/', TopTotalReactionsView.as_view(), name='top-total-reactions'),

    path('endpage/<int:end_page_id>/videos/', VideoListView.as_view(), name='video-list'),
    path('endpage/<int:end_page_id>/videos/create/', VideoCreateView.as_view(), name='video-create'),
    path('endpage/videos/<int:video_id>/delete/', VideoDeleteView.as_view(), name='video-delete'),

    path('endpage/<int:end_page_id>/scenarios/', ScenarioListView.as_view(), name='scenario-list'),
    path('endpage/<int:end_page_id>/scenarios/create/', ScenarioCreateView.as_view(), name='scenario-create'),
    path('endpage/scenarios/<int:scenario_id>/delete/', ScenarioDeleteView.as_view(), name='scenario-delete'),

    path('endpage/scenarios/<int:scenario_id>/scenes/', SceneListView.as_view(), name='scene-list'),
    path('endpage/scenarios/<int:scenario_id>/scenes/create/', SceneCreateView.as_view(), name='scene-create'),
    path('endpage/scenes/<int:scene_id>/delete/', SceneDeleteView.as_view(), name='scene-delete'),
]