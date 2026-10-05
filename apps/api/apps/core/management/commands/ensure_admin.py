import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = (
        "Creates the local Django Admin user from DJANGO_SUPERUSER_USERNAME, "
        "DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD. "
        "Does nothing if the user already exists, so setup can run again."
    )

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")

        if not username or not password:
            raise CommandError(
                "Set DJANGO_SUPERUSER_USERNAME and DJANGO_SUPERUSER_PASSWORD in .env."
            )

        User = get_user_model()
        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Admin user '{username}' already exists.")
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Admin user '{username}' created."))
