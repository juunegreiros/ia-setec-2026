from django.test import SimpleTestCase
from rest_framework.test import APIClient


class HealthCheckTests(SimpleTestCase):
    """GET /api/health/ answers without touching the database."""

    def test_health_returns_200_and_ok_status(self):
        response = APIClient().get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(response.json()["service"], "workshop-pedidos-api")

    def test_health_rejects_post(self):
        response = APIClient().post("/api/health/", {}, format="json")

        self.assertEqual(response.status_code, 405)
