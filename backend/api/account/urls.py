
from django.urls import path, include
from .views import  endpoint, get_friends, get_user, register_user, delete_user, login_with_42, callback_from_42 , custom_token_obtain_pair, logouthttponly, add_friend, get_friends, list_incoming_requests, remove_friend, respond_friend_request, remove_friend, update_profile , list_all_sent_requests
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [

    path('register/', register_user, name='register'),
    path('get/<str:id_or_name>/', get_user, name='get'),
    path('delete/<int:id>/', delete_user, name='delete'),

    path('token/', custom_token_obtain_pair, name='custom_token_obtain_pair'),   
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('auth/login/', login_with_42, name='login_with_42'),
    path('auth/callback/', callback_from_42, name='callback_from_42'),

    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

    path('token/blacklist2/', logouthttponly, name='token_blacklist2'),



    path('endpoint/', endpoint, name='endpoint'),

    path('friend/add/', add_friend, name='add_friend'),
    path('friend/list_friends_request/', list_incoming_requests, name='list_incoming_requests'),
    path('friend/get_friends/', get_friends, name='get_friends'),
    path('friend/respond_friend_request/', respond_friend_request, name='respond_friend_request'),
    path('friend/remove_friend/', remove_friend, name='remove_friend'),

    path('update/profile/', update_profile, name='update_profile'),


    path('friend/list_sent_requests/', list_all_sent_requests, name='list_all_sent_requests'),
]

