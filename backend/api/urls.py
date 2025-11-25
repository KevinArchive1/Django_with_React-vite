from django.urls import path
from . import views

urlpatterns = [
    # User notes
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/edit/<int:pk>/", views.EditNote.as_view(), name="edit-note"),

    # User recycling bin
    path("notes/deleted/", views.UserDeletedNotesView.as_view(), name="user-deleted-notes"),
    path("notes/restore/<int:pk>/", views.UserRestoreNoteView.as_view(), name="user-restore-note"),
    path("notes/permanent-delete/<int:pk>/", views.UserPermanentDeleteNoteView.as_view(), name="user-permanent-delete-note"),

    # User creation
    path("users/create/", views.CreateUserView.as_view(), name="create-user"),

    # Admin token
    path("admin/token/", views.AdminTokenObtainPairView.as_view(), name="admin_token_obtain_pair"),

    # Admin users & notes
    path("admin/users/", views.AdminUserListView.as_view(), name="admin_user_list"),
    path("admin/users/<int:user_id>/notes/", views.AdminUserNotesView.as_view(), name="admin_user_notes"),

    # Admin note actions
    path("admin/notes/edit/<int:pk>/", views.AdminEditNoteView.as_view(), name="admin_edit_note"),
    path("admin/notes/delete/<int:pk>/", views.AdminSoftDeleteNoteView.as_view(), name="admin_soft_delete_note"),
    path("admin/notes/restore/<int:pk>/", views.AdminRestoreNoteView.as_view(), name="admin_restore_note"),
    path("admin/notes/permanent-delete/<int:pk>/", views.AdminPermanentDeleteNoteView.as_view(), name="admin_permanent_delete_note"),

    # Admin deleted notes
    path("admin/recycle/", views.AdminDeletedNotesView.as_view(), name="admin_recycle_bin"),
]
