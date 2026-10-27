from flask import Blueprint, render_template

sorting_bp = Blueprint("sorting", __name__)

@sorting_bp.route("/works/sorting")
def sorting():
    return render_template("sorting.html")

