import copy
import logging

logger = logging.getLogger("mylogger")

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


def eventBackToFrontJSON(request_param, serializer_data):
    request = copy.deepcopy(request_param)
    sent_data = request
    sent_data['event']['id'] = serializer_data['pk']
    return sent_data


def appointmentFrontToBackJSON(request_param):
    request = copy.deepcopy(request_param)
    req_data = {'details': request['event']['data'], 'notification': request['event']['data']['notify'],
                'users': request['users']}

    calendar_pk = req_data['details']['calendar']
    req_data['details']['calendar'] = {}
    req_data['details']['calendar']['pk'] = calendar_pk
    req_data['details']['calendar']['color'] = req_data['details']['color']
    req_data['details']['calendar']['forcolor'] = req_data['details']['forecolor']

    del req_data['details']['color']
    del req_data['details']['forecolor']
    del req_data['details']['notify']

    req_data['details']['pk'] = request['event']['id']
    req_data['details']['dayOfMonth'] = request['occurrenceDate']['dayOfMonth']
    req_data['details']['month'] = request['occurrenceDate']['month']
    req_data['details']['year'] = request['occurrenceDate']['year']

    req_data['details']['schedule'] = request['event']['schedule']
    if 'dayOfWeek' in req_data['details']['schedule']:
      if req_data['details']['schedule']['dayOfWeek']:
        req_data['details']['schedule']['dayOfWeek'] = req_data['details']['schedule']['dayOfWeek'][0]
    if 'dayOfMonth' in req_data['details']['schedule']:
      if req_data['details']['schedule']['dayOfMonth']:
        req_data['details']['schedule']['dayOfMonth'] = req_data['details']['schedule']['dayOfMonth'][0]
    if 'month' in req_data['details']['schedule']:
      if req_data['details']['schedule']['month']:
        req_data['details']['schedule']['month'] = req_data['details']['schedule']['month'][0]
    if 'year' in req_data['details']['schedule']:
      if req_data['details']['schedule']['year']:
        req_data['details']['schedule']['year'] = req_data['details']['schedule']['year'][0]
    if 'times' in req_data['details']['schedule']:
      if req_data['details']['schedule']['times']:
        req_data['details']['schedule']['times'] = req_data['details']['schedule']['times'][0]
    return req_data


def appointmentBackToFrontJSON(serializer_appointment_data):
    request = copy.deepcopy(serializer_appointment_data)
    req_data = []
    for appointment in request:
        temp = {'appointmentPK': appointment['pk'],
                    'occurrenceDate': {
                      'dayOfMonth': appointment['details']['dayOfMonth'],
                      'month': appointment['details']['month'],
                      'year': appointment['details']['year']
                    },
                    'event': {
                      'data': {
                        'calendar': appointment['details']['calendar']['pk'],
                        'color': appointment['details']['calendar']['color'],
                        'description': appointment['details']['description'],
                        'forecolor': appointment['details']['calendar']['forecolor'],
                        'location': appointment['details']['location'],
                        'notify': notificationBackToFronJSON(appointment['details']['notification']),
                        'title': appointment['details']['title']
                      },
                      'id': appointment['details']['pk'],
                      'schedule': scheduleBackToFrontJSON(appointment['details']['schedule'])
                    }
                  }
        if 'patientPK' in appointment:
            temp['patientPK'] = appointment['patientPK']
        else:
            temp['caregiverPK'] = appointment['caregiverPK']
        req_data.append(temp)
    return req_data


def notificationBackToFronJSON(notification_param):
    notifications = copy.deepcopy(notification_param)
    req_data = []
    for notification in notifications:
        req_data.append(notification['dateTime'])
    return req_data


def scheduleBackToFrontJSON(schedule_param):
    schedule = copy.deepcopy(schedule_param)
    req_data = {}
    if 'duration' in schedule and not schedule['duration'] is None:
        req_data['duration'] = schedule['duration']
    if 'durationInDays' in schedule and not schedule['durationInDays'] is None:
        req_data['durationInDays'] = schedule['durationInDays']
    if 'durationUnit' in schedule and not schedule['durationUnit'] is None:
        req_data['durationUnit'] = schedule['durationUnit']
    if 'dayOfWeek' in schedule and not schedule['dayOfWeek'] is None:
        req_data['dayOfWeek'] = []
        req_data['dayOfWeek'].append(schedule['dayOfWeek'])
    if 'dayOfMonth' in schedule and not schedule['dayOfMonth'] is None:
        req_data['dayOfMonth'] = []
        req_data['dayOfMonth'].append(schedule['dayOfMonth'])
    if 'month' in schedule and not schedule['month'] is None:
        req_data['month'] = []
        req_data['month'].append(schedule['month'])
    if 'year' in schedule and not schedule['year'] is None:
        req_data['year'] = []
        req_data['year'].append(schedule['year'])
    if 'times' in schedule and not schedule['times'] is None:
        req_data['times'] = []
        req_data['times'].append(schedule['times'])
    return req_data
