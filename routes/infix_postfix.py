import re
from flask import Blueprint, render_template, request


infix_bp = Blueprint("infix", __name__)


class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0


def infix_to_postfix(expression):
    precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    }

    tokens = re.findall(
        r'\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/^]',
        expression
    )

    stack = []
    output = []

    for token in tokens:
        if re.fullmatch(r'\d+(?:\.\d+)?|[A-Za-z_]\w*', token):
            output.append(token)

        elif token == "(":
            stack.append(token)

        elif token == ")":
            while stack and stack[-1] != "(":
                output.append(stack.pop())

            if not stack:
                raise ValueError("Mismatched parentheses.")

            stack.pop()

        else:
            while (
                stack
                and stack[-1] != "("
                and (
                    precedence.get(stack[-1], 0) > precedence[token]
                    or (
                        precedence.get(stack[-1], 0) == precedence[token]
                        and token != "^"
                    )
                )
            ):
                output.append(stack.pop())

            stack.append(token)

    if any(token not in precedence for token in stack):
        raise ValueError("Mismatched parentheses.")

    while stack:
        output.append(stack.pop())

    return " ".join(output)


def infix_to_postfix_steps(expression):
    tokens = re.findall(
        r'\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/^]',
        expression
    )

    precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    }

    stack = []
    output = []
    steps = []

    for token in tokens:
        if re.fullmatch(r'\d+(?:\.\d+)?|[A-Za-z_]\w*', token):
            output.append(token)
            action = f"Add operand {token} to output."

        elif token == "(":
            stack.append(token)
            action = "Push opening parenthesis onto stack."

        elif token == ")":
            while stack and stack[-1] != "(":
                output.append(stack.pop())

            if not stack:
                raise ValueError("Mismatched parentheses.")

            stack.pop()
            action = "Pop operators until opening parenthesis."

        else:
            while (
                stack
                and stack[-1] != "("
                and (
                    precedence.get(stack[-1], 0) > precedence[token]
                    or (
                        precedence.get(stack[-1], 0) == precedence[token]
                        and token != "^"
                    )
                )
            ):
                output.append(stack.pop())

            stack.append(token)
            action = f"Push operator {token} onto stack."

        steps.append({
            "token": token,
            "stack": " ".join(stack),
            "output": " ".join(output),
            "action": action
        })

    if "(" in stack:
        raise ValueError("Mismatched parentheses.")

    while stack:
        output.append(stack.pop())
        steps.append({
            "token": "END",
            "stack": " ".join(stack),
            "output": " ".join(output),
            "action": "Pop remaining operator."
        })

    return " ".join(output), steps


@infix_bp.route("/works/infix-to-postfix", methods=["GET", "POST"])
def infix_postfix():
    expression = ""
    result = None
    steps = []
    error = None

    if request.method == "POST":
        expression = request.form.get("expression", "").strip()

        if expression:
            try:
                result, steps = infix_to_postfix_steps(expression)
            except (ValueError, KeyError) as exc:
                error = str(exc)
        else:
            error = "Please enter an infix expression."

    return render_template(
        "infix_postfix.html",
        expression=expression,
        result=result,
        steps=steps,
        error=error
    )
