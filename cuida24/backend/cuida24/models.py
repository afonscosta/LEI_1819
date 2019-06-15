
from django.db import models
from django.contrib.auth.models import User as UserAuth
import logging

from rest_framework.generics import get_object_or_404
from rest_framework.settings import api_settings

logger = logging.getLogger("mylogger")


class Message(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()

# Static Pages

class StaticPages(models.Model):
    title = models.TextField()
    text = models.TextField()


# Activity defines by Backoffice

class DefActivity(models.Model):
    goal = models.IntegerField()


class Game(models.Model):
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class PhysicalActivity(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class SocialLeisure(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


class IndividualLeisure(models.Model):
    description = models.TextField()
    activity = models.ForeignKey(DefActivity, on_delete=models.CASCADE)


# User

class Caregiver(models.Model):
    info = models.OneToOneField(UserAuth, on_delete=models.CASCADE)


class Patient(models.Model):
    info = models.OneToOneField(UserAuth, on_delete=models.CASCADE)
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class BackofficeUser(models.Model):
    TYPE = (
      ('ADM', 'Administrador'), ('COR', 'Coordenador'), ('REM', 'Responsável Medicação'), ('PRF', 'Profissional Saúde'),
      ('MED', 'Médico'), ('ENF', 'Enfermeiro'), ('PSI', 'Psicólogo'))
    type = models.CharField(max_length=3, choices=TYPE)
    info = models.OneToOneField(UserAuth, on_delete=models.CASCADE)

# Historic

class PhysiologicalParam(models.Model):
    date = models.DateTimeField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class AnalyticalParam(models.Model):
    date = models.DateTimeField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class Water(models.Model):
    date = models.DateTimeField()
    quantity = models.IntegerField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class Nap(models.Model):
    date = models.DateTimeField()
    quantity = models.IntegerField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class Sleep(models.Model):
    date = models.DateTimeField()
    quality = models.BooleanField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)

class SOS(models.Model):
    date = models.DateTimeField()
    quantity = models.IntegerField()
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

class Activity(models.Model):
    TYPE = (('AF', 'Atividade Fisica'), ('LS', 'Lazer Social'), ('LI', 'Lazer Individual'))
    DURATION = (('12', '10-20 min'), ('23', '20-30 min'), ('34', '30-40 min'), ('45', '40-50 min'),
                ('56', '50-60 min'), ('6', '+ 60 min'))
    date = models.DateTimeField()
    type = models.CharField(max_length=2, choices=TYPE)
    specificActivity = models.TextField(null=True, blank=True)
    duration = models.CharField(max_length=2, choices=DURATION)
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class Meal(models.Model):
    TYPE = (('PA', 'Pequeno Almoço'), ('LM', 'Lanche Manhã'), ('AL', 'Almoço'), ('LT', 'LancheTarde'), ('JT', 'Jantar'))
    date = models.DateTimeField()
    realize = models.BooleanField()
    type = models.CharField(max_length=2, choices=TYPE)
    caregiver = models.ForeignKey(Caregiver, on_delete=models.CASCADE)


class Constitution(models.Model):
    TYPE = (('CB', 'Carnes Brancas'), ('FT', 'Fruta'), ('VG', 'Vegetais'), ('FB', 'Fibras'), ('PC', 'Pré-cozinhados'),
            ('RF', 'Refrigerantes'), ('AL', 'Alcool'))
    food = models.CharField(max_length=2, choices=TYPE)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)


# Event


class Calendar(models.Model):
    calendar = models.TextField()
    color = models.CharField(max_length=8)
    forecolor = models.CharField(max_length=8, null=True, blank=True)

    def __str__(self):
        return self.calendar


class Schedule(models.Model):
    duration = models.IntegerField(blank=True, null=True)
    durationInDays = models.IntegerField(blank=True, null=True)
    durationUnit = models.TextField(blank=True, null=True)
    dayOfWeek = models.IntegerField(blank=True, null=True)
    dayOfMonth = models.IntegerField(blank=True, null=True)
    month = models.IntegerField(blank=True, null=True)
    times = models.TimeField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)


class Event(models.Model):
    title = models.TextField()
    dayOfMonth = models.IntegerField(blank=True, null=True)
    month = models.IntegerField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    description = models.TextField()
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    schedule = models.OneToOneField(Schedule, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

    def delete(self, using=None, keep_parents=False):
        self.schedule.delete()
        Notification.objects.filter(event=self).delete()
        super(Event, self).delete()


class Notification(models.Model):
    dateTime = models.TextField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

# Appointment


class Appointment(models.Model):
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(UserAuth, on_delete=models.CASCADE)

    def delete(self, using=None, keep_parents=False):
        self.details.delete()
        AppointmentNote.objects.filter(appointment=self).delete()
        super(Appointment, self).delete()


class AppointmentNote(models.Model):
    CATEGORY = (('ENF', 'Enfermagem'), ('CLI', 'Clinica'), ('PSI', 'Psicologia'), ('OTR', 'Outras Apreciações'))
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    note = models.TextField()
    author = models.ForeignKey(BackofficeUser, on_delete=models.CASCADE)
    category = models.CharField(max_length=3, choices=CATEGORY)


# Medication


class Medicine(models.Model):
    activeSubs = models.TextField()
    name = models.TextField()
    pharmaceuticalForm = models.TextField()
    dosage = models.IntegerField()
    holder = models.TextField()
    generic = models.TextField()


class Prescription(models.Model):
    date = models.DateTimeField(auto_now=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    author = models.ForeignKey(UserAuth, on_delete=models.CASCADE)


class Medication(models.Model):
    STATE = (('E', 'Experimental'), ('A', 'Ativo'), ('I', 'Inativo'))
    quantity = models.IntegerField()
    state = models.CharField(max_length=2, choices=STATE)
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)

    def delete(self, using=None, keep_parents=False):
        self.details.delete()
        self.prescription.delete()
        super(Medication, self).delete()

class Take(models.Model):
    date = models.DateTimeField()
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)


# Session

class Session(models.Model):
    TYPE = (('I', 'Individual'), ('G', 'Grupo'))
    STATE = (('E', 'Espera'), ('A', 'Aceite'), ('R', 'Revisao'), ('C', 'Concluida'))
    topic = models.TextField()
    type = models.CharField(max_length=1, choices=TYPE)
    description = models.TextField()
    goal = models.TextField()
    material = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    details = models.OneToOneField(Event, on_delete=models.CASCADE)
    state = models.CharField(max_length=1, choices=STATE)
    # Relação many-to-many só tem que estar num model
    participants = models.ManyToManyField(UserAuth)

    def delete(self, using=None, keep_parents=False):
        self.details.delete()
        Evaluation.objects.filter(session=self).delete()
        super(Session, self).delete()


class Evaluation(models.Model):
    comment = models.TextField()
    participant = models.ForeignKey(UserAuth, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)

