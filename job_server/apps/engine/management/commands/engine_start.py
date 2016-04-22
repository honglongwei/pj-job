#encoding: utf-8
from django.core.management.base import BaseCommand
from apps.engine import engine
from celery.bin import worker

worker = worker.worker(app = engine)

class Command(BaseCommand):
    def handle(self, *args, **options):
        worker.run()