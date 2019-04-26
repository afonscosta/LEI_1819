import copy


def eventFrontToBackJSON(request_param):
    request = copy.deepcopy(request_param)
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


def eventBackTofrontJSON(request_param, serializer_data):
    request = copy.deepcopy(request_param)
    sent_data = request
    sent_data['event']['id'] = serializer_data['pk']
    return sent_data

def appointmentFrontToBackJSON(request_param):
    request = copy.deepcopy(request_param)
    req_data = {'details': request['event']['data'], 'calendar': request['event']['data']['calendar'],
                'notification': request['event']['data']['notify'], 'users': request['users']}
    del req_data['details']['calendar']
    del req_data['details']['color']
    del req_data['details']['forecolor']
    del req_data['details']['notify']

    req_data['details']['dayOfMonth'] = request['occurrenceDate']['dayOfMonth']
    req_data['details']['month'] = request['occurrenceDate']['month']
    req_data['details']['year'] = request['occurrenceDate']['year']

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
