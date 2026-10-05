from io import StringIO
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

ADMIN_ENV = {
    "DJANGO_SUPERUSER_USERNAME": "admin",
    "DJANGO_SUPERUSER_EMAIL": "admin@example.com",
    "DJANGO_SUPERUSER_PASSWORD": "admin",
}


class EnsureAdminCommandTests(TestCase):
    @mock.patch.dict("os.environ", ADMIN_ENV)
    def test_creates_superuser_from_env(self):
        call_command("ensure_admin", stdout=StringIO())

        user = get_user_model().objects.get(username="admin")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.check_password("admin"))

    @mock.patch.dict("os.environ", ADMIN_ENV)
    def test_running_twice_keeps_a_single_user(self):
        call_command("ensure_admin", stdout=StringIO())
        call_command("ensure_admin", stdout=StringIO())

        self.assertEqual(get_user_model().objects.filter(username="admin").count(), 1)

    @mock.patch.dict("os.environ", {**ADMIN_ENV, "DJANGO_SUPERUSER_PASSWORD": ""})
    def test_missing_password_fails_with_clear_message(self):
        with self.assertRaises(CommandError):
            call_command("ensure_admin", stdout=StringIO())
