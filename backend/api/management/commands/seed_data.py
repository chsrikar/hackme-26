from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Seeds database with real participant registration data and teams'

    def handle(self, *args, **kwargs):
        call_command('seed_real_data')
