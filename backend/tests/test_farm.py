
import pytest
import pytest_asyncio


async def test_farms_get(test_client):
    response = await test_client.get("/farms")
    assert response.status_code == 200
