from django.urls import path
from . import views

urlpatterns = [
    # ----------------- User Notes / Stories -----------------
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/edit/<int:pk>/", views.EditNote.as_view(), name="edit-note"),

    # ----------------- User Recycling Bin -----------------
    path("notes/deleted/", views.UserDeletedNotesView.as_view(), name="user-deleted-notes"),
    path("notes/restore/<int:pk>/", views.UserRestoreNoteView.as_view(), name="user-restore-note"),
    path("notes/permanent-delete/<int:pk>/", views.UserPermanentDeleteNoteView.as_view(), name="user-permanent-delete-note"),

    # ----------------- User Creation -----------------
    path("users/create/", views.CreateUserView.as_view(), name="create-user"),

   # ----------------- Admin Token -----------------
    path("admin/token/", views.AdminTokenObtainPairView.as_view(), name="admin_token_obtain_pair"),

    # ----------------- Admin Users -----------------
    path("admin/users/", views.AdminUserListView.as_view(), name="admin_user_list"),

    # ----------------- Admin User Stories -----------------
    path("admin/users/<int:user_id>/stories/", views.AdminUserStoriesView.as_view(), name="admin_user_stories"),

    # ----------------- Admin Deleted Stories -----------------
    path("admin/recycle/", views.AdminDeletedStoriesView.as_view(), name="admin_recycle_bin"),

    # ----------------- Admin Story Actions -----------------
    path("admin/stories/edit/<int:pk>/", views.AdminEditStoryView.as_view(), name="admin_edit_story"),
    path("admin/stories/delete/<int:pk>/", views.AdminSoftDeleteStoryView.as_view(), name="admin_soft_delete_story"),
    path("admin/stories/restore/<int:pk>/", views.AdminRestoreStoryView.as_view(), name="admin_restore_story"),
    path("admin/stories/permanent-delete/<int:pk>/", views.AdminPermanentDeleteStoryView.as_view(), name="admin_permanent_delete_story"),

    # ----------------- Stories / Chapters -----------------
    # Stories (same as notes)
    path("stories/", views.NoteListCreate.as_view(), name="story-list-create"),
    path("stories/<int:pk>/edit/", views.EditNote.as_view(), name="edit-story"),

    # Chapters
    path("chapters/", views.ChapterListCreateView.as_view(), name="chapter-list-create"),
    path("chapters/create/", views.ChapterCreateView.as_view(), name="chapter-create"),
    path("chapters/edit/<int:pk>/", views.ChapterEditView.as_view(), name="chapter-edit"),
    path("chapters/delete/<int:pk>/", views.ChapterDeleteView.as_view(), name="chapter-delete"),

    # Chapters creation
    path("chapters/create/", views.ChapterCreateView.as_view(), name="chapter-create"),

    # Stories editing
    path("stories/<int:pk>/edit/", views.EditNote.as_view(), name="edit-story"),

]
