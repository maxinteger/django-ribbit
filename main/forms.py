__author__ = 'vadasz'
from django import forms
from django.contrib.auth.models import User


class UserRegistrationForm(forms.Form):
    """User registration form"""
    username=forms.CharField(max_length=30,
        widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    first_name=forms.CharField(max_length=30,
        widget=forms.TextInput(attrs={'placeholder': 'First name'}))
    last_name=forms.CharField(max_length=30,
        widget=forms.TextInput(attrs={'placeholder': 'Last name'}))
    email=forms.EmailField(
        widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password=forms.CharField(min_length=8,
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password_retry=forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password confirmation'}))

    def clean_username(self):
        """Check username existing"""
        data = self.cleaned_data['username']
        if User.objects.filter(username__exact=data):
            raise forms.ValidationError("Please select another username.")

        return data

    def clean(self):
        """Check password"""
        cleaned_data = super(UserRegistrationForm, self).clean()

        pw1 = cleaned_data.get("password")
        pw2 = cleaned_data.get("password_retry")

        if pw1 != pw2:
            raise forms.ValidationError("The two password field is not matched!")

        return cleaned_data


class RibbitPostForm(forms.Form):
    """Short message form"""
    ribbit_text=forms.CharField(max_length=420)