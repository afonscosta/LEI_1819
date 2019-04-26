from typing import Dict, Any


def EventFrontToBackJSON(request):
    req_data = {'event': request['event']['data'], 'calendar': request['event']['data']['calendar'],
                'notification': request['event']['data']['notify'], 'users': request['users']}

    req_data['event']['dayOfMonth'] = request['occurrenceDate']['dayOfMonth']
    req_data['event']['month'] = request['occurrenceDate']['month']
    req_data['event']['year'] = request['occurrenceDate']['year']

    req_data['schedule'] = request['event']['schedule']
    if 'dayOfWeek' in req_data['schedule']:
        if req_data['schedule']['dayOfWeek']:
            req_data['schedule']['dayOfWeek'] = req_data['schedule']['dayOfWeek'][0]
    if 'dayOfMonth' in req_data['schedule']:
        if req_data['schedule']['dayOfMonth']:
            req_data['schedule']['dayOfMonth'] = req_data['schedule']['dayOfMonth'][0]
    if 'month' in req_data['schedule']:
      if req_data['schedule']['month']:
            req_data['schedule']['month'] = req_data['schedule']['month'][0]
    if 'year' in req_data['schedule']:
        if req_data['schedule']['year']:
            req_data['schedule']['year'] = req_data['schedule']['year'][0]
    if 'times' in req_data['schedule']:
        if req_data['schedule']['times']:
            req_data['schedule']['times'] = req_data['schedule']['times'][0]
    return req_data


def EventBackTofrontJSON(request, serializer_data):
    sent_data = request
    sent_data['event']['id'] = serializer_data['pk']
    return sent_data
