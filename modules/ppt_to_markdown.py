from pptx import Presentation
import os

def pptx_to_markdown(pptx_path, output_dir="extracted_images"):
    prs = Presentation(pptx_path)
    os.makedirs(output_dir, exist_ok=True)

    markdown_lines = []

    for i, slide in enumerate(prs.slides, start=1):
        markdown_lines.append(f"# Slide {i}\n")
        
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text.strip():
                markdown_lines.append(shape.text.strip() + "\n")
            
            if shape.shape_type == 13:
                image = shape.image
                image_bytes = image.blob
                ext = image.ext
                img_filename = f"{output_dir}/slide{i}_{shape.shape_id}.{ext}"
                with open(img_filename, "wb") as f:
                    f.write(image_bytes)
                markdown_lines.append(f"![Image]({img_filename})\n")
                
        markdown_lines.append("\n---\n")

    markdown_text = "\n".join(markdown_lines)
    return markdown_text

md = pptx_to_markdown("input.pptx")
with open("output.md", "w", encoding="utf-8") as f:
    f.write(md)
