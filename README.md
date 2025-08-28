# AI-PPT-Generator

AI-PPT-Generator is a Python-based tool that automatically generates PowerPoint presentations (PPT) using input text, images, and existing PPT files. It leverages Python libraries to create well-formatted slides with headings, bullet points, and background images.

## Features

- Generate slides from plain text or markdown-like input.
- Add headings, bullet points, and formatted text.
- Include images inline or as slide backgrounds.
- Supports generating slides from multiple input sources.

## Working 

The AI-PPT-Generator works by taking input text, or existing PPT content and converting it into fully formatted slides. Each slide is created by parsing the input into markdown: headings become slide titles, lines are converted into bullet points, and inline images are detected and added to the slide. After this the markdown file is passed to a llm, which then converts it and provides a new markdown, which is then converted to a ppt. A background image is also be applied to each slide. The app dynamically adjusts text placement and formatting to maintain readability, using Python libraries like python-pptx for slide creation and Pillow for image processing. This allows users to generate professional-looking presentations automatically from structured content.

## Screenshots

<img width="1855" height="924" alt="image" src="https://github.com/user-attachments/assets/d7a04f3c-0e86-4438-9f31-5ee8ae5d27c7" />

<img width="1920" height="1071" alt="image" src="https://github.com/user-attachments/assets/eaca32b2-350d-4f76-8ca4-87aa891d47e7" />

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/AI-PPT-Generator.git
cd AI-PPT-Generator
````

2. Create a virtual environment and activate it:

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Tech Stack

* `python-pptx`
* `Pillow`
* `Flask`
* `HTML`
* `CSS`
* `JS`
