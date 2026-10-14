from flask import Flask, render_template, request
import re
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


class Stack:
    def __init__(self):
        self.top = None

    def push(self, data):
        new_node = Node(data)
        if self.top:
            new_node.next = self.top
        self.top = new_node

    def pop(self):
        if self.top is None:
            return None

        popped_node = self.top
        self.top = self.top.next
        popped_node.next = None
        return popped_node.data

    def peek(self):
        if self.top:
            return self.top.data
        return None

    def print_stack(self):
        if self.top is None:
            print("Stack is empty")
            return

        current = self.top
        print("Stack elements (top → bottom):")
        while current:
            print(current.data)
            current = current.next


def infix_to_postfix(expression):
    import re

    tokens = re.findall(
        r'\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/^]',
        expression
    )

    if "".join(tokens) != re.sub(r"\s+", "", expression):
        raise ValueError("Invalid character in expression.")

    output = []
    operators = Stack()

    precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    }

    for token in tokens:
        if re.fullmatch(r'\d+(?:\.\d+)?|[A-Za-z_]\w*', token):
            output.append(token)

        elif token == "(":
            operators.push(token)

        elif token == ")":
            while operators.peek() is not None and operators.peek() != "(":
                output.append(operators.pop())

            if operators.peek() != "(":
                raise ValueError("Mismatched parentheses.")

            operators.pop()

        elif token in precedence:
            while operators.peek() in precedence:
                top_operator = operators.peek()

                higher = precedence[top_operator] > precedence[token]
                equal = precedence[top_operator] == precedence[token]

                if not higher and not (equal and token != "^"):
                    break

                output.append(operators.pop())

            operators.push(token)

    while operators.peek() is not None:
        if operators.peek() in ("(", ")"):
            raise ValueError("Mismatched parentheses.")
        output.append(operators.pop())

    return " ".join(output)


def infix_to_postfix_steps(expression):
    import re

    tokens = re.findall(
        r'\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/^]',
        expression
    )

    if "".join(tokens) != re.sub(r"\s+", "", expression):
        raise ValueError("Invalid character in expression.")

    output = []
    operators = Stack()
    steps = []

    precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    }

    def record_step(token, action):
        stack_items = []
        current = operators.top

        while current:
            stack_items.append(current.data)
            current = current.next

        steps.append({
            "token": token,
            "action": action,
            "stack": " ".join(stack_items) if stack_items else "Empty",
            "output": " ".join(output) if output else "Empty"
        })

    for token in tokens:
        if re.fullmatch(r'\d+(?:\.\d+)?|[A-Za-z_]\w*', token):
            output.append(token)
            record_step(token, "Add operand to output")

        elif token == "(":
            operators.push(token)
            record_step(token, "Push opening parenthesis")

        elif token == ")":
            while operators.peek() is not None and operators.peek() != "(":
                output.append(operators.pop())

            if operators.peek() != "(":
                raise ValueError("Mismatched parentheses.")

            operators.pop()
            record_step(token, "Pop until opening parenthesis")

        elif token in precedence:
            while operators.peek() in precedence:
                top_operator = operators.peek()

                higher = precedence[top_operator] > precedence[token]
                equal = precedence[top_operator] == precedence[token]

                if not higher and not (equal and token != "^"):
                    break

                output.append(operators.pop())

            operators.push(token)
            record_step(token, "Push operator onto stack")

    while operators.peek() is not None:
        if operators.peek() in ("(", ")"):
            raise ValueError("Mismatched parentheses.")

        output.append(operators.pop())
        record_step("End", "Pop remaining operator")

    return " ".join(output), steps

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



@app.route("/works/infix-to-postfix", methods=["GET", "POST"])
def infix_postfix():
    result = None
    error = None
    expression = ""
    steps = []

    if request.method == "POST":
        expression = request.form.get("expression", "").strip()

        if not expression:
            error = "Please enter an infix expression."
        else:
            try:
                result, steps = infix_to_postfix_steps(expression)
            except ValueError as e:
                error = str(e)

    return render_template(
        "infix_postfix.html",
        expression=expression,
        result=result,
        error=error,
        steps=steps
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


