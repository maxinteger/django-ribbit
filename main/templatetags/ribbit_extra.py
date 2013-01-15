
import re
import time
from django import template
from django.utils.safestring import mark_safe

__author__ = 'vadasz'

register = template.Library()

@register.filter
def get_idx(value, idx):
    """Get List or Dict element by index or key"""
    return value[idx]

@register.filter
def get_id(value, id):
    return [i for i in value if id == i.id][0]

@register.filter(is_safe=True)
def highlight(value, search, className='highlight'):
    return mark_safe(re.sub(re.escape(search), '<span class="%s">%s</span>' % (className, search), value, re.IGNORECASE ))

@register.filter
def epoch(value):
    try:
        print int(time.mktime(value))
        return int(time.mktime(value.timetuple())*1000)
    except AttributeError:
        return ''