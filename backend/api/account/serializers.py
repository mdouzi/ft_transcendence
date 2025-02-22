
from rest_framework import serializers
from django.utils.html import escape
from account.models import CustomUser
import bleach
from django.core.validators import RegexValidator, EmailValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}, #not included in the response
        }
    def validate_email(self, value):
        # print("value", value)
        value = bleach.clean(value)
        # print("value 2", value)
        EmailValidator()(value)
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        value = bleach.clean(value) 
        validator = RegexValidator(
            regex=r'^[a-zA-Z0-9_]+$',
            message="Username must only contain letters, numbers, and underscores.",
            code='invalid_username'
        )
        validator(value)
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        try:
            validate_password(password)
        except serializers.ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        attrs['password'] = bleach.clean(attrs['password']) 
        attrs['password2'] = bleach.clean(attrs['password2'])

        print("password: ", attrs['password'])
        print("password2:", attrs['password2'])
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  
        user = CustomUser.objects.create_user(**validated_data) 
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username', '')
        # password = attrs.get('password', '')
        username = bleach.clean(username)
        attrs['username'] = username
        data = super().validate(attrs)
        return data



from friendship.models import Friend, FriendshipRequest

class FriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = '__all__'

from django.contrib.auth.hashers import make_password

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'photo', 'is_2fa_enabled', 'password', 'repeat_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        value = bleach.clean(value)
        EmailValidator()(value)
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        value = bleach.clean(value)
        validator = RegexValidator(
            regex=r'^[a-zA-Z0-9_]+$',
            message="Username must only contain letters, numbers, and underscores.",
            code='invalid_username'
        )
        validator(value)
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        repeat_password = attrs.get('repeat_password')

        print("password: ", password)
        print("password2:", repeat_password)

        if password:
            if not repeat_password:
                raise serializers.ValidationError("repeat_password field must be provided.")
        if repeat_password:
            if not password:
                raise serializers.ValidationError("Passord field must be provided.")
        if password and repeat_password:
            # try:
            #     validate_password(password)
            # except serializers.ValidationError as e:
            #     raise serializers.ValidationError({"password": list(e.messages)})
            if password != repeat_password:
                raise serializers.ValidationError("Passwords do not match.")
            attrs['password'] = bleach.clean(password)
        return attrs

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
            validated_data.pop('repeat_password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
