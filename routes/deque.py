from flask import Blueprint, render_template, request, session

deque_bp = Blueprint("deque", __name__)

CAPACITY = 100


def get_deque():
    """Restore the circular array state from the Flask session."""
    state = session.get("deque_state")

    if not state:
        return [None] * CAPACITY, 0, -1, 0

    return (
        state["array"],
        state["front"],
        state["rear"],
        state["size"]
    )


def save_deque(array, front, rear, size):
    """Save the circular array state to the Flask session."""
    session["deque_state"] = {
        "array": array,
        "front": front,
        "rear": rear,
        "size": size
    }


@deque_bp.route("/deque", methods=["GET", "POST"])
def deque_page():
    array, front, rear, size = get_deque()
    message = None
    success = False

    if request.method == "POST":
        action = request.form.get("action", "")
        value = request.form.get("value", "").strip()

        if action in ("add_front", "add_rear") and not value:
            message = "Please enter a value."

        elif action in ("add_front", "add_rear") and size >= CAPACITY:
            message = "Deque is full. Remove an item before adding another."

        elif action == "add_front":
            if size == 0:
                front = rear = 0
            else:
                front = (front - 1) % CAPACITY

            array[front] = value
            size += 1
            message = f'"{value}" added to the front.'
            success = True

        elif action == "add_rear":
            if size == 0:
                front = rear = 0
            else:
                rear = (rear + 1) % CAPACITY

            array[rear] = value
            size += 1
            message = f'"{value}" added to the rear.'
            success = True

        elif action == "remove_front":
            if size == 0:
                message = "Deque is empty. Nothing to remove."
            else:
                removed = array[front]
                array[front] = None
                size -= 1

                if size == 0:
                    front, rear = 0, -1
                else:
                    front = (front + 1) % CAPACITY

                message = f'Removed "{removed}" from the front.'
                success = True

        elif action == "remove_rear":
            if size == 0:
                message = "Deque is empty. Nothing to remove."
            else:
                removed = array[rear]
                array[rear] = None
                size -= 1

                if size == 0:
                    front, rear = 0, -1
                else:
                    rear = (rear - 1) % CAPACITY

                message = f'Removed "{removed}" from the rear.'
                success = True

        elif action == "peek_front":
            if size:
                message = f"Front item: {array[front]}"
                success = True
            else:
                message = "Deque is empty."

        elif action == "peek_rear":
            if size:
                message = f"Rear item: {array[rear]}"
                success = True
            else:
                message = "Deque is empty."

        elif action == "clear":
            array = [None] * CAPACITY
            front, rear, size = 0, -1, 0
            message = "Deque cleared successfully."
            success = True

        # Store updated state after every operation.
        save_deque(array, front, rear, size)

    # Build the displayed items in logical front-to-rear order.
    items = [
        array[(front + i) % CAPACITY]
        for i in range(size)
    ]

    return render_template(
        "deque.html",
        items=items,
        message=message,
        success=success
    )
