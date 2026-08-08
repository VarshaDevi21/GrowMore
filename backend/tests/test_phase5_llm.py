import asyncio
import pytest
from services.llm.base import BaseLLMProvider
from services.llm.factory import get_llm_provider
from services.llm.nvidia_provider import NvidiaLLMProvider

def test_llm_provider_instantiation():
    """Verify that factory returns a valid BaseLLMProvider implementation."""
    provider = get_llm_provider()
    assert isinstance(provider, BaseLLMProvider)
    assert isinstance(provider, NvidiaLLMProvider)

def test_llm_generate_completion():
    """Test plain text completion generation."""
    provider = get_llm_provider()
    res = asyncio.run(
        provider.generate_completion(
            prompt="Explain what a vector embedding is in one sentence.",
            system_prompt="You are a technical interviewer."
        )
    )
    assert isinstance(res, str)
    assert len(res) > 0

def test_llm_generate_structured_json():
    """Test structured JSON generation."""
    provider = get_llm_provider()
    res = asyncio.run(
        provider.generate_structured_json(
            prompt="Evaluate candidate response: 'FastAPI is a modern web framework for Python.'",
            system_prompt="Return evaluation JSON with completeness_score and classification."
        )
    )
    assert isinstance(res, dict)
    assert "classification" in res
    assert "completeness_score" in res

def test_json_safe_parser():
    """Test robustness of JSON parsing helper against markdown code fences."""
    provider = NvidiaLLMProvider()
    
    markdown_json = "```json\n{\"status\": \"ok\", \"score\": 0.9}\n```"
    parsed = provider._parse_json_safe(markdown_json)
    assert parsed == {"status": "ok", "score": 0.9}

    raw_json = "{\"status\": \"ok\", \"score\": 0.9}"
    parsed_raw = provider._parse_json_safe(raw_json)
    assert parsed_raw == {"status": "ok", "score": 0.9}
