from flask import Flask,jsonify,request,send_from_directory
from flask_cors import CORS
from openai import OpenAI
import uuid
import os
import json
import re
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from PIL import Image
import pytesseract
import tempfile
import json

app=Flask(__name__)
CORS(app) 


# load .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")




client = OpenAI(api_key=OPENAI_API_KEY)
Audio_folder = "./uploads"
os.makedirs(Audio_folder, exist_ok=True)


@app.route('/chat', methods=["POST"])
def replay():
    try:
        data = request.json

        message = data.get("message")
        model_info = data.get("ID")
        history = data.get("history", [])

        if model_info != "none":
            goals = model_info.get("Goals", "")
            style = model_info.get("style", "")
            type_of_model = model_info.get("type", "")

            system_prompt = f"""
You are an AI model called AImate.
- Model Type: {type_of_model}
- Style: {style}
- Goals: {goals}

Stay consistent with this role while chatting. 
Be friendly, supportive, and context-aware.
Try often to remember the user's goals and previous messages.
"""
        else:
            system_prompt = """
A short description of the university and a common question asked about it.
Example: "You want to know scholarship plans at Howard University."
"""

        # Start building the message list
        messages = [{"role": "system", "content": system_prompt.strip()}]

        # Append chat history if any
        if isinstance(history, list):
            for item in history:
                role = item.get("role", "user")  # default to 'user'
                content = item.get("content", "")
                if content:  # Avoid empty messages
                    messages.append({"role": role, "content": content})

        # Add current user message
        messages.append({"role": "user", "content": message})

        # Send to OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150
        )

        ai_message = response.choices[0].message.content

        return jsonify({
            "id": 1234567,
            "message": ai_message
        })

    except Exception as e:
        print("Error in /chat:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/live',methods=["POST"])
def live_chat():
    data=request.json
    URL=data.get("URl")
    # role=data.get("Role")
    # name=data.get("name")
    # type_AI=data.get("type")
    role="Designer"
    name="pikachu"
    type_AI="introvert"

    with open("audio.wav",'rb') as audio_file:
        transcript=client.audio.transcriptions.create(
            model="gpt-4o-mini-transcribe",
            file=audio_file
        )
    text=transcript.text

    response=client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role":"system","content":f"Your role is {role} and act like {type_AI} and your name is {name}"},
            {"role":"user","content":text}
        ],
        max_tokens=300
    )    
    answer=response.choices[0].message.content

    

    final= client.audio.speech.with_raw_response.create(
        model="gpt-4o-mini-tts",
        voice='ash',
        input=answer
    ) 

    with open("answer.mp3", "wb") as f:
        f.write(final.content)

    return jsonify({"message":"Done "})    



@app.route('/upload', methods=["POST"])
def upload_voice():
    if "file" not in request.files:
        return jsonify({'error': "No file provided"}), 400

    try:
        # === Save Uploaded File ===
        file = request.files["file"]
        filename = f"{uuid.uuid4()}.webm"
        safe_path = os.path.join(Audio_folder, secure_filename(filename))
        file.save(safe_path)

        # === Personality ===
        personality = request.form.get("personality", "Steve Jobs")
        role = "businessman"
        name = personality
        type_ai = f"Acts like {personality} and personality similar to him"
        language = "urdu"

        # === Transcribe Audio ===
        with open(safe_path, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=audio_file
            )
        user_input = transcript.text

        if not user_input.strip():
            return jsonify({'error': "Audio transcription failed or empty."}), 400

        # === Get AI Reply ===
        system_prompt = (
            f"Your role is {role}. Act like {type_ai}. "
            f"Your name is {name}. Always respond in {language}."
        )

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            max_tokens=300
        )

        answer = response.choices[0].message.content

        # === Generate Speech ===
        speech_response = client.audio.speech.with_raw_response.create(
            model="gpt-4o-mini-tts",
            voice="ash",
            input=answer
        )

        audio_output_name = f"{uuid.uuid4()}.mp3"
        audio_output_path = os.path.join(Audio_folder, secure_filename(audio_output_name))
        with open(audio_output_path, "wb") as out_f:
            out_f.write(speech_response.content)
            

        print("Saved audio file to:", audio_output_path)
        print("Size:", os.path.getsize(audio_output_path), "bytes")
            
        if not os.path.exists(audio_output_path):
            print("❌ File was not saved!")

        return jsonify({
            "message": answer,
            "filename": audio_output_name
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "stage": "processing"
        }), 500


@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory(Audio_folder, filename)


@app.route("/test",methods=["POST"])
def create_TEST():
   try:
        data=request.json

        sallabus=data["sallabus"]
        chapter=data["chapter"]
        topic=data["topic"]
        subTopic=data["subtopic"]

        response=client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": """
You are an AI tutor that generates multiple-choice questions (MCQs).
Your job is to create exactly 5 questions for students.
Each question must have:
- A clear question statement.
- 4 options labeled A, B, C, D.
- The correct answer.
- A difficulty level: Easy, Medium, or Hard.
Return the output in JSON format.
"""},
            {"role":"user","content":f'''
Create a 5-question multiple choice test for the sallabus: "{sallabus}" 
and chapter: "{chapter}".
with the topic:{topic} and the subtopic :{subTopic}
Make sure the difficulty levels are mixed (at least 1 Easy, 2 Medium, 2 Hard).

'''}
        ]
    )

        raw_answer = response.choices[0].message.content
        cleaned = re.sub(r"```json|```", "", raw_answer).strip()

        # Parse into Python object
        parsed_json = json.loads(cleaned)


        return jsonify({
        "status":"secessfull",
        "answer":parsed_json
    })

   except Exception as e:
       return jsonify({
           "status":"ERROR",
           "ERROR":str(e)
       })


@app.route("/community",methods=["POST"])
def community():
    try:
        data=request.json
        text=data.get("message")

        system_prompt='''
I will give you a short description of a community or event type.
Based on that description, generate a JSON schema of fields that should be collected for it.
Each field should include:

"name": the field name

"type": data type (string, number, date, boolean, etc.)

"required": true/false

Example input:
"A Model United Nations conference for students to participate in debates and discussions"

Example output:

{
  "communityType": "MUN",
  "fields": [
    { "name": "Name", "type": "string", "required": true },
    { "name": "Description", "type": "string", "required": true },
    { "name": "Venue", "type": "string", "required": true },
    { "name": "Date", "type": "date", "required": true },
    { "name": "Price", "type": "number", "required": false },
    { "name": "Organizer", "type": "string", "required": true }
  ]
}


Please always output only JSON, with "communityType" guessed from the description, and "fields" generated accordingly.
Also always remeber to add instagram account in every condition 
'''

        response=client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {"role":"system","content":system_prompt},
            {"role":"user","content":text}
        ],
        max_tokens=600
    )
        

        raw_answer = response.choices[0].message.content
        cleaned = re.sub(r"```json|```", "", raw_answer)
        parsed = json.loads(cleaned)
        return jsonify({
        "status":"Succesful",
        "message":parsed
    })

    except Exception as e:
        return jsonify({
            "status":"Failed",
            "message":str(e)
        })


@app.route("/imageUploader", methods=["POST"])
def image_uploader():
    if "file" not in request.files:
        return jsonify({"status": "FAIL", "message": "No file uploaded"}), 400

    file = request.files["file"]

 

    # ✅ Save uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name  # Save path to use later

    try:

        text = pytesseract.image_to_string(Image.open(temp_path))

        if not text.strip():
            return jsonify({"status": "FAIL", "message": "No text detected in image"}), 400

        openai.api_key = os.getenv("OPENAI_API_KEY")  # Or hardcode your key for testing

        prompt = f"""
        Convert the following study notes into short, clear flashcards. Each flashcard should be a bullet point with a clear question or concept.

        Text:
        {text}
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        output = response['choices'][0]['message']['content']
        return jsonify({"status": "PASS", "message": output})

    except Exception as e:
        return jsonify({"status": "FAIL", "message": str(e)}), 500

    finally:
        # ✅ Clean up temp file
        os.remove(temp_path)


@app.route("/uniFinder",methods=["POST"])
def uniFinder():
    data = request.get_json()
    try:
        form=data.get("form")
        counteries=data.get("countries")

        prompt = """
You are an expert AI academic advisor specializing in global university admissions and scholarships. 
Your task is to recommend 3 universities that best fit a student's background, academic performance, financial situation, and personal goals.

You must return your response strictly in the following JSON format — do NOT include any explanation, markdown, or natural text outside the JSON block.

Each university recommendation must include the following fields:

{
  "recommendations": [
    {
      "university": "Name",
      "location": "City, Country",
      "qs_ranking": 0,
      "scholarship": "Max scholarship (in percentage) or financial aid available",
      "application_deadline": "Approximate deadline (e.g. Jan 15)",
      "official_website": "URL or 'Not available'",
      "acceptance_rate": "Percentage or 'Not available'"
    },
    ...
  ]
}

Only return valid JSON. Do not wrap the JSON in markdown or add any text before or after the JSON.
"""


        user=f"""
the user info is {form} and the acceptable counteries is {counteries}
    """
      
        response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user}
    ]
)
        ai_message = response.choices[0].message.content
        response_dict = json.loads(ai_message)

        return jsonify({"status":"PASS","message":response_dict})

    except Exception as e:
        return jsonify({
            "Status":"FAIL",
            "message":str(e)
        })    


@app.route("/ping",methods=['GET'])
def ping():
    return jsonify({"status":"Done"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
