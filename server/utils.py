from flask_mail import Message
from extensions import mail

def send_temp_password(email, username, password):
    """Sends an email to the resident with a temporary username and password."""
    try:
        msg = Message(
            'Your Temporary Login Details',
            recipients=[email]
        )
        msg.body = f"Username: {username}\nPassword: {password}"
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {str(e)}")
