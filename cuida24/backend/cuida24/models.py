from django.db import models
from rest_framework import serializers
import logging

from rest_framework.generics import get_object_or_404

logger = logging.getLogger("mylogger")


class Message(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('url', 'subject', 'body', 'pk')

    def create(self, validated_data):
        logger.info(validated_data)

        message = Message(
          subject="olaFromCode",
          body=validated_data['body'],
        )
        message.save()
        return message


# Activity defines by Backoffice

class DefActivity(models.Model):
    goal = models.IntegerField()


class DefActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DefActivity
        fields = ('goal', 'pk')


class Game(models.Model):
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('activity', 'pk')


class PhysicalActivity(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class PhysicalActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = PhysicalActivity
        fields = ('description', 'activity', 'pk')


class SocialLeisure(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class SocialLeisureSerializer(serializers.ModelSerializer):

    class Meta:
        model = SocialLeisure
        fields = ('description', 'activity', 'pk')


class IndividualLeisure(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class IndividualLeisureSerializer(serializers.ModelSerializer):

    class Meta:
        model = IndividualLeisure
        fields = ('description', 'activity', 'pk')


# Users

class User(models.Model):
    name = models.CharField(max_length=200)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('name', 'pk')


class Caregiver(models.Model):
    info = models.OneToOneField(User, on_delete=models.CASCADE)


class CaregiverSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = Caregiver
        fields = ('info', 'pk')


class Patient(models.Model):
    info = models.OneToOneField(User, on_delete=models.CASCADE)
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class PatientSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = Patient
        fields = ('info', 'caregiver', 'pk')


class BackofficeUser(models.Model):
    TYPE = (
      ('ADM', 'Administrador'), ('COR', 'Coordenador'), ('REM', 'Responsável Medicação'), ('PRF', 'Profissional Saúde'),
      ('MED', 'Médico'), ('ENF', 'Enfermeiro'), ('PSI', 'Psicólogo'))
    type = models.CharField(max_length=3, choices=TYPE)
    info = models.OneToOneField(User, on_delete=models.CASCADE)


class BackofficeUserSerializer(serializers.ModelSerializer):
    info = UserSerializer()

    class Meta:
        model = BackofficeUser
        fields = ('type', 'info', 'pk')


# Historic

class PhysiologicalParam(models.Model):
    date = models.DateField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class PhysiologicalParamSerializer(serializers.ModelSerializer):

    class Meta:
        model = PhysiologicalParam
        fields = ('data', 'caregiver', 'pk')


class AnalyticalParam(models.Model):
    date = models.DateField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class AnalyticalParamSerializer(serializers.ModelSerializer):

    class Meta:
        model = AnalyticalParam
        fields = ('date', 'caregiver', 'pk')


class Water(models.Model):
    date = models.DateField()
    quantity = models.IntegerField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class WaterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Water
        fields = ('date', 'quantity', 'caregiver', 'pk')


class Nap(models.Model):
    date = models.DateField()
    quantity = models.IntegerField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class NapSerializer(serializers.ModelSerializer):

    class Meta:
        model = Nap
        fields = ('date', 'quantity', 'caregiver', 'pk')


class Sleep(models.Model):
    date = models.DateField()
    quantity = models.BooleanField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class SleepSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sleep
        fields = ('date', 'quantity', 'caregiver', 'pk')


class Activity(models.Model):
    TYPE = (('AF', 'Atividade Fisica'), ('LS', 'Lazer Social'), ('LI', 'Lazer Individual'))
    date = models.DateField()
    type = models.CharField(max_length=2, choices=TYPE)
    specificActivity = models.TextField(null=True, blank=True)
    duration = models.TimeField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ('date', 'type', 'specificActivity', 'duration', 'caregiver', 'pk')


class Meal(models.Model):
    TYPE = (('PA', 'Pequeno Almoço'), ('LM', 'Lanche Manhã'), ('AL', 'Almoço'), ('LT', 'LancheTarde'), ('JT', 'Jantar'))
    date = models.DateField()
    realize = models.BooleanField()
    type = models.CharField(max_length=2, choices=TYPE)
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class MealSerializers(serializers.ModelSerializer):

    class Meta:
        model = Meal
        fields = ('date', 'realize', 'type', 'caregiver', 'pk')


class Constitution(models.Model):
    TYPE = (('CB', 'Carnes Brancas'), ('FT', 'Fruta'), ('VG', 'Vegetais'), ('FB', 'Fibras'), ('PC', 'Pré-cozinhados'),
            ('RF', 'Refrigerantes'), ('AL', 'Alcool'))
    food = models.CharField(max_length=2, choices=TYPE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)


class ConstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Constitution
        fields = ('food', 'meal', 'pk')

# Event


class Calendar(models.Model):
    calendar = models.TextField()
    color = models.CharField(max_length=8)
    forecolor = models.CharField(max_length=8, null=True, blank=True)

    def __str__(self):
        return self.calendar


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('calendar', 'color', 'forecolor', 'pk')


class Schedule(models.Model):
    duration = models.IntegerField(blank=True, null=True)
    durationInDays = models.IntegerField(blank=True, null=True)
    durationUnit = models.TextField(blank=True, null=True)
    dayOfWeek = models.IntegerField(blank=True, null=True)
    dayOfMonth = models.IntegerField(blank=True, null=True)
    month = models.IntegerField(blank=True, null=True)
    times = models.TimeField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)


class ScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Schedule
        fields = ('duration', 'durationInDays', 'durationUnit', 'dayOfWeek', 'year', 'dayOfMonth', 'month',
                  'times', 'pk')


class Event(models.Model):
    title = models.TextField()
    dayOfMonth = models.IntegerField()
    month = models.IntegerField()
    year = models.IntegerField()
    location = models.TextField()
    description = models.TextField()
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    schedule = models.OneToOneField(Schedule, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title


class EventSerializer(serializers.ModelSerializer):
    calendar = CalendarSerializer(read_only=True)
    schedule = ScheduleSerializer(required=False)

    class Meta:
        model = Event
        fields = ('title', 'dayOfMonth', 'month', 'year', 'location', 'description', 'calendar', 'schedule', 'pk')
        depth = 1

    def update(self, instance, validated_data):
        logger.info("UPDATE SERIALIZER EVENT")
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
        schedule.duration = schedule_data.get("duration", schedule.duration)
        schedule.durationInDays = schedule_data.get("durationInDays", schedule.durationInDays)
        schedule.durationUnit = schedule_data.get("durationUnit", schedule.durationUnit)
        schedule.dayOfWeek = schedule_data.get("dayOfWeek", schedule.dayOfWeek)
        schedule.dayOfMonth = schedule_data.get("dayOfMonth", schedule.dayOfMonth)
        schedule.month = schedule_data.get("month", schedule.month)
        schedule.times = schedule_data.get("times", schedule.times)
        schedule.year = schedule_data.get("year", schedule.year)
        schedule.save()

        instance.save()
        return instance


class Notification(models.Model):
    dateTime = models.TextField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE)


class NotificationSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=False)

    class Meta:
        model = Notification
        fields = ('dateTime', 'event', 'pk')


# Appointment

class Appointment(models.Model):
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class AppointmentSerializer(serializers.ModelSerializer):
    details = EventSerializer()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ('details', 'user', 'pk')
        depth = 1

    def create(self, validated_data):
        request = self.context.get("request")
        logger.info("VALIDATED_DATA")
        logger.info(validated_data)

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
        logger.info("UPDATE SERIALIZER")
        request = self.context.get("request")
        logger.info(request)
        logger.info("VALIDATED_DATA")
        logger.info(validated_data)
        event = get_object_or_404(Event, pk=request['details']['pk'])
        event_serializer = EventSerializer(data=validated_data['details'], instance=event, context={'request': request})
        if event_serializer.is_valid(raise_exception=False):
            event_serializer.save()
            # return_data={'details': event_serializer., 'pk': instance.get('pk')}
            # logger.info("RETURN DATA APPOIMENT")
            # logger.info(return_data)
        return instance





class AppointmentNote(models.Model):
    CATEGORY = (('ENF', 'Enfermagem'), ('CLI', 'Clinica'), ('PSI', 'Psicologia'), ('OTR', 'Outras Apreciações'))
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    note = models.TextField()
    author = models.ForeignKey(BackofficeUser, on_delete=models.CASCADE)
    category = models.CharField(max_length=3, choices=CATEGORY)


class AppointmentNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentNote
        fields = ('note', 'author', 'appointment', 'category', 'pk')


# Medication


class Medicine(models.Model):
    activeSubs = models.TextField()
    name = models.TextField()
    pharmaceuticalForm = models.TextField()
    dosage = models.IntegerField()
    holder = models.TextField()
    generic = models.TextField()


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ('activeSubs', 'name', 'pharmaceuticalForm', 'dosage', 'holder', 'generic', 'pk')


class Prescription(models.Model):
    date = models.DateField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    author = models.ForeignKey(BackofficeUser, on_delete=models.CASCADE)


class PrescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prescription
        fields = ('date', 'patient', 'author' 'pk')


class Medication(models.Model):
    STATE = (('E', 'Experimental'), ('A', 'Ativo'), ('I', 'Inativo'))
    quantity = models.IntegerField()
    state = models.CharField(max_length=2, choices=STATE)
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)


class MedicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medication
        fields = ('quantity', 'state', 'details', 'medication', 'prescription', 'pk')


class Take(models.Model):
    date = models.DateField()
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)


class TakeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Take
        fields = ('date', 'medication', 'pk')


# Session

class Session(models.Model):
    TYPE = (('I', 'Individual'), ('G', 'Grupo'))
    STATE = (('E', 'Espera'), ('A', 'Aceite'), ('R', 'Revisao'), ('C', 'Concluida'))
    topic = models.TextField()
    type = models.CharField(max_length=1, choices=TYPE)
    description = models.TextField()
    goal = models.TextField()
    material = models.TextField()
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    state = models.CharField(max_length=1, choices=STATE)
    # Relação many-to-many só tem que estar num model
    participants = models.ManyToManyField(Caregiver)


class SessaoSerializer(serializers.ModelSerializer):
    # Relação many-to-many
    participants = CaregiverSerializer(many=True)

    class Meta:
        model = Session
        fields = ('topic', 'type', 'description', 'goal', 'material', 'details', 'state', 'participants', 'pk')


class Evaluation(models.Model):
    comment = models.TextField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ('comment', 'caregiver', 'session', 'pk')
