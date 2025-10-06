
from openai import OpenAI

# Initialize the client with your OpenRouter API key
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"  
)

# Create a chat completion using DeepSeek R1 (free)
completion = client.chat.completions.create(
    model="deepseek/deepseek-r1-0528",
    messages=[
        {"role": "user", "content": "i anserr bad on this quation lim e^ln(x) can give me a list like [] for course should i focus on."}
    ]
)

# Print the response from the model
print(completion.choices[0].message.content)
