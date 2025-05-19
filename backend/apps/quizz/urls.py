from django.urls import path
from .views import QuizzListView, QuizzDetailView, SubmitQuizzView

urlpatterns = [
    path('quizzes/', QuizzListView.as_view(), name='quizz-list'),
    path('quizzes/<uuid:quizz_id>/', QuizzDetailView.as_view(), name='quizz-detail'),
    path('quizzes/soummettre/', SubmitQuizzView.as_view(), name='quizz-submit'),
]