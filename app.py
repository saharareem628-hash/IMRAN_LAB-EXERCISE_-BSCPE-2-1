from flask import Flask, render_template, request

app = Flask(__name__)


# -------------------------
# Linked List Implementation
# -------------------------

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
        else:
            current = self.head

            while current.next:
                current = current.next

            current.next = new_node

    def add_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def delete(self, data):
        current = self.head
        previous = None

        while current:
            if current.data == data:

                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next

                return True

            previous = current
            current = current.next

        return False

    def delete_at_beginning(self):
        if self.head is None:
            return None

        deleted_data = self.head.data
        self.head = self.head.next

        return deleted_data

    def search(self, data):
        current = self.head

        while current:
            if current.data == data:
                return True

            current = current.next

        return False

    def to_list(self):
        result = []
        current = self.head

        while current:
            result.append(current.data)
            current = current.next

        return result


# Create linked list
linked_list = LinkedList()

# Some initial values
linked_list.add("Python")
linked_list.add("Flask")
linked_list.add("HTML")
linked_list.add("CSS")


# -------------------------
# Home
# -------------------------

@app.route("/")
def index():
    return render_template("index.html")


# -------------------------
# Profile
# -------------------------

@app.route("/profile")
def profile():
    return render_template("profile.html")


# -------------------------
# Programming Works
# -------------------------

@app.route("/works")
def works():
    return render_template("works.html")


# -------------------------
# Area of Circle
# -------------------------

@app.route("/works/area/circle", methods=["GET", "POST"])
def acircle():

    result = None
    error = None

    if request.method == "POST":

        try:
            radius = float(request.form.get("radius", ""))

            if radius < 0:
                error = "Radius cannot be negative."
            else:
                result = 3.14159 * radius * radius

        except ValueError:
            error = "Please enter a valid number."

    return render_template(
        "circle.html",
        result=result,
        error=error
    )


# -------------------------
# Area of Triangle
# -------------------------

@app.route("/works/area/triangle", methods=["GET", "POST"])
def triangle():

    result = None
    error = None

    if request.method == "POST":

        try:
            base = float(request.form.get("base", ""))
            height = float(request.form.get("height", ""))

            if base < 0 or height < 0:
                error = "Base and height cannot be negative."
            else:
                result = 0.5 * base * height

        except ValueError:
            error = "Please enter valid numbers."

    return render_template(
        "triangle.html",
        result=result,
        error=error
    )


# -------------------------
# Linked List
# -------------------------

@app.route("/works/linked-list", methods=["GET", "POST"])
def linkedlist():
    message = None

    if request.method == "POST":

        action = request.form.get("action")
        value = request.form.get("value", "").strip()

        if action == "add_beginning":

            if value:
                linked_list.add_at_beginning(value)
                message = f'"{value}" was added at the beginning.'
            else:
                message = "Please enter a value."

        elif action == "add":

            if value:
                linked_list.add(value)
                message = f'"{value}" was added to the linked list.'
            else:
                message = "Please enter a value."

        elif action == "delete_beginning":

            deleted = linked_list.delete_at_beginning()

            if deleted is not None:
                message = f'"{deleted}" was deleted from the beginning.'
            else:
                message = "The linked list is empty."

        elif action == "delete":

            if linked_list.delete(value):
                message = f'"{value}" was deleted.'
            else:
                message = f'"{value}" was not found.'

        elif action == "search":

            if linked_list.search(value):
                message = f'"{value}" was found in the linked list.'
            else:
                message = f'"{value}" was not found.'

    return render_template(
        "linkedlist.html",
        items=linked_list.to_list(),
        message=message
    )

# -------------------------
# Contact
# -------------------------

@app.route("/contact", methods=["GET", "POST"])
def contact():
    message = None

    if request.method == "POST":
        message = "Thank you! Your message has been received."

    return render_template("contact.html", message=message)


# -------------------------
# Run Application
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)
