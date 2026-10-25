# talas v0.23 — kandidati antičkog vrela kod Niške Banje
# Overpass (http fallback, https TLS blokiran iz ove mreže) -> natural=spring node-ovi -> GLO-30 kote
# -> ocena kao potencijalni izvor akvadukta (mora biti iznad vile 198.2 m, GLO-30)
import rasterio, json, math

tiles = ["dem/Copernicus_DSM_COG_10_N43_00_E021_00_DEM.tif", "dem/Copernicus_DSM_COG_10_N43_00_E022_00_DEM.tif"]

def sample(lon, lat):
    for t in tiles:
        with rasterio.open(t) as s:
            if s.bounds.left <= lon <= s.bounds.right and s.bounds.bottom <= lat <= s.bounds.top:
                v = list(s.sample([(lon, lat)]))[0][0]
                return None if v < -1000 else round(float(v), 1)
    return None

ov = json.load(open("izvori_overpass.json", encoding="utf-8"))["elements"]
vila = (43.30957, 21.94854)  # OSM centroid poligona vile, kota 198.2 (v0.21)

kand = []
for e in ov:
    lat, lon = e["lat"], e["lon"]
    m = sample(lon, lat)
    d = math.hypot((lon - vila[1]) * 111.32 * math.cos(math.radians(43.3)),
                   (lat - vila[0]) * 110.57)
    kand.append({
        "osm_node": str(e["id"]), "ime": e.get("tags", {}).get("name"),
        "lat": round(lat, 5), "lon": round(lon, 5),
        "kota_glo30": m, "udaljenost_km": round(d, 2),
        "visinska_razlika_m": None if m is None else round(m - 198.2, 1),
    })

# susedna tačka uzvodno 100 m za proveru da kota nije šum (node može biti na dnu klisure)
for k in kand:
    m2 = sample(k["lon"] + 0.001, k["lat"] + 0.001)
    k["kota_susedna"] = m2

json.dump(kand, open("dem_izvori_kandidati_v023.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k in kand:
    print(k["osm_node"], k["ime"], k["lat"], k["lon"], "kota", k["kota_glo30"], "susedna", k["kota_susedna"], "km", k["udaljenost_km"], "dh", k["visinska_razlika_m"])
