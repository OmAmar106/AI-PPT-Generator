from flask import Flask, render_template,request, send_file
from flask_cors import CORS
from modules.ppt_to_markdown import pptx_to_markdown
from io import BytesIO
from modules.ppt import create_ppt

app = Flask(__name__, template_folder='templates')
CORS(app)


@app.route('/')
def start():
    return render_template('index.html')

@app.route('/process',methods=['POST'])
def process():
    text = request.form.get('text')
    files = request.files.getlist('files[]')
    apikey = request.form.get('api_key')

    if not text:
        text = ''

    md_results = []

    for f in files:
        if f.filename.endswith(".pptx") or f.filename.endswith(".ppt"):
            pptx_bytes = f.read()
            md = pptx_to_markdown(pptx_bytes)
            # start.append(start1)
            # end.append(end1)
            md_results.append(md)
    # print({"text": text, "presentations": md_results})
    
    # start,end = start[0],end[0]

    fans = 'Prompt:'+text+'\n\nPPT Contents:\n\n'+'\n\n'.join(md_results)
    ppt_bytes = BytesIO()
    create_ppt(fans,apikey).save(ppt_bytes)
    ppt_bytes.seek(0)
    # print(fans)
    return send_file(
        ppt_bytes,
        as_attachment=True,
        download_name="presentation.pptx",
        mimetype="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5069,debug=True)