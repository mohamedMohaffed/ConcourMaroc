
from openai import OpenAI

client = OpenAI(
    api_key="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",
    base_url="https://api.groq.com/openai/v1",
)

response = client.responses.create(
    input="what is AI?",
    model="openai/gpt-oss-20b",
)

print(response.output_text)
