from django.db import models
from rest_framework import serializers


class Message(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()


# Atividades definidas no backoffice

class DefAtividade(models.Model):
    objetivo = models.IntegerField()


class Jogos(models.Model):
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class AtividadeFisica(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class LazerSocial(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


class LazerIndividual(models.Model):
    descricao = models.TextField()
    atividade = models.ForeignKey(DefAtividade, on_delete=models.CASCADE)


# Utilizadores

class Utilizador(models.Model):
    pass


class Cuidador(models.Model):
    pass


class Utente(models.Model):
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class UtilizadorBackoffice(models.Model):
    TIPO = (
    ('ADM', 'Administrador'), ('COR', 'Coordenador'), ('REM', 'Responsável Medicação'), ('PRF', 'Profissional Saúde'),
    ('MED', 'Médico'), ('ENF', 'Enfermeiro'), ('PSI', 'Psicólogo'))
    tipo = models.CharField(max_length=3, choices=TIPO)


# Historico

class ParamFisiologicos(models.Model):
    data = models.DateField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class ParamAnaliticos(models.Model):
    data = models.DateField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Agua(models.Model):
    data = models.DateField()
    quantidade = models.IntegerField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Sestas(models.Model):
    data = models.DateField()
    quantidade = models.IntegerField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Sono(models.Model):
    data = models.DateField()
    qualidade = models.BooleanField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Atividade(models.Model):
    TIPO = (('AF', 'Atividade Fisica'), ('LS', 'Lazer Social'), ('LI', 'Lazer Individual'))
    data = models.DateField()
    tipo = models.CharField(max_length=2, choices=TIPO)
    atividadeEspecifica = models.TextField(null=True, blank=True)
    duracao = models.TimeField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Refeicao(models.Model):
    TIPO = (('PA', 'Pequeno Almoço'), ('LM', 'Lanche Manhã'), ('AL', 'Almoço'), ('LT', 'LancheTarde'), ('JT', 'Jantar'))
    data = models.DateField()
    realizado = models.BooleanField()
    tipo = models.CharField(max_length=2, choices=TIPO)
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)


class Constituicao(models.Model):
    TIPO = (('CB', 'Carnes Brancas'), ('FT', 'Fruta'), ('VG', 'Vegetais'), ('FB', 'Fibras'), ('PC', 'Pré-cozinhados'),
            ('RF', 'Refrigerantes'), ('AL', 'Alcool'))
    alimento = models.CharField(max_length=2, choices=TIPO)
    refeicao = models.ForeignKey(Refeicao, on_delete=models.CASCADE)


# Evento

class Evento(models.Model):
    titulo = models.TextField()
    dataInicio = models.DateField()
    dataFim = models.DateField()
    # repeticao
    local = models.TextField()
    # cor
    descricao = models.TextField()


class Notificacao(models.Model):
    dataInicio = models.DateField()
    hora = models.TimeField()
    # repeticao
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)


# Consulta

class Consulta(models.Model):
    pass


class NotaConsulta(models.Model):
    CATEGORIA = (('ENF', 'Enfermagem'), ('CLI', 'Clinica'), ('PSI', 'Psicologia'), ('OTR', 'Outras Apreciações'))
    consulta = models.ForeignKey(Consulta, on_delete=models.CASCADE)
    nota = models.TextField()
    autor = models.ForeignKey(UtilizadorBackoffice, on_delete=models.CASCADE)
    categoria = models.CharField(max_length=3, choices=CATEGORIA)


# Medicação

# ver data type
class Medicamento(models.Model):
    subsAtiva = models.TextField()
    nome = models.TextField()
    formaFarmaceutica = models.TextField()
    dosagem = models.IntegerField()
    titular = models.TextField()
    generico = models.TextField()


class Prescricao(models.Model):
    data = models.DateField()
    utente = models.ForeignKey(Utente,on_delete=models.CASCADE)
    autor = models.ForeignKey(UtilizadorBackoffice, on_delete=models.CASCADE)


class Medicacao(models.Model):
    ESTADO = (('E', 'Experimental'), ('A', 'Ativo'), ('I', 'Inativo'))
    quantidade = models.IntegerField()
    estado = models.CharField(max_length=2, choices=ESTADO)
    detalhes = models.ForeignKey(Evento, on_delete=models.CASCADE)
    medicamento = models.ForeignKey(Medicamento, on_delete=models.CASCADE)
    prescricao = models.ForeignKey(Prescricao, on_delete=models.CASCADE)


class Tomas(models.Model):
    data = models.DateField()
    medicacao = models.ForeignKey(Medicacao, on_delete=models.CASCADE)


# Sessões
# FALTA OS PARTICIPANTES DA SESSÃO, FK NULA???

class Sessao(models.Model):
    TIPO = (('I', 'Individual'), ('G', 'Grupo'))
    ESTADO = (('E', 'Espera'), ('A', 'Aceite'), ('R', 'Revisao'), ('C', 'Concluida'))
    tema = models.TextField()
    tipo = models.CharField(max_length=1, choices=TIPO)
    descricao = models.TextField()
    objetivo = models.TextField()
    material = models.TextField()
    detalhes = models.ForeignKey(Evento, on_delete=models.CASCADE)
    estado = models.CharField(max_length=1, choices=ESTADO)


class Avaliacao(models.Model):
    comentario = models.TextField()
    cuidador = models.ForeignKey(Cuidador, on_delete=models.CASCADE)
    sessao = models.ForeignKey(Sessao, on_delete=models.CASCADE)

# ----------------- #


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('url', 'subject', 'body', 'pk')


class JogosSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Jogos
        fields = ('url', 'pk')


class DefAtividadeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DefAtividade
        fields = ('url', 'objetivo', 'pk')
