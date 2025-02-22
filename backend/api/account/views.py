from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponseRedirect
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import exchange_code_for_token, GetUserInfoFromProvider
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer
import json
from .permissions import IsDeveloper 
from account.models import CustomUser
from django.contrib.auth.models import AnonymousUser
from friendship.models import FriendshipRequest
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate
from django.utils.timezone import now
from datetime import timedelta
from .utils import generate_otp, send_otp_email
from .serializers import UserProfileUpdateSerializer
from django.http import Http404
from friendship.models import Friend
from django.shortcuts import get_object_or_404
# from django.http import HttpeResponse
# from django.views.decorators.csrf import csrf_exempt
import os

# @csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    # print("register_user===========POST", request.data)
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        # print("good trip============")
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    data = json.dumps(serializer.errors)
    # print("bad trip============", data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def custom_token_obtain_pair(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    otp = request.data.get('otp', None)

    print("username: ", username)
    print("password: ", password)
    print("otp: ", otp)

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)
    useremail = user.email
    
    # bool = True
    # if(bool):
    if user.is_2fa_enabled:
        if not otp:
            generate_otp(user)
            send_otp_email(user)
            bool = False
            return Response({"message": f"OTP sent to your email {useremail}, Please provide it to complete login."}, status=status.HTTP_200_OK)
        else:
            if user.otp_created_at + timedelta(minutes=10) < now():
                return Response({"error": "OTP has expired. Please request a new one by trying to login again."}, status=status.HTTP_410_GONE)
            if not user.otp_code or user.otp_code != otp:
                print("code didnt match", user.otp_code, otp)
                return Response({"error": "Invalid OTP provided."}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
# @permission_classes([IsAuthenticated])
def get_user(request, id_or_name):
    """
    Retrieve user information by ID or username.
    If the request contains a number, it will search by ID.
    If it contains a string, it will search by username.
    """
    if id_or_name == "0":
        users = CustomUser.objects.all().values('id', 'username', 'email', 'photo', 'otp_code', 'otp_created_at', 'is_2fa_enabled')#, 'friends')
        return Response({'users': list(users)}, status=status.HTTP_200_OK)

    try:
        if id_or_name.isdigit():
            user = CustomUser.objects.get(id=int(id_or_name))
        else:
            user = CustomUser.objects.get(username=id_or_name)
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'photo': user.photo,
            'is_2fa_enabled':user.is_2fa_enabled,
            'otp_code':user.otp_code,
        }
        return Response(user_data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([AllowAny])
# @permission_classes([IsDeveloper])
def delete_user(request, id):
    print("delete_user===========DELETE", request.data)
    try:
        if(id == 0):
            print("Deleting all users")
            user = CustomUser.objects.all()
            user.delete();
            return Response({'message': 'All users deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        user = CustomUser.objects.get(id=id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)  


@api_view(["GET"])
@permission_classes([AllowAny])
def login_with_42(request):
    """
    Redirect to the 42 OAuth2 authorization page.
    """
    # print("login with intra:==============")
    client_id = settings.CLIENT_UID
    redirect_uri = settings.REDIRECT_URI
    authorization_url = f'{settings.AUTHORIZE_URL}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code'

    # print("client id: ", client_id)
    # print("redirectUrl_url: ", redirect_uri)
    # print("authorization url: ", authorization_url)
    # requestingIntraApi = reques
    response = Response({"redirectUrl": authorization_url})
    # response.set_cookie('12345678', 'hello')
    return response




@api_view(["GET"])
@permission_classes([AllowAny])
def callback_from_42(request):
    print("Received callback from OAuth provider...=========================================")
    code = request.GET.get('code')
    token_response = exchange_code_for_token(code)
    access_token = token_response.data['access_token']

    user_response = GetUserInfoFromProvider(access_token)
    if not user_response or not user_response.data:
        return Response({"error": "Failed to fetch user information"}, status=400)
    response_data = user_response.data

    email = response_data['email']
    intra_id = response_data['id']
    photo = response_data['photo']
    username = response_data['username']

    response = HttpResponseRedirect(f"https://{settings.MACHINE_URL}/bridg")

    # response = redirect("https://localhost/bridg")

    response.set_cookie('email', email)
    response.set_cookie('username', username)
    response.set_cookie('photo', photo)

    user = CustomUser.objects.filter(email=email).first()
    user2 = CustomUser.objects.filter(username=username).first()

    if user and user2:
        if user.id != user2.id:
            print("hhhhhhhh1")
            user2.delete()
            user.photo = photo
            user.username = username
            user.save()
        else:
            print("hhhhhhhh2")
            print("hello")
            user.photo = photo
            user.save()
    elif user and not user2:
        print("hhhhhhhh3")
        user.photo = photo
        user.username = username
        user.save()
    elif user2 and not user:
        print("hhhhhhhh4")
        user2.delete()
        user = CustomUser.objects.create(
            id=intra_id, 
            email=email,
            username=username,
            photo=photo
        )
        user.set_unusable_password()  # Disable regular login unless a password is set
        user.save()
        # user2.photo = photo
        # user2.username = username
        # user2.save()
    else:
        print("hhhhhhhh5")
        user = CustomUser.objects.create(
            id=intra_id, 
            email=email,
            username=username,
            photo=photo
        )
        user.set_unusable_password()  # Disable regular login unless a password is set
        user.save()

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response.set_cookie('access_token', access_token)
    # response.set_cookie('access_token', access_token, httponly=True, path='/')
    response.set_cookie('refresh_token', refresh_token)
    return response




#for debugging
@api_view(["GET"])
@permission_classes([AllowAny])
def endpoint(request):  
    # response = redirect("http://localhost:443/")
    print("+++++++++++++++++++++++++++", request.COOKIES.get("access_token", ''))
    response = Response({"message": "Hello, world!"})
    # response.set_cookie('access_token', 'hello')
    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def logouthttponly(request):
    # access = request.COOKIES.get('access_token')
    access = RefreshToken(request.access_token)
    access.blacklist()
    response = Response({"message": "Logged out successfully"})
    # response.delete_cookie('access_token')
    return response




#  curl -X POST http://127.0.0.1:8000/api/friend/add/ \                                                                                                                                                      ─╯
# -H "Authorization: Bearer fes" \
# -H "Content-Type: application/json" \

# -d '{"to_user": "1"}'

@api_view(['POST'])
# @permission_classes([AllowAny])
@permission_classes([IsAuthenticated])
def add_friend(request):
    to_user_id = request.data.get('to_user')
    
    if not to_user_id:
        return Response({"error": "'to_user' field is required."}, status=status.HTTP_400_BAD_REQUEST)

    if not str(to_user_id).isdigit():
        return Response({"error": "'to_user' must be a numeric value."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        to_user = get_object_or_404(CustomUser, id=to_user_id)
    except Http404:
        return Response({"error": "user not found."}, status=status.HTTP_404_NOT_FOUND)   
    try:
        Friend.objects.add_friend(request.user, to_user)
        return Response({"message": "Friend request sent."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


#  curl http://127.0.0.1:8000/api/friend/list_friends_request/ \      
# -H "Authorization: Bearer eyJ

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_incoming_requests(request):
    incoming_requests = Friend.objects.unrejected_requests(user=request.user)

    requests_list = []
    for fr in incoming_requests:
        friend_request_data = {
            "id": fr.id, 
            "from_user": fr.from_user.username, 
            "from_user_id": fr.from_user.id, 
            "from_user_photo": fr.from_user.photo
        }
        requests_list.append(friend_request_data)
    return Response({"incoming_requests": requests_list}, status=status.HTTP_200_OK)




# curl -X POST http://127.0.0.1:8000/api/friend/respond/ \
# -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
# -H "Content-Type: application/json" \
# -d '{"request_id": 2, "action": "accept"}'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_friend_request(request):
    request_id = request.data.get('request_id')
    action = request.data.get('action') 
    
    if not request_id or not action:
        return Response({"error": "'request_id' and 'action' fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        friend_request = FriendshipRequest.objects.get(id=request_id, to_user=request.user)
    except FriendshipRequest.DoesNotExist:
        return Response({"error": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)
    
    if action == 'accept':
        friend_request.accept()
        return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
    elif action == 'reject':
        friend_request.reject()
        return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid action. Use 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)


# ─ curl http://127.0.0.1:8000/api/friend/list_sent_requests/ \                                                                                                                                                                                                                                                        ─╯
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1NTIwMjQzLCJpYXQiOjE3MzU1MTEzMDUsImp0aSI6IjU0NTIzNTdmMGYzMjQwZjc4YjY3OTg5ZDE1OTAxNDI1IiwidXNlcl9pZCI6Mn0.0AaznhwMHKOCk7Ae4-CpcNnMXJeOTnCY1574EVwD478"
# {"sent_requests":[{"id":4,"message":"","created":"2024-12-29T22:30:57.483701Z","rejected":null,"viewed":null,"from_user":2,"to_user":109746},{"id":5,"message":"","created":"2024-12-30T00:01:32.058163Z","rejected":null,"viewed":null,"from_user":2,"to_user":4}]}%


from .serializers import FriendshipRequestSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_sent_requests(request):

    list_request = Friend.objects.sent_requests(user=request.user)
    for request in list_request:
        print("=======Request ID: ", request.id)
        print("=======From User: ", request.from_user)
        print("=======To User: ", request.to_user)
        print("=======: ", request.created)
    
    serialized_requests = FriendshipRequestSerializer(list_request, many=True)

    return Response({"sent_requests": serialized_requests.data}, status=status.HTTP_200_OK)
    # return Response({"sent_requests": "hi"}, status=status.HTTP_200_OK)


#  curl  http://127.0.0.1:8000/api/friend/get_friends/ \                                                                                                                                                                         ─╯
# -H "Authorization: Bearer eyJh

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    friend_list = []
    if isinstance(request.user, AnonymousUser):
        return Response({"error": "User not authenticated."}, status=401)
    
    friends = Friend.objects.friends(request.user)

    for friend in friends:
        friend_data = {
            "id": friend.id,
            "username": friend.username,
            "photo": friend.photo
        }
        friend_list.append(friend_data)

    # if not friend_list:
    #     return Response({"friend_list emty"}, status=status.HTTP_204_NO_CONTENT)
    return Response({"friends": friend_list}, status=status.HTTP_200_OK)


# curl -X POST http://127.0.0.1:8000/api/friend/remove_friend/ \
# -H "Authorization: Bearer " \
# -H "Content-Type: application/json" \
# -d '{"friend_id": 4}'
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    friend_id = request.data.get("friend_id")
    
    if not friend_id:
        return Response({"error": "'friend_id' is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = get_user_model()
        friend = user.objects.get(id=friend_id)
    except user.DoesNotExist:
        return Response({"error": "Friend not found."}, status=status.HTTP_404_NOT_FOUND)

    if not Friend.objects.are_friends(request.user, friend):
        return Response({"error": "You are not friends with this user."}, status=status.HTTP_400_BAD_REQUEST)

    Friend.objects.remove_friend(request.user, friend)
    return Response({"message": "Friend removed successfully."}, status=status.HTTP_200_OK)


from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from uuid import uuid4

from django.conf.urls.static import static


#  curl -X PATCH http://127.0.0.1:8000/api/update/profile/ \                                                    ─╯
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1MzczMTMzLCJpYXQiOjE3MzUzNjU0MzcsImp0aSI6ImYxOWFmYzVkMjMzNDRiMzg5YTgyMzBmODUwN2I5NDIwIiwidXNlcl9pZCI6Mn0.RGuHD3A9_sf5hDq9aRPGkZSfEQkOABNPRHeF1BV5DGg" \
# -F "photo=@/Users/ybourais/Desktop/.Desktop/ft_transcendence/frontend/front/images/new.jpgff" \
# -F "username=yousseff"


#  curl -v -X PATCH http://127.0.0.1:8000/api/update/profile/ \                                                 ─╯
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1Mzc3NzgwLCJpYXQiOjE3MzUzNjk4MTksImp0aSI6IjJlOTViYTVjZjBkZDRlODI5MmRjNDY5YTJlMDg5YmI1IiwidXNlcl9pZCI6Mn0.2ahC1vXC9n-8xif0SEBzt4g2lpAI0aGgAO1qYqHYigA" \
# -H "Content-Type: application/json" \
# -d '{
#   "username": "strong",
#   "photo": "https://i.etsystatic.com/16060308/r/il/c273c1/5722625120/il_570xN.5722625120_6bv0.jpg"
# }'
#

@api_view(['PATCH'])
@permission_classes([IsAuthenticated]) 
def update_profile(request):
    user = request.user
    # print("user_id========================:", user.id)
    # print("user body: ", request.body)
    if(user.id > 100):
       return Response({"message": "intra Users cant update profile!"}, status=status.HTTP_200_OK) 

    allowed_fields = {'username', 'email', 'password', 'repeat_password', 'is_2fa_enabled', 'photo'} 


    # print("request body:::::", request.body)
    if not request.body:
        return Response({"error": "Request body is empty."}, status=status.HTTP_400_BAD_REQUEST)


    invalid_fields = set(request.data.keys()) - allowed_fields
    # print("request, ", request)
    # print("request data: ", request.data.keys())
    # print("request data value: ", request.data)
    if invalid_fields:
        return Response(
            {"error": f"Invalid fields: {', '.join(invalid_fields)} are not allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )
    serializer = UserProfileUpdateSerializer(instance=user, data=request.data, partial=True)

    photo_value = None
    file = request.FILES.get('photo')
    url = request.data.get('photo')
    # print("file", file)

    # print("static url for image:::: ", static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
    if file:
        print("file")
        if not file.name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            return Response({"error": "Invalid photo file format."}, status=status.HTTP_400_BAD_REQUEST)

        unique_filename = f"profile_pics/{uuid4().hex}_{file.name}"
        file_path = default_storage.save(unique_filename, ContentFile(file.read()))
        photo_value = f"/media/{file_path}"

    elif url:
        print("url")
        validator = URLValidator()
        try:
            validator(url)
        except ValidationError:
            return Response({"error": "Invalid photo URL."}, status=status.HTTP_400_BAD_REQUEST)

        if not url.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            return Response({"error": "Photo URL must point to an image."}, status=status.HTTP_400_BAD_REQUEST)

        photo_value = url

    if photo_value:
        serializer.initial_data['photo'] = photo_value

    if serializer.is_valid():
        print("saaaaaaaaaaaaave")
        serializer.save()
        return Response({"message": "Profile updated successfully!", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


