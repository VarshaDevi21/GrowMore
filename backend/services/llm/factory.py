from services.llm.base import BaseLLMProvider
from services.llm.nvidia_provider import NvidiaLLMProvider

def get_llm_provider() -> BaseLLMProvider:
    """
    Factory function to instantiate and return the active LLM provider.
    Allows easy substitution of alternative LLM providers in the future.
    """
    return NvidiaLLMProvider()
