import os
import re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_PARAGRAPH_ALIGNMENT
from modules.llm import ask_llm

def create_ppt(slides_md_list):
    prs = Presentation()
    
    for slide_md in ask_llm(slides_md_list):
        slide = prs.slides.add_slide(prs.slide_layouts[1])
        lines = slide_md.strip().split("\n")
        if not lines:
            continue
        
        # Set slide title
        slide.shapes.title.text = lines[0]
        body = slide.placeholders[1]
        text_frame = body.text_frame
        text_frame.clear()
        
        top_offset = Inches(1.5)
        for line in lines[1:]:
            match = re.match(r'!\[.*?\]\((.*?)\)', line)
            if match:
                img_path = 'extracted_images/' + match.group(1)
                if os.path.exists(img_path):
                    try:
                        slide.shapes.add_picture(img_path, Inches(1), top_offset, width=Inches(5))
                        top_offset += Inches(3)
                    except Exception as e:
                        print(f"Failed to add image {img_path}: {e}")
                continue
            
            para = text_frame.add_paragraph()
            para.alignment = PP_PARAGRAPH_ALIGNMENT.LEFT
            
            if line.startswith("# "):
                para.text = line[2:].strip()
                para.font.bold = True
                para.font.size = Pt(28)
            elif line.startswith("## "):
                para.text = line[3:].strip()
                para.font.bold = True
                para.font.size = Pt(24)
            elif line.startswith("### "):
                para.text = line[4:].strip()
                para.font.bold = True
                para.font.size = Pt(20)
            elif line.startswith("- "):
                para.text = line[2:].strip()
                para.level = 1
            else:
                runs = re.split(r'(\*\*.*?\*\*|\*.*?\*)', line)
                for run_text in runs:
                    run = para.add_run()
                    if run_text.startswith("**") and run_text.endswith("**"):
                        run.text = run_text[2:-2]
                        run.font.bold = True
                    elif run_text.startswith("*") and run_text.endswith("*"):
                        run.text = run_text[1:-1]
                        run.font.italic = True
                    else:
                        run.text = run_text
    
    return prs
