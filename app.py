import os
import sqlite3
from datetime import date, datetime
from pathlib import Path
from uuid import uuid4

from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "universo-da-mel-local")

BASE_DIR = Path(__file__).resolve().parent
DATABASE = Path(
    os.environ.get(
        "DATABASE_PATH",
        "/tmp/universo_mel.db" if os.environ.get("VERCEL") else BASE_DIR / "universo_mel.db",
    )
)
UPLOAD_ROOT = Path(
    os.environ.get(
        "UPLOAD_ROOT",
        "/tmp/universo_uploads" if os.environ.get("VERCEL") else app.static_folder,
    )
)
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "mel2025")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}


def get_db():
    DATABASE.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def execute(query, params=()):
    with get_db() as connection:
        connection.execute(query, params)
        connection.commit()


def query_all(query, params=()):
    with get_db() as connection:
        return connection.execute(query, params).fetchall()


def query_one(query, params=()):
    with get_db() as connection:
        return connection.execute(query, params).fetchone()


def natural_key(path):
    stem = path.stem.lower()
    number = "".join(character for character in stem if character.isdigit())
    return (stem.rstrip("0123456789"), int(number or 0), stem)


def list_static_files(folder, extensions):
    static_folder = Path(app.static_folder) / folder
    if not static_folder.exists():
        return []

    return [
        f"{folder}/{path.name}"
        for path in sorted(static_folder.iterdir(), key=natural_key)
        if path.is_file() and path.suffix.lower() in extensions
    ]


def media_title(filename):
    stem = Path(filename).stem.replace("-", " ").replace("_", " ").strip()
    return stem.title() if stem else "Memória"


def init_db():
    with get_db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                caption TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE,
                memory_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                caption TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE,
                memory_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                event_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS diary (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author TEXT NOT NULL,
                message TEXT NOT NULL,
                reply_to INTEGER,
                entry_date TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(reply_to) REFERENCES diary(id)
            );
            """
        )
        connection.commit()

    seed_static_media()
    seed_default_events()
    seed_default_diary()


def seed_static_media():
    now = datetime.now().isoformat(timespec="seconds")
    for index, filename in enumerate(list_static_files("img", IMAGE_EXTENSIONS), start=1):
        exists = query_one("SELECT id FROM photos WHERE filename = ?", (filename,))
        if not exists:
            execute(
                """
                INSERT INTO photos (title, caption, filename, memory_date, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"Memória {index}",
                    f"Memória {index} do nosso universo.",
                    filename,
                    "2025-11-14",
                    now,
                ),
            )

    for index, filename in enumerate(list_static_files("videos", VIDEO_EXTENSIONS), start=1):
        exists = query_one("SELECT id FROM videos WHERE filename = ?", (filename,))
        if not exists:
            execute(
                """
                INSERT INTO videos (title, caption, filename, memory_date, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"Vídeo {index}",
                    f"Vídeo {index} do nosso amor.",
                    filename,
                    "2025-11-14",
                    now,
                ),
            )


def seed_default_events():
    defaults = [
        ("Início do namoro ❤", "O dia em que nosso universo começou.", "2025-11-14"),
        ("Primeira viagem", "Morro Branco virou uma memória eterna.", "2025-11-15"),
        ("Aniversário da Mel", "O dia da minha princesa.", "2026-06-02"),
    ]
    now = datetime.now().isoformat(timespec="seconds")
    for title, description, event_date in defaults:
        exists = query_one("SELECT id FROM events WHERE title = ? AND event_date = ?", (title, event_date))
        if not exists:
            execute(
                "INSERT INTO events (title, description, event_date, created_at) VALUES (?, ?, ?, ?)",
                (title, description, event_date, now),
            )


def seed_default_diary():
    exists = query_one("SELECT id FROM diary LIMIT 1")
    if exists:
        return

    now = datetime.now().isoformat(timespec="seconds")
    execute(
        """
        INSERT INTO diary (author, message, reply_to, entry_date, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            "Nicolas",
            "Que este diário guarde cada pedacinho bonito da nossa história.",
            None,
            date.today().isoformat(),
            now,
        ),
    )


def save_upload(file_storage, folder, allowed_extensions):
    if not file_storage or not file_storage.filename:
        return None

    original = secure_filename(file_storage.filename)
    extension = Path(original).suffix.lower()
    if extension not in allowed_extensions:
        raise ValueError("Formato de arquivo não permitido.")

    upload_folder = UPLOAD_ROOT / folder
    upload_folder.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    file_storage.save(upload_folder / filename)
    if UPLOAD_ROOT.resolve() == Path(app.static_folder).resolve():
        return f"{folder}/{filename}"
    return f"uploaded/{folder}/{filename}"


def remove_static_file(filename):
    if not filename:
        return
    if filename.startswith("uploaded/"):
        path = (UPLOAD_ROOT / filename.replace("uploaded/", "", 1)).resolve()
        root = UPLOAD_ROOT.resolve()
    else:
        path = (Path(app.static_folder) / filename).resolve()
        root = Path(app.static_folder).resolve()
    if root in path.parents and path.exists():
        path.unlink()


def asset_url(filename):
    if filename.startswith("uploaded/"):
        return url_for("uploaded_file", filename=filename.replace("uploaded/", "", 1))
    return url_for("static", filename=filename)


app.jinja_env.globals["asset_url"] = asset_url


def require_admin():
    return session.get("admin_authenticated") is True


@app.route("/")
def index():
    photos = query_all("SELECT * FROM photos ORDER BY memory_date DESC, id DESC")
    videos = query_all("SELECT * FROM videos ORDER BY memory_date DESC, id DESC")
    events = query_all("SELECT * FROM events ORDER BY event_date ASC, id ASC")
    diary_entries = query_all("SELECT * FROM diary ORDER BY entry_date DESC, id DESC")
    return render_template(
        "index.html",
        photos=photos,
        videos=videos,
        events=events,
        diary_entries=diary_entries,
        today=date.today().isoformat(),
    )


@app.route("/uploaded/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_ROOT, filename)


@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "POST" and request.form.get("action") == "login":
        if request.form.get("password") == ADMIN_PASSWORD:
            session["admin_authenticated"] = True
            flash("Painel liberado.", "success")
            return redirect(url_for("admin"))
        flash("Senha incorreta.", "error")

    if not require_admin():
        return render_template("admin.html", authenticated=False)

    return render_template(
        "admin.html",
        authenticated=True,
        photos=query_all("SELECT * FROM photos ORDER BY id DESC"),
        videos=query_all("SELECT * FROM videos ORDER BY id DESC"),
        events=query_all("SELECT * FROM events ORDER BY event_date DESC, id DESC"),
        diary_entries=query_all("SELECT * FROM diary ORDER BY id DESC"),
        today=date.today().isoformat(),
    )


@app.route("/admin/logout", methods=["POST"])
def admin_logout():
    session.clear()
    return redirect(url_for("admin"))


@app.route("/admin/photo", methods=["POST"])
def add_photo():
    if not require_admin():
        return redirect(url_for("admin"))

    try:
        filename = save_upload(request.files.get("file"), "img", IMAGE_EXTENSIONS)
        if not filename:
            flash("Escolha uma foto.", "error")
            return redirect(url_for("admin"))

        execute(
            """
            INSERT INTO photos (title, caption, filename, memory_date, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or media_title(filename),
                request.form.get("caption") or "Uma nova memória do nosso universo.",
                filename,
                request.form.get("memory_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        flash("Foto adicionada.", "success")
    except ValueError as error:
        flash(str(error), "error")
    return redirect(url_for("admin"))


@app.route("/admin/video", methods=["POST"])
def add_video():
    if not require_admin():
        return redirect(url_for("admin"))

    try:
        filename = save_upload(request.files.get("file"), "videos", VIDEO_EXTENSIONS)
        if not filename:
            flash("Escolha um vídeo.", "error")
            return redirect(url_for("admin"))

        execute(
            """
            INSERT INTO videos (title, caption, filename, memory_date, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or media_title(filename),
                request.form.get("caption") or "Um novo vídeo do nosso amor.",
                filename,
                request.form.get("memory_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        flash("Vídeo adicionado.", "success")
    except ValueError as error:
        flash(str(error), "error")
    return redirect(url_for("admin"))


@app.route("/admin/event", methods=["POST"])
def add_event():
    if not require_admin():
        return redirect(url_for("admin"))

    execute(
        "INSERT INTO events (title, description, event_date, created_at) VALUES (?, ?, ?, ?)",
        (
            request.form.get("title") or "Novo evento",
            request.form.get("description") or "Mais uma memória para guardar.",
            request.form.get("event_date") or date.today().isoformat(),
            datetime.now().isoformat(timespec="seconds"),
        ),
    )
    flash("Evento adicionado.", "success")
    return redirect(url_for("admin"))


@app.route("/diary", methods=["POST"])
def add_diary():
    author = request.form.get("author") or "Nicolas"
    message = request.form.get("message") or ""
    if message.strip():
        execute(
            """
            INSERT INTO diary (author, message, reply_to, entry_date, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                author,
                message.strip(),
                request.form.get("reply_to") or None,
                request.form.get("entry_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
    return redirect(url_for("index") + "#diary")


@app.route("/admin/delete/<kind>/<int:item_id>", methods=["POST"])
def delete_item(kind, item_id):
    if not require_admin():
        return redirect(url_for("admin"))

    tables = {"photo": "photos", "video": "videos", "event": "events", "diary": "diary"}
    table = tables.get(kind)
    if not table:
        return redirect(url_for("admin"))

    row = query_one(f"SELECT * FROM {table} WHERE id = ?", (item_id,))
    if row and kind in {"photo", "video"}:
        remove_static_file(row["filename"])
    execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))
    flash("Item excluído.", "success")
    return redirect(url_for("admin"))


init_db()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
