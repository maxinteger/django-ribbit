import re
import django
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import  render_to_response, redirect
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required

from util.dataview import JSONResponseMixin

from main.models import *

@login_required(login_url='login')
def home(request):
    user = request.user
    falowed_users = list(Follows.objects.filter(user__exact=user.id))
    ribbits = Ribbits.objects\
        .filter(user_id__in=falowed_users+[user.id])\
        .extra(select={'old':'TIMESTAMPDIFF(HOUR, created_at, NOW())'})\
    .order_by('-created_at')

    params = {
        'user': user,
        'users': auth.User.objects.all(),
        'followed': falowed_users,
        'followers': Follows.objects.filter(followee__exact=user.id),
        'counts':{
            'ribbits' : ribbits.count(),
            'followers': Follows.objects.filter(user_id__exact=user.id).count(),
            'following': Follows.objects.filter(followee_id__exact=user.id).count()
        },
        'ribbits': ribbits,
        }
    params.update(csrf(request))
    return render_to_response('home.html', params)


@login_required(login_url='login')
def rebbit_save(request):
    ribbit = Ribbits(user=request.user, ribbit=request.POST.get('text'))
    ribbit.save()
    return render_to_response('frags/ribbit.html', {'ribbit': ribbit})


def regist(request):
    errors = []
    uname = request.POST.get('username')
    fname = request.POST.get('firstname')
    lname = request.POST.get('lastname')
    mail = request.POST.get('email')
    pw1 = request.POST.get('password')
    pw2 = request.POST.get('password2')

    if len(User.objects.filter(username__exact=uname)) > 0:
        errors.append("Existing username")
    if mail is None or len(mail) < 1:
        errors.append("Invalid email")
    if len(User.objects.filter(email__exact=mail)) > 0:
        errors.append("Existing email")
    if len(pw1) < 6:
        errors.append("Password too short")
    if pw1 != pw2:
        errors.append("Second password not match with first")

    if len(errors) > 0:
        #request.POST.clear()
        return django.contrib.auth.views.login(request, 'login.html', extra_context={'regist_errors': errors})
    else:
        user = User.objects.create_user(uname, mail, pw1)
        user.first_name = fname
        user.last_name = lname
        user.save()
        user = authenticate(username=uname, password=pw1)
        if user is not None:
            login(request, user)
            return redirect('main.views.home')


@login_required(login_url='login')
def user_follow(request):
    id = int(request.POST.get('user_id'))
    Follows(user=request.user, followee=auth.User.objects.get(pk=id)).save()
    return JSONResponseMixin()


@login_required(login_url='login')
def user_unfallow(request):
    id = int(request.POST.get('user_id'))
    Follows.objects.filter(user__exact=request.user.id, followee__exact=id).delete()
    return JSONResponseMixin()