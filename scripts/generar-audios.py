"""
Genera los audios de la web con la voz de Ximena (Microsoft Edge, es-ES-XimenaNeural).

Lee los textos de src/data/itinerario.ts, crea un mp3 por parada (o por cada punto de la foto, en las paradas que
lo tienen) en public/audio/ y escribe public/audio/manifest.json con lo que dura cada uno. La web usa esos archivos
y, si falta alguno, lee el texto con la voz del móvil.

Solo vuelve a generar los audios cuyo texto ha cambiado. Para forzarlo todo: python scripts/generar-audios.py --todo

Requisitos (una sola vez):  pip install edge-tts num2words   (necesita internet para generar, no para usar los audios)
Uso, desde la carpeta del proyecto:  python scripts/generar-audios.py
"""
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts
from num2words import num2words

RAIZ = Path(__file__).resolve().parent.parent
AUDIO = RAIZ / "public" / "audio"
VOZ = "es-ES-XimenaNeural"
VELOCIDAD = "-5%"


def para_voz(texto: str) -> str:
    """
    Adapta un texto para que la voz lo lea seguido. El punto deja unos 0,9 s de silencio, y la coma, el punto y coma
    y los dos puntos unos 0,3 s, así que las frases seguidas de un mismo párrafo se unen con punto y coma y el punto
    solo se deja entre párrafos. Además se escriben con letras los números y las abreviaturas.
    """
    t = texto.replace("«", "").replace("»", "")
    t = re.sub(r"\ba\. ?C\.", "antes de Cristo", t)
    t = re.sub(r"\bd\. ?C\.", "después de Cristo", t)
    t = re.sub(
        r"\d{1,3}(?:\.\d{3})+|\d+",
        lambda m: num2words(int(m.group(0).replace(".", "")), lang="es"),
        t,
    )
    partes = []
    for parrafo in re.split(r"\n\s*\n", t.strip()):
        parrafo = re.sub(r"\. ([A-ZÁÉÍÓÚÑ])", lambda m: "; " + m.group(1).lower(), parrafo)
        partes.append(parrafo.strip())
    return "\n\n".join(partes)


def elementos(paradas: list[dict]) -> dict[str, str]:
    """Nombre de archivo -> texto que se lee."""
    out: dict[str, str] = {}
    for p in paradas:
        if p["tienePhoto"]:
            for i, punto in enumerate(p["points"], start=1):
                out[f"{p['id']}-{i}.mp3"] = f"{punto['title']}.\n\n{punto['text']}"
        else:
            out[f"{p['id']}.mp3"] = f"{p['name']}.\n\n" + "\n\n".join(p["text"])
    return out


async def generar(texto: str, destino: Path) -> float:
    """Crea el mp3 y devuelve su duración aproximada en segundos."""
    comunicacion = edge_tts.Communicate(texto, VOZ, rate=VELOCIDAD, boundary="WordBoundary")
    fin = 0.0
    with open(destino, "wb") as f:
        async for trozo in comunicacion.stream():
            if trozo["type"] == "audio":
                f.write(trozo["data"])
            elif trozo["type"] == "WordBoundary":
                fin = (trozo["offset"] + trozo["duration"]) / 1e7
    return fin + 0.3


async def main() -> None:
    forzar = "--todo" in sys.argv
    salida = subprocess.run(
        ["node", str(RAIZ / "scripts" / "exportar-textos.mjs")], capture_output=True, text=True, encoding="utf-8", check=True
    ).stdout
    paradas = json.loads(salida)
    AUDIO.mkdir(parents=True, exist_ok=True)

    manifiesto_ruta = AUDIO / "manifest.json"
    previo = json.loads(manifiesto_ruta.read_text(encoding="utf-8")) if manifiesto_ruta.exists() else {"files": {}}
    archivos: dict[str, dict] = {}

    pendientes = elementos(paradas)
    for nombre, original in pendientes.items():
        texto = para_voz(original)
        huella = hashlib.sha1(f"{VOZ}|{VELOCIDAD}|{texto}".encode("utf-8")).hexdigest()[:12]
        anterior = previo["files"].get(nombre)
        destino = AUDIO / nombre
        if not forzar and anterior and anterior.get("hash") == huella and destino.exists():
            archivos[nombre] = anterior
            print(f"  sin cambios  {nombre}")
            continue
        seg = await generar(texto, destino)
        archivos[nombre] = {"seg": round(seg), "hash": huella}
        print(f"  generado     {nombre}  ({seg:.0f} s, {destino.stat().st_size // 1024} KB)")

    # se borran los audios que ya no corresponden a ninguna parada
    for viejo in AUDIO.glob("*.mp3"):
        if viejo.name not in archivos:
            viejo.unlink()
            print(f"  borrado      {viejo.name}")

    manifiesto_ruta.write_text(
        json.dumps({"voz": VOZ, "files": dict(sorted(archivos.items()))}, ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )
    total = sum(f["seg"] for f in archivos.values())
    print(f"\n{len(archivos)} audios, {total // 60} min {total % 60} s en total.")


if __name__ == "__main__":
    asyncio.run(main())
