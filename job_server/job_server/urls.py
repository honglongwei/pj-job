from django.conf.urls import url, include

urlpatterns = [
    url(r"^api/", include("apps.api.urls", namespace = "api")),
    url(r"^task/", include("apps.task.urls", namespace = "task")),
    url(r"^manage/", include("apps.manage.urls", namespace = "manage")),
    url(r"^history/", include("apps.history.urls", namespace = "history")),
    url(r"^dashboard/", include("apps.dashboard.urls", namespace = "dashboard")),
]
