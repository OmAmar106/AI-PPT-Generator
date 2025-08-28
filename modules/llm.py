
def ask_llm(md_text):
    md_text = md_text.replace("\r\n", "\n").replace("\r", "\n")
    slides = [slide.strip() for slide in md_text.split("\n---\n") if slide.strip()]
    return slides