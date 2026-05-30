from pathlib import Path

from flask import Flask, render_template

app = Flask(__name__)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}


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


@app.route("/")
def index():
    photos = list_static_files("img", IMAGE_EXTENSIONS)
    videos = list_static_files("videos", VIDEO_EXTENSIONS)
    return render_template("index.html", photos=photos, videos=videos)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
