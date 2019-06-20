from rest_framework import serializers
from django.contrib.auth.models import User as UserAuth
from django.contrib.auth.hashers import make_password
from rest_framework.generics import get_object_or_404

from backend.cuida24.models import *

logger = logging.getLogger("mylogger")

# Auxiliar Serializers

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


# Static Pages

class StaticPagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPages
        fields = ('title', 'text', 'pk')


# Activity defines by Backoffice

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ('goal', 'type', 'dateBegin', 'dateEnd', 'disable', 'pk')


class PhysicalActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalActivity
        fields = ('description', 'pk')


class SocialLeisureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLeisure
        fields = ('description', 'pk')


class IndividualLeisureSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualLeisure
        fields = ('description', 'pk')


# User

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = UserAuth
        fields = ('password', 'username', 'name', 'first_name', 'last_name', 'email', 'pk')

    def get_name(self, obj):
        return obj.first_name + " " + obj.last_name

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])
            user.save()
        return user


class CaregiverSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = Caregiver
        fields = ('info', 'pk')

    def create(self, validated_data):
        logger.info(validated_data)
        user_data = validated_data.pop('info')
        user_data['password'] = make_password(user_data['password'])
        logger.info(user_data)
        info = UserAuth.objects.create(**user_data)
        caregiver = Caregiver.objects.create(info=info)
        return caregiver


class PatientSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = Patient
        fields = ('info', 'caregiver', 'pk')

    def create(self, validated_data):
        logger.info(validated_data)
        user_data = validated_data.pop('info')
        user_data['password'] = make_password(user_data['password'])
        logger.info(user_data)
        info = UserAuth.objects.create(**user_data)
        patient = Patient.objects.create(info=info, **validated_data)
        return patient

class BackofficeUserSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = BackofficeUser
        fields = ('type', 'info', 'pk')

    def create(self, validated_data):
        logger.info(validated_data)
        user_data = validated_data.pop('info')
        user_data['password'] = make_password(user_data['password'])
        logger.info(user_data)
        info = UserAuth.objects.create(**user_data)
        backoffice_user = BackofficeUser.objects.create(info=info, **validated_data)
        return backoffice_user

# Historic

class PhysiologicalParamSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysiologicalParam
        fields = ('data', 'caregiver', 'pk')


class AnalyticalParamSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticalParam
        fields = ('date', 'caregiver', 'pk')


class WaterSerializer(serializers.ModelSerializer):
    water = serializers.IntegerField(source='quantity')

    class Meta:
        model = Water
        fields = ('date', 'water', 'caregiver', 'pk')

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get("quantity", instance.quantity)
        instance.save()
        return instance


class NapSerializer(serializers.ModelSerializer):
    naps = serializers.IntegerField(source='quantity')

    class Meta:
        model = Nap
        fields = ('date', 'naps', 'caregiver', 'pk')

class SOSSerializer(serializers.ModelSerializer):
    sos = serializers.IntegerField(source='quantity')

    class Meta:
        model = SOS
        fields = ('date', 'sos', 'caregiver', 'patient', 'pk')

class SleepSerializer(serializers.ModelSerializer):
    quantity = serializers.BooleanField(source="quality")

    class Meta:
        model = Sleep
        fields = ('date', 'quantity', 'caregiver', 'pk')

    def update(self, instance, validated_data):
        instance.quality = validated_data.get("quality", instance.quality)
        instance.save()
        return instance


class ActivitySerializer(serializers.ModelSerializer):
    act = serializers.IntegerField(source="specificActivity")

    class Meta:
        model = Activity
        fields = ('date', 'type', 'act', 'duration', 'caregiver', 'pk')

class ConstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constitution
        fields = ('food', 'meal', 'pk')


class MealSerializer(serializers.ModelSerializer):
    done = serializers.BooleanField(source="realize")

    class Meta:
        model = Meal
        fields = ('date', 'done', 'type', 'caregiver', 'pk')

    def create(self, validated_data):
        logger.info("VALIDATED DATA POST MEAL")
        logger.info(validated_data)

        #constitution_data = validated_data.pop('food')
        constitution_data = self.context.get('request')['food']
        logger.info(constitution_data)
        meal = Meal.objects.create(**validated_data)
        for constitution in constitution_data:
            constitution_req_data = {'food': constitution, 'meal': meal}
            Constitution.objects.create(**constitution_req_data)

        return meal

# Event


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('calendar', 'color', 'forecolor', 'pk')


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('duration', 'durationInDays', 'durationUnit', 'dayOfWeek', 'year', 'dayOfMonth', 'month',
                  'times', 'pk')


class EventSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer(read_only=True)
    schedule = ScheduleSerializer(required=False)

    class Meta:
        model = Event
        fields = ('title', 'dayOfMonth', 'month', 'year', 'location', 'description', 'calendar', 'schedule', 'pk')
        depth = 1

    def update(self, instance, validated_data):
        request = self.context.get("request")
        calendar_data = request['details']['calendar']
        schedule_data = validated_data.pop("schedule")
        calendar = instance.calendar
        schedule = instance.schedule

        # update event fields
        instance.title = validated_data.get("title", instance.title)
        instance.dayOfMonth = validated_data.get("dayOfMonth", instance.dayOfMonth)
        instance.month = validated_data.get("month", instance.month)
        instance.year = validated_data.get("year", instance.year)
        instance.location = validated_data.get("location", instance.location)
        instance.description = validated_data.get("description", instance.description)

        # update calendar fields
        calendar.calendar = calendar_data.get("calendar", calendar.calendar)
        calendar.color = calendar_data.get("color", calendar.color)
        calendar.forecolor = calendar_data.get("forecolor", calendar.forecolor)
        calendar.save()

        # update schedule fields
        schedule.duration = schedule_data.get("duration")
        schedule.durationInDays = schedule_data.get("durationInDays")
        schedule.durationUnit = schedule_data.get("durationUnit")
        schedule.dayOfWeek = schedule_data.get("dayOfWeek")
        schedule.dayOfMonth = schedule_data.get("dayOfMonth")
        schedule.month = schedule_data.get("month")
        schedule.times = schedule_data.get("times")
        schedule.year = schedule_data.get("year")
        schedule.save()

        instance.save()
        return instance


class NotificationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ('dateTime', 'event', 'pk')


# Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    details = EventSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ('details', 'user', 'pk')
        depth = 1

    def create(self, validated_data):
        request = self.context.get("request")

        # Details(event) of appointment
        calendar = get_object_or_404(Calendar, pk=request['details']['calendar']['pk'])
        schedule_data = validated_data['details'].pop('schedule')
        schedule = Schedule.objects.create(**schedule_data)
        event = Event.objects.create(calendar=calendar, schedule=schedule, **validated_data['details'])

        # Notification associate to event
        for notification in request['notification']:
            notification_req_data = {'dateTime': notification, 'event': event}
            Notification.objects.create(**notification_req_data)

        # Create appointment with user and event
        appointment = None
        for user in request['users']['caregivers']:
            req_data = {'user': get_object_or_404(Caregiver, pk=user).info, 'details': event}
            appointment = Appointment.objects.create(**req_data)

        if not appointment:
            for user in request['users']['patients']:
                req_data = {'user': get_object_or_404(Patient, pk=user).info, 'details': event}
                appointment = Appointment.objects.create(**req_data)
        return appointment

    def update(self, instance, validated_data):
        request = self.context.get("request")
        event = get_object_or_404(Event, pk=request['details']['pk'])
        event_serializer = EventSerializer(data=validated_data['details'], instance=event, context={'request': request})
        if event_serializer.is_valid(raise_exception=False):
            event_serializer.save()

        notifications = Notification.objects.filter(event=event)
        actual_number_notification = len(notifications)
        actual_index_change = 0
        for income_notification in request['notification']:
            if actual_index_change < actual_number_notification:
                notification = notifications[actual_index_change]
                notification.dateTime = income_notification
                notification.save()
                actual_index_change += 1
            else:
                notification_req_data = {'dateTime': income_notification, 'event': event}
                Notification.objects.create(**notification_req_data)
        return instance


class AppointmentNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentNote
        fields = ('note', 'author', 'appointment', 'category', 'pk')


# Medication

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ('activeSubs', 'name', 'pharmaceuticalForm', 'dosage', 'holder', 'generic', 'pk')


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ('date', 'patient', 'author', 'pk')


class MedicationSerializer(serializers.ModelSerializer):
    details = EventSerializer()
    prescription = PrescriptionSerializer()

    class Meta:
        model = Medication
        fields = ('quantity', 'state', 'details', 'medication', 'prescription', 'pk')

    def create(self, validated_data):
        logger.info("VALIDATED DATA")
        logger.info(validated_data)
        request = self.context.get("request")

        # Details(event) of appointment
        calendar = get_object_or_404(Calendar, pk=request['details']['calendar']['pk'])
        schedule_data = validated_data['details'].pop('schedule')
        schedule = Schedule.objects.create(**schedule_data)
        event_data = validated_data.pop('details')
        event = Event.objects.create(calendar=calendar, schedule=schedule, **event_data)

        # Notification associate to event
        for notification in request['notification']:
            notification_req_data = {'dateTime': notification, 'event': event}
            Notification.objects.create(**notification_req_data)

        # Create Prescription
        prescription_data = validated_data.pop('prescription')
        prescription = Prescription.objects.create(**prescription_data)

        # Create medication with prescription, medication and event
        medication = Medication.objects.create(details=event, prescription=prescription, **validated_data)
        return medication

    def update(self, instance, validated_data):
        request = self.context.get("request")

        event = get_object_or_404(Event, pk=request['details']['pk'])
        logger.info(event)
        event_serializer = EventSerializer(data=validated_data['details'], instance=event, context={'request': request})
        if event_serializer.is_valid(raise_exception=False):
            event_serializer.save()

        notifications = Notification.objects.filter(event=event)
        actual_number_notification = len(notifications)
        actual_index_change = 0
        for income_notification in request['notification']:
            if actual_index_change < actual_number_notification:
                notification = notifications[actual_index_change]
                notification.dateTime = income_notification
                notification.save()
                actual_index_change += 1
            else:
                notification_req_data = {'dateTime': income_notification, 'event': event}
                Notification.objects.create(**notification_req_data)

        prescription = get_object_or_404(Prescription, pk=instance.prescription.pk)
        logger.info(prescription)
        prescription_serializer = PrescriptionSerializer(data=validated_data['prescription'], instance=prescription,
                                                         context={'resquest': request})
        if prescription_serializer.is_valid(raise_exception=False):
            prescription_serializer.save()

        # update instance
        instance.quantity = validated_data.get("quantity", instance.quantity)
        instance.state = validated_data.get("state", instance.state)
        instance.medication = validated_data.get('medication', instance.medication)
        instance.save()
        return instance


class TakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Take
        fields = ('date', 'medication', 'pk')


# Session

class SessionSerializer(serializers.ModelSerializer):
    # Relação many-to-many
    participants = UserSerializer(many=True, read_only=True)
    details = EventSerializer()

    class Meta:
        model = Session
        fields = ('topic', 'type', 'description', 'goal', 'material', 'details', 'state', 'comment', 'participants',
                  'pk')

    def create(self, validated_data):
        request = self.context.get("request")
        logger.info("VALIDATED DATA POST SESSION")
        logger.info(validated_data)
        # Details(event) of session
        calendar = get_object_or_404(Calendar, pk=request['details']['calendar']['pk'])
        schedule_data = validated_data['details'].pop('schedule')
        event_data = validated_data.pop('details')
        schedule = Schedule.objects.create(**schedule_data)
        event = Event.objects.create(calendar=calendar, schedule=schedule, **event_data)

        # Notification associate to event
        for notification in request['notification']:
            notification_req_data = {'dateTime': notification, 'event': event}
            Notification.objects.create(**notification_req_data)

        # Create appointment with user and event
        session = Session.objects.create(details=event, **validated_data)
        participants = []
        for user in request['participants']['caregivers']:
            participants.append(get_object_or_404(Caregiver, pk=user).info)

        for user in request['participants']['patients']:
            participants.append(get_object_or_404(Patient, pk=user).info)
        logger.info(participants)
        session.participants.set(participants)
        return session

    def update(self, instance, validated_data):
        logger.info("UPDATE SESSION")
        logger.info("VALIDATED DATA POST SESSION")
        logger.info(validated_data)
        request = self.context.get("request")
        event = get_object_or_404(Event, pk=request['details']['pk'])
        event_serializer = EventSerializer(data=validated_data['details'], instance=event, context={'request': request})
        if event_serializer.is_valid(raise_exception=False):
            event_serializer.save()
        notifications = Notification.objects.filter(event=event)
        actual_number_notification = len(notifications)
        actual_index_change = 0
        for income_notification in request['notification']:
            if actual_index_change < actual_number_notification:
                notification = notifications[actual_index_change]
                notification.dateTime = income_notification
                notification.save()
                actual_index_change += 1
            else:
                notification_req_data = {'dateTime': income_notification, 'event': event}
                Notification.objects.create(**notification_req_data)
        # update instance
        instance.topic = validated_data.get("topic", instance.topic)
        instance.type = validated_data.get("type", instance.type)
        instance.description = validated_data.get("description", instance.description)
        instance.goal = validated_data.get("goal", instance.goal)
        instance.material = validated_data.get("material", instance.material)
        instance.state = validated_data.get("state", instance.state)
        instance.comment = validated_data.get('comment', instance.comment)
        participants = []
        for user in request['participants']['caregivers']:
            participants.append(get_object_or_404(Caregiver, pk=user).info)

        for user in request['participants']['patients']:
            participants.append(get_object_or_404(Patient, pk=user).info)
        instance.participants.set(participants)
        instance.save()
        return instance


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ('comment', 'participant', 'session', 'pk')
