from flask import Flask, render_template,request
from flask_cors import CORS

app = Flask(__name__, template_folder='templates')
CORS(app)

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/process',methods=['POST'])
def process():
    text = request.form.get('text')
    files = request.files.getlist('files[]')

    # print(text)
    # if files:
    #     for f in files:
    #         print("File:", f.filename)

    # return {"message":""}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True)