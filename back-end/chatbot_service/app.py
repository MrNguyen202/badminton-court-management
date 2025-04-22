from flask import Flask, request, jsonify
from flask_cors import CORS
from src.services.conversation_service import handle_conversation
from config import Config

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json or {}
    session_id = data.get('session_id')
    user_message = data.get('message', '').strip()
    
    response = handle_conversation(session_id, user_message)
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'])