def EventFrontToBackJSON(request):
    req_data = {'event': request['event']['data'], 'calendar': request['event']['data']['calendar'],
                'notification': request['event']['data']['notify'], 'users': request['users']}

    return req_data

# def EventBackTofrontJSON():
