from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, Chapter

# ----------------- User Serializer -----------------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "password"]

    def create(self, validated_data):
        # Use create_user to hash the password properly
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"]
        )
        return user

# ----------------- Note Serializer (for Users) -----------------
class NoteSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    chapters = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "author_username", "genre", "chapters", "is_deleted", "create_at"]
        read_only_fields = ["author", "is_deleted", "create_at", "chapters"]

    def get_chapters(self, obj):
        return ChapterSerializer(obj.chapters.order_by("chapter_number"), many=True).data

# ----------------- Admin Note Serializer -----------------
class AdminNoteSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    chapters = serializers.SerializerMethodField(read_only=True)  
    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "author_username", "genre", "is_deleted", "create_at", "chapters"]
        read_only_fields = ["create_at", "chapters"]

    def get_chapters(self, obj):
        from .serializers import ChapterSerializer
        return ChapterSerializer(obj.chapters.order_by("chapter_number"), many=True).data

# ----------------- Chapter Serializer -----------------
class ChapterSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Chapter
        fields = ["id", "story", "chapter_number", "title", "content", "created_at"]
        read_only_fields = ["story", "chapter_number", "created_at"]

    