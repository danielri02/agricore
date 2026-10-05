from fastapi.testclient import TestClient
import pytest_asyncio

from app.main import app


@pytest_asyncio.fixture
async def test_client():
    with TestClient(app) as client:
        yield client
