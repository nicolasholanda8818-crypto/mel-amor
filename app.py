import os
import json
import sqlite3
from datetime import date, datetime
from pathlib import Path
from uuid import uuid4

from flask import (
    Flask,
    Response,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from werkzeug.utils import secure_filename

try:
    from PIL import Image
except ImportError:
    Image = None

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
BIRTHDAY_DATE = "2026-06-02"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".m4a"}


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


def ensure_column(table, column, definition):
    columns = [row["name"] for row in query_all(f"PRAGMA table_info({table})")]
    if column not in columns:
        execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


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


def media_path(filename):
    if filename.startswith("uploaded/"):
        return (UPLOAD_ROOT / filename.replace("uploaded/", "", 1)).resolve()
    return (Path(app.static_folder) / filename).resolve()


def optimize_image(filename):
    if Image is None:
        return
    path = media_path(filename)
    if not path.exists() or path.suffix.lower() not in IMAGE_EXTENSIONS:
        return

    try:
        with Image.open(path) as image:
            image.thumbnail((1800, 1800))
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(path, quality=82, optimize=True)
    except OSError:
        return


def generate_thumbnail(filename):
    if Image is None:
        return ""

    source = media_path(filename)
    if not source.exists() or source.suffix.lower() not in IMAGE_EXTENSIONS:
        return ""

    thumbs_dir = UPLOAD_ROOT / "thumbs"
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    safe_stem = Path(filename).stem.replace("/", "_").replace("\\", "_")
    thumb_name = f"{safe_stem}-{uuid4().hex[:8]}.webp"
    thumb_path = thumbs_dir / thumb_name

    try:
        with Image.open(source) as image:
            image.thumbnail((520, 520))
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(thumb_path, "WEBP", quality=76, optimize=True)
    except OSError:
        return ""

    if UPLOAD_ROOT.resolve() == Path(app.static_folder).resolve():
        return f"thumbs/{thumb_name}"
    return f"uploaded/thumbs/{thumb_name}"


def default_video_preview():
    row = query_one("SELECT COALESCE(NULLIF(thumb_filename, ''), filename) AS filename FROM photos ORDER BY id ASC LIMIT 1")
    return row["filename"] if row else ""


def init_db():
    with get_db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                caption TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE,
                thumb_filename TEXT NOT NULL DEFAULT '',
                memory_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS videos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                caption TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE,
                preview_filename TEXT NOT NULL DEFAULT '',
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

            CREATE TABLE IF NOT EXISTS audio_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                caption TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE,
                message_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS memory_mural (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                place TEXT NOT NULL,
                description TEXT NOT NULL,
                filename TEXT NOT NULL,
                memory_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS story_chapters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                chapter_order INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS time_capsules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                open_date TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                color TEXT NOT NULL,
                photo_filename TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS site_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        connection.commit()

    ensure_column("photos", "thumb_filename", "TEXT NOT NULL DEFAULT ''")
    ensure_column("videos", "preview_filename", "TEXT NOT NULL DEFAULT ''")
    seed_static_media()
    seed_default_events()
    seed_default_diary()
    seed_default_universe_content()
    seed_profiles()
    seed_settings()


def seed_static_media():
    now = datetime.now().isoformat(timespec="seconds")
    for index, filename in enumerate(list_static_files("img", IMAGE_EXTENSIONS), start=1):
        exists = query_one("SELECT id, thumb_filename FROM photos WHERE filename = ?", (filename,))
        if not exists:
            thumb_filename = generate_thumbnail(filename)
            execute(
                """
                INSERT INTO photos (title, caption, filename, thumb_filename, memory_date, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    f"Memória {index}",
                    f"Memória {index} do nosso universo.",
                    filename,
                    thumb_filename,
                    "2025-11-14",
                    now,
                ),
            )
        elif not exists["thumb_filename"]:
            thumb_filename = generate_thumbnail(filename)
            if thumb_filename:
                execute("UPDATE photos SET thumb_filename = ? WHERE id = ?", (thumb_filename, exists["id"]))

    for index, filename in enumerate(list_static_files("videos", VIDEO_EXTENSIONS), start=1):
        exists = query_one("SELECT id, preview_filename FROM videos WHERE filename = ?", (filename,))
        if not exists:
            preview_filename = default_video_preview()
            execute(
                """
                INSERT INTO videos (title, caption, filename, preview_filename, memory_date, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    f"Vídeo {index}",
                    f"Vídeo {index} do nosso amor.",
                    filename,
                    preview_filename,
                    "2025-11-14",
                    now,
                ),
            )
        elif not exists["preview_filename"]:
            preview_filename = default_video_preview()
            if preview_filename:
                execute("UPDATE videos SET preview_filename = ? WHERE id = ?", (preview_filename, exists["id"]))

    for index, filename in enumerate(list_static_files("audio", AUDIO_EXTENSIONS), start=1):
        exists = query_one("SELECT id FROM audio_messages WHERE filename = ?", (filename,))
        if not exists:
            execute(
                """
                INSERT INTO audio_messages (title, caption, filename, message_date, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    f"Mensagem do Nicolas {index}",
                    "Uma mensagem em áudio guardada no nosso universo.",
                    filename,
                    date.today().isoformat(),
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


def seed_default_universe_content():
    now = datetime.now().isoformat(timespec="seconds")
    first_photo = query_one("SELECT filename FROM photos ORDER BY id ASC LIMIT 1")
    photo_filename = first_photo["filename"] if first_photo else ""

    mural_defaults = [
        (
            "Nossa primeira viagem",
            "Morro Branco",
            "Nossa primeira viagem juntos ❤️",
            photo_filename,
            "2025-11-15",
        ),
        (
            "Começo do nosso universo",
            "Nossa história",
            "O dia em que tudo começou a ganhar sentido.",
            photo_filename,
            "2025-11-14",
        ),
    ]
    for title, place, description, filename, memory_date in mural_defaults:
        exists = query_one("SELECT id FROM memory_mural WHERE title = ? AND memory_date = ?", (title, memory_date))
        if not exists and filename:
            execute(
                """
                INSERT INTO memory_mural (title, place, description, filename, memory_date, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (title, place, description, filename, memory_date, now),
            )

    chapter_defaults = [
        (1, "Capítulo 1 - Quando tudo começou ❤️", "14/11/2025: o nosso universo começou a nascer."),
        (2, "Capítulo 2 - Morro Branco ❤️", "A primeira viagem, o mar, as risadas e uma memória que ficou brilhando."),
        (3, "Capítulo 3 - Aniversário da Mel ❤️", "Um capítulo histórico guardado como memória especial no calendário."),
        (4, "Capítulo 4 - Próximas Aventuras ❤️", "Tudo que ainda vamos viver, registrar e transformar em lembrança."),
    ]
    for chapter_order, title, body in chapter_defaults:
        exists = query_one("SELECT id FROM story_chapters WHERE chapter_order = ?", (chapter_order,))
        if not exists:
            execute(
                """
                INSERT INTO story_chapters (title, body, chapter_order, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (title, body, chapter_order, now),
            )

    capsule_exists = query_one("SELECT id FROM time_capsules LIMIT 1")
    if not capsule_exists:
        execute(
            """
            INSERT INTO time_capsules (title, message, open_date, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                "Carta para 02/06/2027",
                "Quando este dia chegar, que a gente tenha ainda mais histórias bonitas para lembrar.",
                "2027-06-02",
                now,
            ),
        )


def seed_profiles():
    now = datetime.now().isoformat(timespec="seconds")
    defaults = [
        ("Nicolas", "#5be7ff"),
        ("Mel", "#ff69b4"),
    ]
    for name, color in defaults:
        exists = query_one("SELECT id FROM profiles WHERE name = ?", (name,))
        if not exists:
            execute(
                """
                INSERT INTO profiles (name, color, photo_filename, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (name, color, "", now),
            )


def seed_settings():
    defaults = {
        "primary_color": "#ff69b4",
        "accent_color": "#8d5cff",
        "gold_color": "#ffd36a",
        "music_file": "music/musica.mp3",
        "intro_text": "Bem-vindos à nossa galáxia viva ✨",
        "hero_text": (
            "Este é o nosso espaço vivo: um lugar para guardar memórias, criar "
            "novas histórias, voltar no tempo e acompanhar cada fase do nosso amor."
        ),
    }
    for key, value in defaults.items():
        exists = query_one("SELECT key FROM site_settings WHERE key = ?", (key,))
        if not exists:
            execute("INSERT INTO site_settings (key, value) VALUES (?, ?)", (key, value))


def get_settings():
    return {row["key"]: row["value"] for row in query_all("SELECT key, value FROM site_settings")}


def set_setting(key, value):
    execute(
        """
        INSERT INTO site_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """,
        (key, value),
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
    return True


@app.route("/")
def index():
    today = date.today()
    photos = query_all("SELECT * FROM photos ORDER BY memory_date DESC, id DESC LIMIT 80")
    videos = query_all("SELECT * FROM videos ORDER BY memory_date DESC, id DESC LIMIT 30")
    events = query_all("SELECT * FROM events WHERE event_date != ? ORDER BY event_date ASC, id ASC", (BIRTHDAY_DATE,))
    calendar_dates = [row["event_date"] for row in query_all("SELECT event_date FROM events ORDER BY event_date ASC")]
    if BIRTHDAY_DATE not in calendar_dates:
        calendar_dates.append(BIRTHDAY_DATE)
    diary_entries = query_all("SELECT * FROM diary ORDER BY entry_date DESC, id DESC LIMIT 120")
    audio_messages = query_all("SELECT * FROM audio_messages ORDER BY message_date DESC, id DESC LIMIT 20")
    mural_entries = query_all("SELECT * FROM memory_mural ORDER BY memory_date DESC, id DESC LIMIT 80")
    chapters = query_all("SELECT * FROM story_chapters ORDER BY chapter_order ASC, id ASC")
    capsules = query_all("SELECT * FROM time_capsules ORDER BY open_date ASC, id ASC")
    profiles = query_all("SELECT * FROM profiles ORDER BY name ASC")
    current_profile_name = session.get("current_profile", "Nicolas")
    current_profile = query_one("SELECT * FROM profiles WHERE name = ?", (current_profile_name,)) or profiles[0]
    settings = get_settings()
    stats = {
        "photos": query_one("SELECT COUNT(*) AS total FROM photos")["total"],
        "videos": query_one("SELECT COUNT(*) AS total FROM videos")["total"],
        "audios": query_one("SELECT COUNT(*) AS total FROM audio_messages")["total"],
        "diary": query_one("SELECT COUNT(*) AS total FROM diary")["total"],
        "mural": query_one("SELECT COUNT(*) AS total FROM memory_mural")["total"],
        "capsules": query_one("SELECT COUNT(*) AS total FROM time_capsules")["total"],
        "events": query_one("SELECT COUNT(*) AS total FROM events")["total"],
    }
    return render_template(
        "index.html",
        photos=photos,
        videos=videos,
        events=events,
        calendar_dates=calendar_dates,
        diary_entries=diary_entries,
        audio_messages=audio_messages,
        mural_entries=mural_entries,
        chapters=chapters,
        capsules=capsules,
        profiles=profiles,
        current_profile=current_profile,
        settings=settings,
        stats=stats,
        event_payloads=[dict(row) for row in events],
        today=today.isoformat(),
    )


@app.route("/uploaded/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_ROOT, filename)


@app.route("/memorias/aniversario-mel")
def birthday_memory():
    photos = query_all("SELECT * FROM photos WHERE memory_date <= ? ORDER BY memory_date ASC, id ASC", (BIRTHDAY_DATE,))
    videos = query_all("SELECT * FROM videos WHERE memory_date <= ? ORDER BY memory_date ASC, id ASC", (BIRTHDAY_DATE,))
    return render_template("birthday.html", photos=photos, videos=videos)


@app.route("/admin", methods=["GET", "POST"])
def admin():
    return render_template(
        "admin.html",
        authenticated=True,
        photos=query_all("SELECT * FROM photos ORDER BY id DESC LIMIT 120"),
        videos=query_all("SELECT * FROM videos ORDER BY id DESC LIMIT 80"),
        events=query_all("SELECT * FROM events ORDER BY event_date DESC, id DESC LIMIT 120"),
        diary_entries=query_all("SELECT * FROM diary ORDER BY id DESC LIMIT 160"),
        audio_messages=query_all("SELECT * FROM audio_messages ORDER BY id DESC LIMIT 80"),
        mural_entries=query_all("SELECT * FROM memory_mural ORDER BY id DESC LIMIT 120"),
        chapters=query_all("SELECT * FROM story_chapters ORDER BY chapter_order ASC, id ASC"),
        capsules=query_all("SELECT * FROM time_capsules ORDER BY open_date ASC, id ASC"),
        profiles=query_all("SELECT * FROM profiles ORDER BY name ASC"),
        settings=get_settings(),
        today=date.today().isoformat(),
    )


@app.route("/profile", methods=["POST"])
def select_profile():
    profile_name = request.form.get("profile") or "Nicolas"
    exists = query_one("SELECT name FROM profiles WHERE name = ?", (profile_name,))
    if exists:
        session["current_profile"] = profile_name
    return redirect(request.form.get("next") or url_for("index"))


@app.route("/admin/profile/<int:profile_id>", methods=["POST"])
def update_profile(profile_id):
    if not require_admin():
        return redirect(url_for("admin"))

    profile = query_one("SELECT * FROM profiles WHERE id = ?", (profile_id,))
    if not profile:
        return redirect(url_for("admin"))

    photo_filename = profile["photo_filename"]
    try:
        new_photo = save_upload(request.files.get("photo"), "img", IMAGE_EXTENSIONS)
        if new_photo:
            optimize_image(new_photo)
            photo_filename = generate_thumbnail(new_photo) or new_photo
    except ValueError as error:
        flash(str(error), "error")
        return redirect(url_for("admin"))

    execute(
        "UPDATE profiles SET color = ?, photo_filename = ? WHERE id = ?",
        (
            request.form.get("color") or profile["color"],
            photo_filename,
            profile_id,
        ),
    )
    flash("Perfil atualizado.", "success")
    return redirect(url_for("admin"))


@app.route("/admin/settings", methods=["POST"])
def update_settings():
    if not require_admin():
        return redirect(url_for("admin"))

    for key in ["primary_color", "accent_color", "gold_color", "intro_text", "hero_text"]:
        if key in request.form:
            set_setting(key, request.form.get(key) or "")

    try:
        music_file = save_upload(request.files.get("music_file"), "music", AUDIO_EXTENSIONS)
        if music_file:
            set_setting("music_file", music_file)
    except ValueError as error:
        flash(str(error), "error")
        return redirect(url_for("admin"))

    flash("Personalização atualizada.", "success")
    return redirect(url_for("admin"))


def backup_tables():
    return [
        "photos",
        "videos",
        "events",
        "diary",
        "audio_messages",
        "memory_mural",
        "story_chapters",
        "time_capsules",
        "profiles",
        "site_settings",
    ]


@app.route("/admin/backup/export")
def export_backup():
    data = {
        "exported_at": datetime.now().isoformat(timespec="seconds"),
        "tables": {},
    }
    for table in backup_tables():
        data["tables"][table] = [dict(row) for row in query_all(f"SELECT * FROM {table}")]

    payload = json.dumps(data, ensure_ascii=False, indent=2)
    return Response(
        payload,
        mimetype="application/json",
        headers={"Content-Disposition": "attachment; filename=universo-mel-backup.json"},
    )


@app.route("/admin/backup/restore", methods=["POST"])
def restore_backup():
    if not require_admin():
        return redirect(url_for("admin"))

    file_storage = request.files.get("backup")
    if not file_storage:
        flash("Escolha um arquivo JSON de backup.", "error")
        return redirect(url_for("admin"))

    try:
        payload = json.load(file_storage.stream)
        tables = payload.get("tables", {})
    except (json.JSONDecodeError, AttributeError):
        flash("Backup inválido.", "error")
        return redirect(url_for("admin"))

    with get_db() as connection:
        for table in backup_tables():
            rows = tables.get(table)
            if rows is None:
                continue
            connection.execute(f"DELETE FROM {table}")
            for row in rows:
                columns = list(row.keys())
                placeholders = ", ".join("?" for _ in columns)
                names = ", ".join(columns)
                connection.execute(
                    f"INSERT INTO {table} ({names}) VALUES ({placeholders})",
                    [row[column] for column in columns],
                )
        connection.commit()

    flash("Backup restaurado.", "success")
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
        optimize_image(filename)
        thumb_filename = generate_thumbnail(filename)

        execute(
            """
            INSERT INTO photos (title, caption, filename, thumb_filename, memory_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or media_title(filename),
                request.form.get("caption") or "Uma nova memória do nosso universo.",
                filename,
                thumb_filename,
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
        preview_filename = default_video_preview()

        execute(
            """
            INSERT INTO videos (title, caption, filename, preview_filename, memory_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or media_title(filename),
                request.form.get("caption") or "Um novo vídeo do nosso amor.",
                filename,
                preview_filename,
                request.form.get("memory_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        flash("Vídeo adicionado.", "success")
    except ValueError as error:
        flash(str(error), "error")
    return redirect(url_for("admin"))


@app.route("/admin/audio", methods=["POST"])
def add_audio():
    if not require_admin():
        return redirect(url_for("admin"))

    try:
        filename = save_upload(request.files.get("file"), "audio", AUDIO_EXTENSIONS)
        if not filename:
            flash("Escolha um áudio.", "error")
            return redirect(url_for("admin"))

        execute(
            """
            INSERT INTO audio_messages (title, caption, filename, message_date, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or media_title(filename),
                request.form.get("caption") or "Uma mensagem em áudio guardada com carinho.",
                filename,
                request.form.get("message_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        flash("Áudio adicionado.", "success")
    except ValueError as error:
        flash(str(error), "error")
    return redirect(url_for("admin"))


@app.route("/admin/mural", methods=["POST"])
def add_mural_memory():
    if not require_admin():
        return redirect(url_for("admin"))

    try:
        filename = save_upload(request.files.get("file"), "img", IMAGE_EXTENSIONS)
        if filename:
            optimize_image(filename)
        if not filename:
            first_photo = query_one("SELECT filename FROM photos ORDER BY id DESC LIMIT 1")
            filename = first_photo["filename"] if first_photo else None
        if not filename:
            flash("Escolha uma foto para o mural.", "error")
            return redirect(url_for("admin"))

        execute(
            """
            INSERT INTO memory_mural (title, place, description, filename, memory_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request.form.get("title") or "Nova memória",
                request.form.get("place") or "Lugar especial",
                request.form.get("description") or "Uma lembrança linda do nosso universo.",
                filename,
                request.form.get("memory_date") or date.today().isoformat(),
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        flash("Memória adicionada ao mural.", "success")
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


@app.route("/admin/chapter", methods=["POST"])
def add_chapter():
    if not require_admin():
        return redirect(url_for("admin"))

    next_order = query_one("SELECT COALESCE(MAX(chapter_order), 0) + 1 AS next_order FROM story_chapters")
    execute(
        """
        INSERT INTO story_chapters (title, body, chapter_order, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (
            request.form.get("title") or "Novo capítulo ❤️",
            request.form.get("body") or "Mais uma página da nossa história.",
            int(request.form.get("chapter_order") or next_order["next_order"]),
            datetime.now().isoformat(timespec="seconds"),
        ),
    )
    flash("Capítulo adicionado.", "success")
    return redirect(url_for("admin"))


@app.route("/diary", methods=["POST"])
def add_diary():
    author = request.form.get("author") or session.get("current_profile", "Nicolas")
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


@app.route("/time-capsule", methods=["POST"])
def add_time_capsule():
    title = request.form.get("title") or "Carta futura"
    message = (request.form.get("message") or "").strip()
    open_date = request.form.get("open_date") or date.today().isoformat()
    if message:
        execute(
            """
            INSERT INTO time_capsules (title, message, open_date, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (title, message, open_date, datetime.now().isoformat(timespec="seconds")),
        )
        flash("Cápsula do tempo criada.", "success")
    return redirect(url_for("index") + "#time-capsule")


@app.route("/admin/delete/<kind>/<int:item_id>", methods=["POST"])
def delete_item(kind, item_id):
    if not require_admin():
        return redirect(url_for("admin"))

    tables = {
        "photo": "photos",
        "video": "videos",
        "audio": "audio_messages",
        "mural": "memory_mural",
        "event": "events",
        "diary": "diary",
        "chapter": "story_chapters",
        "capsule": "time_capsules",
    }
    table = tables.get(kind)
    if not table:
        return redirect(url_for("admin"))

    row = query_one(f"SELECT * FROM {table} WHERE id = ?", (item_id,))
    if row and kind in {"photo", "video", "audio"} and "filename" in row.keys():
        remove_static_file(row["filename"])
    execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))
    flash("Item excluído.", "success")
    return redirect(url_for("admin"))


init_db()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
