import re


def validate_string(text, min_range, max_range):
    text = text.strip()
    if min_range < len(text) < max_range:
        return text
    return None


def validate_title(title):
    return validate_string(title, 2, 1024)


def validate_author(author):
    return validate_string(author, 2, 64)


def valid_name(name):
    return validate_string(name, 2, 64)


def valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


def html_escape(text):
    html_escape_table = {
        ">": "&gt;",
        "<": "&lt;",
    }
    return "".join(html_escape_table.get(c, c) for c in text)


def date_to_string(date):
    return date.strftime("%d. %B %Y")
