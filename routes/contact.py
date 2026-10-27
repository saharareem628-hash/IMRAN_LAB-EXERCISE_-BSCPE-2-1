import os
import smtplib
import logging
from email.message import EmailMessage
from flask import Blueprint, render_template, request

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/contact", methods=["GET", "POST"])
def contact():
    message = None
    success = False

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        user_message = request.form.get("message", "").strip()

        if not name or not email or not user_message:
            message = "Please fill in all fields."

        elif "@" not in email:
            message = "Please enter a valid email address."

        else:
            sender_email = os.getenv("GMAIL_ADDRESS")
            app_password = os.getenv("GMAIL_APP_PASSWORD")

            if not sender_email or not app_password:
                logging.error("EMAIL ERROR: Gmail environment variables are missing.")
                message = (
                    "Email sending is not configured yet. "
                    "Please try again later."
                )

            else:
                try:
                    recipient_email = "saharareem628@gmail.com"

                    msg = EmailMessage()
                    msg["Subject"] = f"Portfolio Contact from {name}"
                    msg["From"] = sender_email
                    msg["To"] = recipient_email
                    msg["Reply-To"] = email

                    msg.set_content(
                        f"Name: {name}\n"
                        f"Email: {email}\n\n"
                        f"Message:\n{user_message}"
                    )

                    with smtplib.SMTP_SSL(
                        "smtp.gmail.com", 465, timeout=20
                    ) as server:
                        server.login(sender_email, app_password)
                        server.send_message(msg)

                    message = "Your message was sent successfully!"
                    success = True

                except Exception:
                    logging.exception(
                        "EMAIL ERROR: Failed to send contact form email."
                    )
                    message = (
                        "Sorry, your message could not be sent. "
                        "Please try again later."
                    )

    return render_template(
        "contact.html",
        message=message,
        success=success
    )
