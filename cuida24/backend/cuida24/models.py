from django.db import models
from rest_framework import serializers, status
from rest_framework.response import Response
import logging


class Message(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('url', 'subject', 'body', 'pk')

    def create(self, validated_data):
        logger = logging.getLogger("mylogger")
        logger.info(validated_data)

        message = Message(
            subject="olaFromCode",
            body=validated_data['body'],
        )
        message.save()
        return message


# Atividades definidas no backoffice

class DefAtividade(models.Model):
    objetivo = models.IntegerField()


class DefAtividadeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DefAtividade
        fields = ('url', 'objetivo', 'pk')


class Jogos(models.Model):
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class JogosSerializer(serializers.HyperlinkedModelSerializer):
    atividade = DefAtividadeSerializer()

    class Meta:
        model = Jogos
        fields = ('url', 'pk')


class AtividadeFisica(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class AtividadeFisicaSerializer(serializers.HyperlinkedModelSerializer):
    atividade = DefAtividadeSerializer()

    class Meta:
        model = AtividadeFisica
        fields = ('url', 'descricao', 'pk')


class LazerSocial(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class LazerSocialSerializer(serializers.HyperlinkedModelSerializer):
    atividade = DefAtividadeSerializer()

    class Meta:
        model = LazerSocial
        fields = ('url', 'descricao', 'pk')


class LazerIndividual(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)

class LazerIndividualSerializer(serializers.HyperlinkedModelSerializer):
    atividade = DefAtividadeSerializer()

    class Meta:
        model = LazerIndividual
        fields = ('url', 'descricao', 'pk')


# Utilizadores

class Utilizador(models.Model):
    pass

# VER COMO SE FAZ O SERIALIZER COM HERANÇA

class Cuidador(models.Model):
    name = models.CharField(max_length=200)

class CuidadorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cuidador
        fields = ('url', 'pk', 'name')

# VER COMO SE FAZ O SERIALIZER COM HERANÇA

class Utente(models.Model):
    name = models.CharField(max_length=200)
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class UtenteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Utente
        fields = ('url', 'pk', 'name', 'cuidador')

class UtilizadorBackoffice(models.Model):
    TIPO = (
    ('ADM', 'Administrador'), ('COR', 'Coordenador'), ('REM', 'Responsável Medicação'), ('PRF', 'Profissional Saúde'),
    ('MED', 'Médico'), ('ENF', 'Enfermeiro'), ('PSI', 'Psicólogo'))
    tipo = models.CharField(max_length=3, choices=TIPO)


class UtilizadorBackOfficeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = UtilizadorBackoffice
        fields = ('url', 'tipo', 'pk')


# Historico

class ParamFisiologicos(models.Model):
    data = models.DateField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class ParamFisiologicos(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = ParamFisiologicos
        fields = ('url', 'data', 'pk')


class ParamAnaliticos(models.Model):
    data = models.DateField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class ParamAnaliticosSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = ParamAnaliticos
        fields = ('url', 'data', 'pk')


class Agua(models.Model):
    data = models.DateField()
    quantidade = models.IntegerField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class AguaSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = Agua
        fields = ('url', 'data', 'quantidade', 'pk')


class Sesta(models.Model):
    data = models.DateField()
    quantidade = models.IntegerField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class SestaSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = Sesta
        fields = ('url', 'data', 'quantidade', 'pk')


class Sono(models.Model):
    data = models.DateField()
    qualidade = models.BooleanField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class SonoSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = Sono
        fields = ('url', 'data', 'qualidade', 'pk')


class Atividade(models.Model):
    TIPO = (('AF', 'Atividade Fisica'), ('LS', 'Lazer Social'), ('LI', 'Lazer Individual'))
    data = models.DateField()
    tipo = models.CharField(max_length=2, choices=TIPO)
    atividadeEspecifica = models.TextField(null=True, blank=True)
    duracao = models.TimeField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class AtividadeSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = Atividade
        fields = ('url', 'data', 'tipo', 'atividadeEspecifica', 'duracao', 'pk')


class Refeicao(models.Model):
    TIPO = (('PA', 'Pequeno Almoço'), ('LM', 'Lanche Manhã'), ('AL', 'Almoço'), ('LT', 'LancheTarde'), ('JT', 'Jantar'))
    data = models.DateField()
    realizado = models.BooleanField()
    tipo = models.CharField(max_length=2, choices=TIPO)
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class RefeicaoSerializers(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()

    class Meta:
        model = Refeicao
        fields = ('url', 'data', 'realizado', 'tipo', 'pk')


class Constituicao(models.Model):
    TIPO = (('CB', 'Carnes Brancas'), ('FT', 'Fruta'), ('VG', 'Vegetais'), ('FB', 'Fibras'), ('PC', 'Pré-cozinhados'),
            ('RF', 'Refrigerantes'), ('AL', 'Alcool'))
    alimento = models.CharField(max_length=2, choices=TIPO)
    refeicao = models.ForeignKey(Refeicao, on_delete=models.CASCADE)


class ConstituicaoSerializer(serializers.HyperlinkedModelSerializer):
    refeicao = RefeicaoSerializers()

    class Meta:
        model = Constituicao
        fields = ('url', 'alimento', 'pk')


# Event

class Calendar(models.Model):
    calendar = models.TextField()
    color = models.CharField(max_length=8)
    forecolor = models.CharField(max_length=8, null=True, blank=True)

    def __str__(self):
        return self.calendar


class CalendarSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Calendar
        fields = ('url', 'calendar', 'color','forecolor')


class Event(models.Model):
    title = models.TextField()
    #dataInicio = models.DateField()
    #dataFim = models.DateField()
    # repeticao
    location = models.TextField()
    description = models.TextField()
    busy = models.BooleanField(null=True, blank=True)
    icon = models.TextField(null=True, blank=True)
    visible = models.BooleanField()
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class EventSerializer(serializers.HyperlinkedModelSerializer):
    visible = serializers.BooleanField(required=False)
    busy = serializers.BooleanField(required=False)
    visible = serializers.BooleanField(required=False)

    class Meta:
        model = Event
        fields = ('url', 'title', 'location', 'description', 'busy', 'icon', 'visible', 'calendar', 'pk')

    '''
    def create(self, validated_data):
        logger = logging.getLogger("mylogger")
        logger.info("OLA FROM SERIALIZER CREATE")
        logger.info(validated_data)

        event = Event(
            title=validated_data['data']['title'],
            location=validated_data['data']['location'],
            description=validated_data['data']['description'],
            calendario=Calendar.objects.get(color=validated_data['data']['color'])
        )
        
        event.save()
        return event
    '''


class Notificacao(models.Model):
    dataInicio = models.DateField()
    hora = models.TimeField()
    # repeticao
    evento = models.ForeignKey(Event, on_delete=models.CASCADE)


class NotificacaoSerializer(serializers.HyperlinkedModelSerializer):
    evento = EventSerializer()

    class Meta:
        model = Notificacao
        fields = ('url', 'dataInicio', 'hora', 'pk')



# Consulta

class Consulta(models.Model):
    detalhes = models.OneToOneField(Event, on_delete=models.CASCADE)


class ConsultaSerializer(serializers.HyperlinkedModelSerializer):
    detalhes = EventSerializer()

    class Meta:
        model = Consulta
        fields = ('url', 'pk')


class NotaConsulta(models.Model):
    CATEGORIA = (('ENF', 'Enfermagem'), ('CLI', 'Clinica'), ('PSI', 'Psicologia'), ('OTR', 'Outras Apreciações'))
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE)
    nota = models.TextField()
    autor = models.ForeignKey(UtilizadorBackoffice, on_delete=models.CASCADE)
    categoria = models.CharField(max_length=3, choices=CATEGORIA)


class ConsultaSerializer(serializers.HyperlinkedModelSerializer):
    consulta = ConsultaSerializer()
    autor = UtilizadorBackOfficeSerializer()

    class Meta:
        model = Consulta
        fields = ('url', 'nota', 'categoria', 'pk')


# Medicação

# ver data type
class Medicamento(models.Model):
    subsAtiva = models.TextField()
    nome = models.TextField()
    formaFarmaceutica = models.TextField()
    dosagem = models.IntegerField()
    titular = models.TextField()
    generico = models.TextField()


class MedicamentoSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Medicamento
        fields = ('url', 'subsAtiva', 'nome', 'formaFarmaceutica', 'dosagem', 'titular', 'generico', 'pk')


class Prescricao(models.Model):
    data = models.DateField()
    utente = models.ForeignKey(Utente,on_delete=models.CASCADE)
    autor = models.ForeignKey(UtilizadorBackoffice, on_delete=models.CASCADE)


class PrescricaoSerializer(serializers.HyperlinkedModelSerializer):
    utente = UtenteSerializer()
    autor = UtilizadorBackOfficeSerializer()

    class Meta:
        model = Prescricao
        fields = ('url', 'data', 'pk')


class Medicacao(models.Model):
    ESTADO = (('E', 'Experimental'), ('A', 'Ativo'), ('I', 'Inativo'))
    quantidade = models.IntegerField()
    estado = models.CharField(max_length=2, choices=ESTADO)
    detalhes = models.OneToOneField(Event, on_delete=models.CASCADE)
    medicamento = models.ForeignKey(Medicamento, on_delete=models.CASCADE)
    prescricao = models.ForeignKey(Prescricao, on_delete=models.CASCADE)


class MedicacaoSerializer(serializers.HyperlinkedModelSerializer):
    detalhes = EventSerializer()
    medicamento = MedicamentoSerializer()
    prescricao = PrescricaoSerializer()

    class Meta:
        model = Medicacao
        fields = ('url', 'quantidade', 'pk')


class Toma(models.Model):
    data = models.DateField()
    medicacao = models.ForeignKey(Medicacao, on_delete=models.CASCADE)


class TomaSerializer(serializers.HyperlinkedModelSerializer):
    medicacao = MedicacaoSerializer()

    class Meta:
        model = Toma
        fields = ('url', 'data', 'pk')


# Sessões

class Sessao(models.Model):
    TIPO = (('I', 'Individual'), ('G', 'Grupo'))
    ESTADO = (('E', 'Espera'), ('A', 'Aceite'), ('R', 'Revisao'), ('C', 'Concluida'))
    tema = models.TextField()
    tipo = models.CharField(max_length=1, choices=TIPO)
    descricao = models.TextField()
    objetivo = models.TextField()
    material = models.TextField()
    detalhes = models.OneToOneField(Event, on_delete=models.CASCADE)
    estado = models.CharField(max_length=1, choices=ESTADO)
    # Relação many-to-many só tem que estar num model
    participantes = models.ManyToManyField('Cuidador')

class SessaoSerializer(serializers.HyperlinkedModelSerializer):
    # Relação many-to-many
    participantes = CuidadorSerializer(many=True)
    detalhes = EventSerializer()

    class Meta:
        model = Sessao
        fields = ('url', 'tema', 'tipo', 'descricao', 'objetivo', 'material', 'estado', 'pk')


class Avaliacao(models.Model):
    comentario = models.TextField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)
    sessao = models.ForeignKey(Sessao, on_delete=models.CASCADE)


class AvaliacaoSerializer(serializers.HyperlinkedModelSerializer):
    cuidador = CuidadorSerializer()
    sessao = SessaoSerializer()

    class Meta:
        model = Avaliacao
        fields = ('url', 'comentario', 'pk')
