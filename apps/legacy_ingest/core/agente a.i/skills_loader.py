import os

def load_skills(skills_dir="./skills"):
    """
    Reads all .py and .js files in the skills directory and
    returns them as a formatted string to inject into the AI's system prompt.
    """
    if not os.path.exists(skills_dir):
        return ""
        
    skills_context = "--- DYNAMIC SKILLS CONTEXT ---\n"
    skills_context += "The following are custom automated skills (scripts) that you can execute or reference. "
    skills_context += "You can run these scripts directly using your computer execution capabilities if the user asks for related tasks.\n\n"
    
    for filename in os.listdir(skills_dir):
        if filename.endswith(".py") or filename.endswith(".js"):
            filepath = os.path.join(skills_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                skills_context += f"--- START SKILL: {filename} ---\n{content}\n--- END SKILL: {filename} ---\n\n"
            except Exception as e:
                print(f"Error loading skill {filename}: {e}")
                
    return skills_context
