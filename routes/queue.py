from flask import Blueprint, render_template, request, session

queue_bp = Blueprint("queue", __name__)


@queue_bp.route("/queue", methods=["GET", "POST"])
def queue():
    items = session.get("queue_items", [])
    message = None
    success = False

    if request.method == "POST":
        action = request.form.get("action", "")
        value = request.form.get("value", "").strip()

        if action == "enqueue":
            if not value:
                message = "Please enter a value."
            else:
                items.append(value)
                message = f'"{value}" added to the rear of the queue.'
                success = True

        elif action == "dequeue":
            if items:
                removed = items.pop(0)
                message = f'Removed "{removed}" from the front.'
                success = True
            else:
                message = "Queue is empty. Nothing to remove."

        elif action == "peek":
            if items:
                message = f"Front item: {items[0]}"
                success = True
            else:
                message = "Queue is empty."

        elif action == "clear":
            items = []
            message = "Queue cleared successfully."
            success = True

        session["queue_items"] = items
        session.modified = True

    return render_template(
        "queue.html",
        items=items,
        message=message,
        success=success
    )
