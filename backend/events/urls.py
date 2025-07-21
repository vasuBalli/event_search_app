from django.urls import path
from .views import EventSearchView

urlpatterns = [
    path('search/', EventSearchView.as_view()),
]
