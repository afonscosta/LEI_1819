import copy
import logging
import json

from backend.cuida24.models import Appointment, AppointmentSerializer, Notification, NotificationSerializer, Session, \
  SessionSerializer, Caregiver, Patient

logger = logging.getLogger("mylogger")

'''
Não está a a ser utilizado
'''
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


'''
JSON return on Post method with same JSON receive plus pk's created 
'''
def appointmentBackToFrontJSON(request_param, serializer_data):
    request = copy.deepcopy(request_param)
    sent_data = request
    sent_data['event']['id'] = serializer_data['details']['pk']
    sent_data['id'] = serializer_data['pk']
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


'''
JSON return on Get method. Here is necessary to create all fields in JSON     
'''
def getAppointmentBackToFrontJSON(serializer_appointment_data):
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
                    'notify': notificationBackToFrontJSON(appointment['details']['notification']),
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


def notificationBackToFrontJSON(notification_param):
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


def sessionFrontToBackJSON(request_param):
    request = copy.deepcopy(request_param)

    req_data = {'details': request['event']['data'], 'notification': request['event']['data']['notify'],
                'participants': request['event']['users']}

    if 'groupSession' in request:
        req_data['type'] = 'G'
        req_data['description'] = request['groupSession']['description']
        req_data['goal'] = json.dumps(request['groupSession']['goals'])
        req_data['material'] = json.dumps(request['groupSession']['materials'])
        req_data['topic'] = request['groupSession']['theme']
        if 'pk' in request['groupSession']:
            req_data['pk'] = request['groupSession']['pk']
    else:
        req_data['type'] = 'I'
        req_data['description'] = request['individualSession']['description']
        req_data['goal'] = json.dumps(request['individualSession']['goals'])
        req_data['material'] = json.dumps(request['individualSession']['materials'])
        req_data['topic'] = request['individualSession']['theme']
        if 'pk' in request['individualSession']:
            req_data['pk'] = request['individualSession']['pk']

    req_data['state'] = 'E'

    calendar_pk = req_data['details']['calendar']
    req_data['details']['calendar'] = {}
    req_data['details']['calendar']['pk'] = calendar_pk
    req_data['details']['calendar']['color'] = req_data['details']['color']
    req_data['details']['calendar']['forcolor'] = req_data['details']['forecolor']

    del req_data['details']['color']
    del req_data['details']['forecolor']
    del req_data['details']['notify']

    req_data['details']['pk'] = request['event']['id']
    req_data['details']['dayOfMonth'] = request['event']['occurrenceDate']['dayOfMonth']
    req_data['details']['month'] = request['event']['occurrenceDate']['month']
    req_data['details']['year'] = request['event']['occurrenceDate']['year']

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


'''
JSON return on Post method with same JSON receive plus pk's created 
'''
def sessionBackToFrontJSON(request_param, serializer_data):
    request = copy.deepcopy(request_param)
    sent_data = request
    sent_data['event']['id'] = serializer_data['details']['pk']
    if 'groupSession' in request:
        sent_data['groupSession']['pk'] = serializer_data['pk']
    else:
        sent_data['individualSession']['pk'] = serializer_data['pk']
    return sent_data


'''
JSON return on Get method. Here is necessary to create all fields in JSON     
'''
def getSessionBackToFrontJSON(serializer_appointment_data):
    request = copy.deepcopy(serializer_appointment_data)
    req_data = []
    for session in request:
        temp = {}
        temp_session = {'pk': session['pk'],
                        'theme': session['topic'],
                        'description': session['description'],
                        'goals': json.loads(session['goal']),
                        'materials': json.loads(session['material']),
                        'state': session['state']
        }
        if session['type'] == 'I':
            temp['individualSession'] = temp_session
        else:
            temp['groupSession'] = temp_session
        temp_event = {'event': {
                        'data': {
                          'calendar': session['details']['calendar']['pk'],
                          'color': session['details']['calendar']['color'],
                          'description': session['details']['description'],
                          'forecolor': session['details']['calendar']['forecolor'],
                          'location': session['details']['location'],
                          'notify': notificationBackToFrontJSON(session['details']['notification']),
                          'title': session['details']['title']
                        },
                        'id': session['details']['pk'],
                        'schedule': scheduleBackToFrontJSON(session['details']['schedule']),
                        'occurrenceDate': {
                            'dayOfMonth': session['details']['dayOfMonth'],
                            'month': session['details']['month'],
                            'year': session['details']['year']
                          }
                      }
        }
        temp_event['event'].update(session['participants'])
        temp.update(temp_event)
        req_data.append(temp)
    return req_data


'''
  Get user appointments
'''
def getAppointments(user, is_patient):
    queryset = Appointment.objects.filter(user=user.info)
    serializer_appointment = AppointmentSerializer(queryset, many=True)
    for appointment in serializer_appointment.data:
        queryset2 = Notification.objects.filter(event=appointment['details']['pk']).values('dateTime')
        serializer_notification = NotificationSerializer(queryset2, many=True)
        appointment['details']['notification'] = serializer_notification.data
        if is_patient:
            appointment['patientPK'] = user.pk
        else:
            appointment['caregiverPK'] = user.pk
    return serializer_appointment.data


'''
  Get user(s) session
'''
def getSessions(participants):
    queryset = Session.objects.filter(participants__in=participants).distinct()
    serializer_session = SessionSerializer(queryset, many=True)
    for session in serializer_session.data:
        queryset2 = Notification.objects.filter(event=session['details']['pk']).values('dateTime')
        serializer_notification = NotificationSerializer(queryset2, many=True)
        session['details']['notification'] = serializer_notification.data
        users = {'users': {}}
        users['users']['patients'] = []
        users['users']['caregivers'] = []
        for user in session['participants']:
            try:
                caregiver = Caregiver.objects.get(info_id=user['pk'])
                users['users']['caregivers'].append(caregiver.pk)
            except Caregiver.DoesNotExist:
                patient = Patient.objects.get(info_id=user['pk'])
                users['users']['patients'].append(patient.pk)
        session['participants'] = users
    return serializer_session.data
