import base64
import json

from flask_cors import CORS
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from sqlalchemy import DateTime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'  # Define the upload folder path
app.config["SECRET_KEY"] = "asdfg"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:laura2243@localhost/Tourism"
CORS(app, supports_credentials=True, origins='https://localhost:4200')

db = SQLAlchemy(app)

def format_date(date_input):
    if isinstance(date_input, str):
        # Parse the date string to datetime object
        date_obj = datetime.strptime(date_input, "%m/%d/%Y")
    elif isinstance(date_input, datetime):
        # Date is already a datetime object
        date_obj = date_input
    else:
        raise TypeError("Invalid input type. Expected string or datetime object.")

    # Format the date as "DD/MM/YYYY" string
    formatted_date = date_obj.strftime("%m/%d/%Y")
    return formatted_date
