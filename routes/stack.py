from flask import Blueprint, render_template, request, session

stack_bp = Blueprint("stack", __name__)

@stack_bp.route("/works/stack", methods=["GET", "POST"])
def stack():
    items = session.get("stack_items", [])
    message = "System ready. Add your first value."

    if request.method == "POST":
        action = request.form.get("action", "")
        value = request.form.get("value", "").strip()

        if action == "push":
            if not value:
                message = "Please enter a value before pushing."
            elif len(items) >= 10:
                message = "Stack limit reached. Maximum is 10 items."
            else:
                items.append(value)
                message = f'"{value}" was pushed onto the stack.'

        elif action == "pop":
            if items:
                removed = items.pop()
                message = f'"{removed}" was removed from the stack.'
            else:
                message = "Cannot pop: the stack is empty."

        elif action == "peek":
            if items:
                message = f'Top element is "{items[-1]}". It remains in the stack.'
            else:
                message = "Cannot peek: the stack is empty."

        elif action == "clear":
            items.clear()
            message = "The stack has been cleared."

        session["stack_items"] = items
        session.modified = True

    return render_template(
        "stack.html",
        items=items,
        message=message
    )
