__author__ = 'vadasz'

from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('main.views',
    #    url(r'^(?P<mail_id>\d+)/view/$', 'view'),

    #    url(r'^(?P<mail_id>\d+)/view/$', 'view'),
    #    url(r'^(?P<mail_id>\d+|new)/edit/$', 'edit'),
    #    url(r'^save/$', 'save'),

    #    url(r'^(?P<mail_id>\d+|new)/test/$', 'test'),
)
urlpatterns += patterns('',
    url(r'^login$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    url(r'^logout$', 'django.contrib.auth.views.logout', {'template_name': 'login.html'}),
    url(r'^$', 'main.views.home'),
    url(r'^rebbit_save$', 'main.views.rebbit_save'),
)
urlpatterns += staticfiles_urlpatterns()