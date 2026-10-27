from flask import Blueprint, render_template, request

linkedlist_bp = Blueprint("linkedlist", __name__)


class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def add(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        current = self.head
        while current.next:
            current = current.next

        current.next = new_node

    def delete_at_beginning(self):
        if self.head is None:
            return None

        deleted_value = self.head.data
        self.head = self.head.next
        return deleted_value

    def delete(self, data):
        current = self.head
        previous = None

        while current:
            if current.data.casefold() == data.casefold():
                if previous is None:
                    self.head = current.next
                else:
                    previous.next = current.next
                return True

            previous = current
            current = current.next

        return False

    def search(self, data):
        current = self.head

        while current:
            if current.data.casefold() == data.casefold():
                return True
            current = current.next

        return False

    def to_list(self):
        items = []
        current = self.head

        while current:
            items.append(current.data)
            current = current.next

        return items


# Initial Linked List data
linked_list = LinkedList()

for item in ["Python", "Flask", "HTML", "CSS"]:
    linked_list.add(item)


@linkedlist_bp.route("/works/linked-list", methods=["GET", "POST"])
def linkedlist():
    message = None

    if request.method == "POST":
        action = request.form.get("action", "")
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
            if not value:
                message = "Please enter a value to delete."
            elif linked_list.delete(value):
                message = f'"{value}" was deleted.'
            else:
                message = f'"{value}" was not found.'

        elif action == "clear":
            linked_list.head = None
            message = "The linked list has been cleared."

 
        elif action == "search":
            if not value:
                message = "Please enter a value to search."
            elif linked_list.search(value):
                message = f'"{value}" was found in the linked list.'
            else:
                message = f'"{value}" was not found.'

        
        

    return render_template(
        "linkedlist.html",
        items=linked_list.to_list(),
        message=message
    )
