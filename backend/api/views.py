from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Note, Chapter
from .serializers import (
    UserSerializer, 
    NoteSerializer, 
    AdminNoteSerializer, 
    ChapterSerializer
)
from .token_serializers import MyTokenObtainPairSerializer

# ----------------- Admin Token -----------------
class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        user = User.objects.filter(username=username, is_staff=True).first()
        if not user:
            return Response({"detail": "Not an admin"}, status=403)
        return super().post(request, *args, **kwargs)


# ----------------- Admin Users -----------------
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]


# ----------------- Admin User Stories -----------------
class AdminUserStoriesView(generics.ListAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Note.objects.filter(author_id=user_id, is_deleted=False)


# ----------------- Admin Deleted Stories -----------------
class AdminDeletedStoriesView(generics.ListAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Note.objects.filter(author_id=user_id, is_deleted=True)
        return Note.objects.filter(is_deleted=True)


# ----------------- Admin Story Actions -----------------
class AdminEditStoryView(generics.UpdateAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.all()

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True  # ADD THIS LINE
        return self.update(request, *args, **kwargs)



class AdminSoftDeleteStoryView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk):
        try:
            story = Note.objects.get(pk=pk, is_deleted=False)
            story.is_deleted = True
            story.save()
            return Response({"message": "Story deleted"})
        except Note.DoesNotExist:
            return Response({"error": "Story not found"}, status=404)


class AdminRestoreStoryView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk):
        try:
            # Make sure the object exists and is "deleted"
            story = Note.objects.get(pk=pk, is_deleted=True)
            story.is_deleted = False
            story.save()
            return Response({"message": "Story restored successfully"})
        except Note.DoesNotExist:
            return Response({"error": "Story not found"}, status=status.HTTP_404_NOT_FOUND)



class AdminPermanentDeleteStoryView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, pk):
        try:
            story = Note.objects.get(pk=pk, is_deleted=True)
            story.delete()
            return Response({"message": "Story permanently deleted"})
        except Note.DoesNotExist:
            return Response({"error": "Story not found"}, status=404)

# ----------------- User Notes / Stories -----------------
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class EditNote(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def delete(self, request, *args, **kwargs):
        note = self.get_object()
        note.is_deleted = True
        note.save()
        return Response(status=204)


# ----------------- User Recycle Bin -----------------
class UserDeletedNotesView(generics.ListAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_deleted=True)


class UserRestoreNoteView(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_deleted=True)

    def patch(self, request, *args, **kwargs):
        note = self.get_object()
        note.is_deleted = False
        note.save()
        return Response({"detail": "Note restored"}, status=status.HTTP_200_OK)


class UserPermanentDeleteNoteView(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_deleted=True)


# ----------------- User Creation -----------------
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# ----------------- Chapters -----------------
    
class ChapterListCreateView(generics.ListCreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]  

    def get_queryset(self):
        story_id = self.request.query_params.get("story")
        if story_id:
            return Chapter.objects.filter(story_id=story_id).order_by("chapter_number")
        return Chapter.objects.all()



class ChapterCreateView(generics.CreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        story_id = self.request.data.get("story")
        story = Note.objects.get(id=story_id)

        last_chapter = story.chapters.order_by("-chapter_number").first()
        chapter_number = 1 if not last_chapter else last_chapter.chapter_number + 1

        default_title = f"Chapter {chapter_number}"
        default_content = ""

        serializer.save(
            story=story,
            chapter_number=chapter_number,
            title=self.request.data.get("title", default_title),
            content=self.request.data.get("content", default_content)
    )



class ChapterEditView(generics.UpdateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        
        # Admin can edit ALL chapters
        if user.is_staff:
            return Chapter.objects.all()
        
        # normal users only their own
        return Chapter.objects.filter(story__author=user)



class ChapterDeleteView(generics.DestroyAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Chapter.objects.all()

        return Chapter.objects.filter(story__author=user)

