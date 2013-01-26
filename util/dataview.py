from django.http import HttpResponse
from django.utils import simplejson
from django.views.generic.detail import BaseDetailView, \
    SingleObjectTemplateResponseMixin

def render_to_json(context):
    return get_json_response(convert_context_to_json(context))

def get_json_response(content, **httpresponse_kwargs):
    return HttpResponse(content, content_type='application/json', **httpresponse_kwargs)

def convert_context_to_json(context):
        return simplejson.dumps(context)
