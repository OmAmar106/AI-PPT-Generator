import requests

def ask_llm(md_text,api_key):


    md_text = r"""
    Important! You have been given the following PPT in markdown format. 
    Given the user prompt and the PPT, you must return **markdown with text only**. 
    You must **not add or modify any image references**. Use the existing images as-is; 
    do not invent new images (do not write any ![...](...) that doesn't already exist). 
    You may rearrange, edit, or add text only to improve the slides. 
    You may update headings, bullet points, or add new textual content. 
    Decide the number of slides as needed and try to fill the whole slides with content. 
    Remove any 'Slide No.' lines from the original markdown. 

    Do not generate any new images. Only modify or add text content.
    """ + md_text

    api_url = "https://aipipe.org/openrouter/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-4.1",
        "messages": [{"role": "user", "content":md_text}],
    }
    
    response = requests.post(api_url, headers=headers, json=payload)
    md_text = response.json()['choices'][0]['message']['content']
    print(md_text)

    md_text = md_text.replace("\r\n", "\n").replace("\r", "\n")
    slides = [slide.strip() for slide in md_text.split("\n---\n") if slide.strip()]
    return slides