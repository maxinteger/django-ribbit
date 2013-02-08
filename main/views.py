from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.contrib.auth.views import login as login_view
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, redirect

from main.models import *
from main.forms import *

from util.dataview import render_to_json


def login(request):
    """User login"""
    form = UserRegistrationForm()
    return login_view(request, 'login.html', extra_context={'registration_form': form})


def registration(request):
    """User registration"""
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('main.views.home')
    else:
        form = UserRegistrationForm()

    return login_view(request, 'login.html', extra_context={'registration_form': form})


@login_required(login_url='login')
def home(request):
    """Home screen"""
    user = request.user
    followed_users = list(Follows.objects.filter(user__exact=user.id))
    ribbits = Ribbits.objects \
        .filter(user_id__in=followed_users + [user.id]) \
        .order_by('-created_at')

    params = {
        'user': user,
        'users': auth.User.objects.all(),
        'followed': followed_users,
        'followers': Follows.objects.filter(followee__exact=user.id),
        'counts': {
            'ribbits': ribbits.count(),
            'followers': Follows.objects.filter(user_id__exact=user.id).count(),
            'following': Follows.objects.filter(followee_id__exact=user.id).count()
        },
        'ribbits': ribbits,
    }
    params.update(csrf(request))
    return render_to_response('home.html', params)


@login_required(login_url='login')
def user_list(request):
    users = User.objects.exclude(pk=request.user.id)
    following = [f.followee for f in Follows.objects.filter(user_id__exact=request.user.id)]

    return render_to_json([{
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'following': user in following
    } for user in users])


@login_required(login_url='login')
def ribbit_save(request):
    """Sort message save"""
    ribbit = Ribbits(user=request.user, ribbit=request.POST.get('ribbit'))
    ribbit.save()
    return render_to_response('frags/ribbit.html', {'ribbit': ribbit})


@login_required(login_url='login')
def user_follow(request):
    id = int(request.POST.get('user_id'))
    Follows(user=request.user, followee=auth.User.objects.get(pk=id)).save()


@login_required(login_url='login')
def user_unfollow(request):
    pass


@login_required(login_url='login')
def get_ribbits(request):
    user = request.user
    followed_users = list(Follows.objects.filter(user__exact=user.id))
    ribbits = Ribbits.objects.filter(user_id__in=followed_users + [user.id]).order_by('-created_at')

    json = {
        'ribbits': [r.toJSON() for r in ribbits],
        'counts': {
            'ribbits': ribbits.count(),
            'followers': Follows.objects.filter(user_id__exact=user.id).count(),
            'following': Follows.objects.filter(followee_id__exact=user.id).count()
        },
    }
    return render_to_json(json)
