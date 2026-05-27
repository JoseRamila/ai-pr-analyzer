from openai import (
    AsyncOpenAI,
    RateLimitError,
)
from fastapi import HTTPException, status


from app.core.settings import settings


class OpenAIClient:
    """
    Client responsible for communicating with OpenAI APIs.

    This class encapsulates all AI-related interactions and keeps
    external provider logic isolated from business logic.
    """

    def __init__(self) -> None:
        """
        Initialize the OpenAI async client using environment settings.
        """

        self.client = AsyncOpenAI(
            api_key=settings.openai_api_key,
        )

    async def analyze_pull_request(
        self,
        prompt: str,
    ) -> str:
        """
        Send a Pull Request analysis prompt to OpenAI.

        Returns the generated AI response as plain text.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a senior software engineer "
                            "performing professional code reviews."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.2,
            )

            return response.choices[0].message.content or ""

        except RateLimitError:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "OpenAI quota exceeded. "
                    "Please check billing and API usage."
                ),
            )

openai_client = OpenAIClient()