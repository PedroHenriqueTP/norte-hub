from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

# Initialize LLM
# Note: Requires GOOGLE_API_KEY set in env or settings
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=settings.GOOGLE_API_KEY or "DUMMY_KEY_FOR_BUILD")

triage_template = """
You are a medical triage assistant. Analyze the patient's symptoms and suggest an urgency level (Low, Medium, High) and a specialty to consult (General/Cardiology/etc).
Do not provide medical diagnosis, only guidance.

Symptoms: {symptoms}

Response Format:
Urgency: [Level]
Specialty: [Doctor Type]
Advice: [Brief Advice]

Response:
"""

triage_prompt = PromptTemplate(template=triage_template, input_variables=["symptoms"])
output_parser = StrOutputParser()
# Use LCEL (LangChain Expression Language)
triage_chain = triage_prompt | llm | output_parser

    try:
        response = await triage_chain.ainvoke({"symptoms": symptoms})
        return response
    except Exception as e:
        print(f"AI Error: {e}")
        return "Urgency: Low\nSpecialty: General\nAdvice: Please consult a doctor. System could not classify."

# Admin / BI Logic
import os

def load_admin_prompt():
    prompt_path = os.path.join(os.path.dirname(__file__), "../core/prompts/admin_system_prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "You are a helpful SaaS Admin Assistant."

admin_prompt_template = """
{system_prompt}

Context Data (Financial & System):
{context_data}

User Query: {query}

Response:
"""

admin_prompt = PromptTemplate(template=admin_prompt_template, input_variables=["system_prompt", "context_data", "query"])
admin_chain = admin_prompt | llm | output_parser

async def process_admin_query(query: str, context_data: dict) -> str:
    system_prompt = load_admin_prompt()
    # Convert dict to string for prompt injection
    context_str = str(context_data)
    
    try:
        response = await admin_chain.ainvoke({
            "system_prompt": system_prompt,
            "context_data": context_str,
            "query": query
        })
        return response
    except Exception as e:
        print(f"AI Admin Error: {e}")
        return "I'm having trouble accessing the financial data right now. Please check the dashboard manually."
