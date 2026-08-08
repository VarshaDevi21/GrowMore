import json
import re
import logging
import asyncio
from typing import Dict, Any, Optional
from openai import AsyncOpenAI, APIConnectionError, APIStatusError

from core.config import settings
from services.llm.base import BaseLLMProvider

logger = logging.getLogger("ai-interview-agent.llm.nvidia")

class NvidiaLLMProvider(BaseLLMProvider):
    """
    NVIDIA API LLM Provider implementation using OpenAI-compatible SDK.
    Connects to NVIDIA NIM endpoints (e.g. https://integrate.api.nvidia.com/v1).
    """

    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL
        self.model_name = settings.NVIDIA_MODEL
        
        # Check if valid key is set
        self.is_key_configured = bool(
            self.api_key and self.api_key.strip() and self.api_key != "add your api key"
        )
        
        if self.is_key_configured:
            # Mask API key for secure logging
            masked_key = self.api_key[:4] + "..." + self.api_key[-4:] if len(self.api_key) > 8 else "***"
            logger.info(f"Initialized NvidiaLLMProvider with model '{self.model_name}' at base URL '{self.base_url}' (Key: {masked_key}).")
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
                timeout=25.0
            )
        else:
            logger.warning("NvidiaLLMProvider initialized without active API key. Operating in fallback mock mode.")
            self.client = None

    async def generate_completion(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate text completion from NVIDIA API with retry & error handling."""
        if not self.is_key_configured or self.client is None:
            return self._mock_completion(prompt, system_prompt)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=1024
                )
                content = response.choices[0].message.content
                return content.strip() if content else ""
            except (APIConnectionError, APIStatusError) as err:
                logger.error(f"NVIDIA API Error on attempt {attempt + 1}/{max_retries + 1}: {err}")
                if attempt == max_retries:
                    logger.warning("Max retries exhausted for NVIDIA API. Falling back to structured response.")
                    return self._mock_completion(prompt, system_prompt)
                await asyncio.sleep(1.0)
            except Exception as e:
                logger.error(f"Unexpected error calling NVIDIA API: {str(e)}", exc_info=True)
                return self._mock_completion(prompt, system_prompt)

    async def generate_structured_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.2
    ) -> Dict[str, Any]:
        """Generate structured JSON response from NVIDIA API."""
        json_sys_prompt = (system_prompt or "") + "\n\nCRITICAL: You MUST respond ONLY with valid JSON matching the requested schema. Do not include markdown codeblocks or surrounding conversational text."
        
        if not self.is_key_configured or self.client is None:
            return self._mock_structured_json(prompt)

        messages = []
        if json_sys_prompt.strip():
            messages.append({"role": "system", "content": json_sys_prompt})
        messages.append({"role": "user", "content": prompt})

        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=temperature,
                    response_format={"type": "json_object"},
                    max_tokens=1024
                )
                raw_text = response.choices[0].message.content or "{}"
                return self._parse_json_safe(raw_text)
            except (APIConnectionError, APIStatusError) as err:
                logger.error(f"NVIDIA API Error on attempt {attempt + 1}/{max_retries + 1}: {err}")
                if attempt == max_retries:
                    return self._mock_structured_json(prompt)
                await asyncio.sleep(1.0)
            except Exception as e:
                logger.error(f"Error parsing NVIDIA API JSON response: {str(e)}")
                return self._mock_structured_json(prompt)

    def _parse_json_safe(self, text: str) -> Dict[str, Any]:
        """Safely parse JSON from raw text, removing code fences if present."""
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\n?", "", text, flags=re.IGNORECASE)
            text = re.sub(r"\n?```$", "", text)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback regex extraction of JSON object
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
            logger.error(f"Failed to parse JSON from text: {text[:100]}...")
            return {}

    def _mock_completion(self, prompt: str, system_prompt: Optional[str]) -> str:
        """Fallback mock text completion when API key is unconfigured or offline."""
        logger.info("Using fallback mock completion.")
        return "Thank you for sharing your answer. Can you elaborate on the core technical architecture behind that concept?"

    def _mock_structured_json(self, prompt: str) -> Dict[str, Any]:
        """Fallback mock JSON response when API key is unconfigured or offline."""
        logger.info("Using fallback mock structured JSON.")
        return {
            "completeness_score": 0.8,
            "accuracy_score": 0.85,
            "logic_score": 0.8,
            "tone_clarity_score": 0.9,
            "time_mgmt_score": 1.0,
            "classification": "Strong",
            "technical_terms_detected": ["Python", "FastAPI", "API"],
            "missing_concepts": [],
            "incorrect_concepts": [],
            "recommended_difficulty": "Medium"
        }
