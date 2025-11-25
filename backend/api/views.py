from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Note
from .serializers import UserSerializer, NoteSerializer, AdminNoteSerializer
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

# ----------------- Admin Users & Notes -----------------
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

class AdminUserNotesView(generics.ListAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Note.objects.filter(author_id=user_id, is_deleted=False)

class AdminDeletedNotesView(generics.ListAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Note.objects.filter(author_id=user_id, is_deleted=True)
        return Note.objects.filter(is_deleted=True)

# ----------------- Admin Note Actions -----------------
class AdminEditNoteView(generics.UpdateAPIView):
    serializer_class = AdminNoteSerializer
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.all()  # admin can edit any note

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class AdminSoftDeleteNoteView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk):
        try:
            note = Note.objects.get(pk=pk, is_deleted=False)
            note.is_deleted = True
            note.save()
            return Response({"message": "Note deleted"})
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=404)

class AdminRestoreNoteView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request, pk):
        try:
            note = Note.objects.get(pk=pk, is_deleted=True)
            note.is_deleted = False
            note.save()
            return Response({"message": "Note restored"})
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=404)

class AdminPermanentDeleteNoteView(APIView):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, pk):
        try:
            note = Note.objects.get(pk=pk, is_deleted=True)
            note.delete()
            return Response({"message": "Note permanently deleted"})
        except Note.DoesNotExist:
            return Response({"error": "Note not found"}, status=404)

# ----------------- User Notes -----------------
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user, is_deleted=False)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

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

class EditNote(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "pk"

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

# ----------------- User Recycling Bin -----------------
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

# ----------------- Create User -----------------
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
