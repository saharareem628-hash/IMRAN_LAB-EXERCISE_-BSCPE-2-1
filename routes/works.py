from flask import Blueprint, render_template, request

works_bp = Blueprint("works", __name__)


@works_bp.route("/works")
def works():
    return render_template("works.html")


@works_bp.route("/works/area/circle", methods=["GET", "POST"])
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

    return render_template("circle.html", result=result, error=error)


@works_bp.route("/works/area/triangle", methods=["GET", "POST"])
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

    return render_template("triangle.html", result=result, error=error)

@works_bp.route("/touppercase", methods=["GET", "POST"])
def touppercase():
    text = ""
    result = ""

    if request.method == "POST":
        text = request.form.get("text", "")
        result = text.upper()

    return render_template(
        "touppercase.html",
        text=text,
        result=result
    )