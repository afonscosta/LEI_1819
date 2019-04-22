from django.core.management.base import BaseCommand, CommandError
import os

class Command(BaseCommand):
    help = 'Send notifications'

    def handle(self, *args, **options):
        os.system("""curl -X POST -H "Authorization: key=AAAAE93Q_ms:APA91bGzZrCpou98Sb1y0ug_zZB09zVBn9m--Tb4tPA9eZaocvPlSGgtK8X5QZKRR5i93ge5nOL32qguUyVeF9Wh2nyJn6gqcHvFstJ8EUJsY1xWB2rvt6wvHNPckV-vxrL7HGbHcGrD" -H "Content-Type: application/json" -d '{ "to": "fXd_N4KkulM:APA91bFrVzK2qStGxDOBmhJczxDajtUDMxI-Wju8R_nmlU868EK0_Za1hDzptDXauF-cBMgmObXWfT06-DBCevFon8uMp2L9WHAn46wTVvz2Bi8_PIDjoqLrFhbFxE6QcTfrYvqthHzM", "notification": { "title": "FCM Message", "body": "This is an FCM Message", "icon": "./img/icons/android-chrome-192x192.png" } }' https://fcm.googleapis.com/fcm/send""")
