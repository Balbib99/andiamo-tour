#!/usr/bin/env python3
"""
Comprime en lote los audios (m4a, mp3, wav...) de una carpeta para la web.
Cada audio se comprime UNA SOLA VEZ, aunque ejecutes el script muchas veces.

Requisitos: Python 3 y ffmpeg (incluye ffprobe) accesible desde la terminal.
  - Windows: winget install ffmpeg
  - macOS:   brew install ffmpeg
  - Linux:   sudo apt install ffmpeg

En este proyecto (Andiamo):
  - Guarda los podcasts que descargues de NotebookLM en  audios-originales/  (NO se sube a Git ni a Vercel).
    Ponles el nombre del dosier: coliseo.m4a, foro-romano.m4a, panteon.m4a...
  - Ejecuta, desde la raíz del proyecto:
        python scripts/comprimir_audios.py
    y los comprimidos aparecen en  public/podcast/  (esos sí se publican).
  - El registro de lo ya comprimido se guarda en audios-originales/.comprimidos.json, junto a los originales.

Uso general:
  python scripts/comprimir_audios.py [entrada] [-o salida]
    -> por defecto entrada = audios-originales y salida = public/podcast, en m4a (AAC) mono a 48 kbps

Ejemplos:
  python scripts/comprimir_audios.py -f mp3 -b 64k      # todo a MP3 64 kbps
  python scripts/comprimir_audios.py -b 96k              # más calidad (música/efectos)
  python scripts/comprimir_audios.py otra_carpeta -o salida_propia
  python scripts/comprimir_audios.py --estereo           # mantener estéreo

Cómo garantiza que no se recomprime nada:
  1. Guarda en <entrada>/.comprimidos.json la huella (SHA-256) de cada original
     ya procesado. Si el mismo contenido vuelve a aparecer (aunque lo renombres
     o lo muevas), se salta.
  2. También guarda la huella de cada archivo generado: si metes un archivo ya
     comprimido como entrada, se reconoce y se salta.
  3. Si un audio ya es mono y su bitrate es igual o menor al objetivo, no se
     reencoda (recomprimir empeoraría la calidad sin ahorrar espacio): se copia
     tal cual a la carpeta de salida.
  4. Se escribe en un archivo temporal y solo al terminar bien se renombra,
     así una ejecución interrumpida no deja archivos a medias marcados como hechos.

Usa --forzar para volver a procesar todo desde cero.
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent  # raíz del proyecto (esta carpeta está en scripts/)
EXTENSIONES = {".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg", ".opus", ".wma", ".aiff", ".aif"}
MANIFIESTO = ".comprimidos.json"


def mb(bytes_: int) -> str:
    return f"{bytes_ / (1024 * 1024):.1f} MB"


def huella(ruta: Path) -> str:
    h = hashlib.sha256()
    with ruta.open("rb") as f:
        for bloque in iter(lambda: f.read(1024 * 1024), b""):
            h.update(bloque)
    return h.hexdigest()


def cargar_manifiesto(ruta: Path) -> dict:
    if ruta.exists():
        try:
            datos = json.loads(ruta.read_text(encoding="utf-8"))
            datos.setdefault("originales", {})
            datos.setdefault("generados", {})
            return datos
        except (json.JSONDecodeError, OSError):
            print("Aviso: el manifiesto estaba dañado; empiezo uno nuevo.")
    return {"originales": {}, "generados": {}}


def guardar_manifiesto(ruta: Path, datos: dict) -> None:
    tmp = ruta.with_suffix(".tmp")
    tmp.write_text(json.dumps(datos, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(ruta)


def info_audio(ruta: Path):
    """Devuelve (canales, bitrate_bps) o (None, None) si no se puede leer."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=channels,bit_rate:format=bit_rate",
         "-of", "json", str(ruta)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        return None, None
    try:
        d = json.loads(r.stdout)
        canales = d["streams"][0].get("channels")
        br = d["streams"][0].get("bit_rate") or d.get("format", {}).get("bit_rate")
        return canales, int(br) if br else None
    except (KeyError, IndexError, ValueError, json.JSONDecodeError):
        return None, None


def bitrate_a_bps(texto: str) -> int:
    t = texto.strip().lower()
    return int(float(t[:-1]) * 1000) if t.endswith("k") else int(t)


def comprimir(origen: Path, destino_tmp: Path, formato: str, bitrate: str, estereo: bool) -> bool:
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(origen),
           "-vn", "-map_metadata", "-1"]
    if not estereo:
        cmd += ["-ac", "1"]
    if formato == "m4a":
        # faststart: el navegador puede empezar a reproducir antes en streaming
        cmd += ["-c:a", "aac", "-b:a", bitrate, "-movflags", "+faststart", "-f", "mp4"]
    else:
        cmd += ["-c:a", "libmp3lame", "-b:a", bitrate, "-f", "mp3"]
    cmd += [str(destino_tmp)]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"   ERROR: {r.stderr.strip()}")
        destino_tmp.unlink(missing_ok=True)
        return False
    return True


def main() -> int:
    p = argparse.ArgumentParser(description="Comprime audios en lote, una sola vez cada uno.")
    p.add_argument("entrada", type=Path, nargs="?", default=RAIZ / "audios-originales",
                   help="Carpeta con los audios originales (por defecto: audios-originales)")
    p.add_argument("-o", "--salida", type=Path, default=RAIZ / "public" / "podcast",
                   help="Carpeta de salida (por defecto: public/podcast)")
    p.add_argument("-f", "--formato", choices=["m4a", "mp3"], default="m4a",
                   help="Formato de salida (por defecto: m4a)")
    p.add_argument("-b", "--bitrate", default="48k",
                   help="Bitrate, p. ej. 48k, 64k, 96k (por defecto: 48k)")
    p.add_argument("--estereo", action="store_true",
                   help="Mantener estéreo (por defecto se convierte a mono)")
    p.add_argument("--forzar", action="store_true",
                   help="Ignorar el manifiesto y volver a procesar todo")
    args = p.parse_args()

    if shutil.which("ffmpeg") is None or shutil.which("ffprobe") is None:
        print("No encuentro ffmpeg/ffprobe. Instálalo primero (ver cabecera del script).")
        return 1
    if not args.entrada.is_dir():
        print(f"La carpeta de entrada no existe: {args.entrada}")
        return 1

    salida = args.salida
    if salida.resolve() == args.entrada.resolve():
        print("La carpeta de salida no puede ser la misma que la de entrada "
              "(sobrescribirías los originales).")
        return 1
    salida.mkdir(parents=True, exist_ok=True)

    # El registro va junto a los originales, para que no se publique con los audios.
    ruta_manifiesto = args.entrada / MANIFIESTO
    manifiesto = {"originales": {}, "generados": {}} if args.forzar else cargar_manifiesto(ruta_manifiesto)

    archivos = sorted(f for f in args.entrada.iterdir()
                      if f.is_file() and f.suffix.lower() in EXTENSIONES)
    if not archivos:
        print("No he encontrado audios en esa carpeta.")
        return 1

    objetivo_bps = bitrate_a_bps(args.bitrate)
    print(f"{len(archivos)} audio(s) -> {salida}  [{args.formato}, {args.bitrate}, "
          f"{'estéreo' if args.estereo else 'mono'}]\n")

    total_antes = total_despues = 0
    hechos = saltados = errores = 0
    nombres_usados = {}  # nombre de salida -> huella del original (para evitar choques)

    for i, origen in enumerate(archivos, 1):
        print(f"[{i}/{len(archivos)}] {origen.name}")
        h = huella(origen)

        if h in manifiesto["generados"]:
            print("   ya es un archivo comprimido por este script, lo salto")
            saltados += 1
            continue

        previo = manifiesto["originales"].get(h)
        if previo and (salida / previo["salida"]).exists():
            print(f"   ya comprimido antes -> {previo['salida']}, lo salto")
            saltados += 1
            continue

        canales, br = info_audio(origen)
        ya_ligero = (
            canales is not None and br is not None
            and (args.estereo or canales == 1)
            and br <= objetivo_bps * 1.1
        )

        # Nombre de salida (si dos originales darían el mismo nombre, se distingue)
        if ya_ligero:
            nombre = origen.name  # se copia sin reencodar, conserva su extensión
        else:
            nombre = f"{origen.stem}.{args.formato}"
        if nombres_usados.get(nombre, h) != h:
            nombre = f"{origen.stem}_{origen.suffix.lstrip('.').lower()}{Path(nombre).suffix}"
        nombres_usados[nombre] = h
        destino = salida / nombre
        tmp = salida / (nombre + ".tmp")

        antes = origen.stat().st_size
        if ya_ligero:
            print(f"   ya es ligero ({(br or 0) // 1000} kbps), no lo reencodo: lo copio tal cual")
            shutil.copy2(origen, tmp)
        else:
            if not comprimir(origen, tmp, args.formato, args.bitrate, args.estereo):
                errores += 1
                continue

        tmp.replace(destino)  # solo aquí se considera hecho
        despues = destino.stat().st_size
        manifiesto["originales"][h] = {"origen": origen.name, "salida": nombre}
        manifiesto["generados"][huella(destino)] = nombre
        guardar_manifiesto(ruta_manifiesto, manifiesto)  # guardado tras cada archivo

        total_antes += antes
        total_despues += despues
        hechos += 1
        print(f"   {mb(antes)} -> {mb(despues)}")

    print()
    if total_antes:
        ahorro = 100 * (1 - total_despues / total_antes)
        print(f"Procesados: {hechos} | Saltados: {saltados} | Errores: {errores}")
        print(f"Total: {mb(total_antes)} -> {mb(total_despues)} (-{ahorro:.0f}%)")
    else:
        print(f"Procesados: 0 | Saltados: {saltados} | Errores: {errores}")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
