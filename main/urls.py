__author__ = 'vadasz'

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('',
    url(r'^login$', 'main.views.login'),
    url(r'^logout$', 'django.contrib.auth.views.logout', {'template_name': 'login.html'}),
    url(r'^$', 'main.views.home'),
    url(r'^regist$', 'main.views.registration'),
    url(r'^ribbit_save$', 'main.views.ribbit_save'),
    url(r'^user_list$', 'main.views.user_list'),
    url(r'^post/following$', 'main.views.user_follow'),
    url(r'^post/unfollowing$', 'main.views.user_unfollow'),
    url(r'^post/ribbits$', 'main.views.get_ribbits'),
)
urlpatterns += staticfiles_urlpatterns()