export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const south = searchParams.get("south");
  const west = searchParams.get("west");
  const north = searchParams.get("north");
  const east = searchParams.get("east");

  if (!south || !west || !north || !east) {
    return Response.json(
      { error: "Missing bounding box parameters" },
      { status: 400 }
    );
  }

  // Overpass query with timeout and limit
  const query = `
    [out:json][timeout:25][maxsize:1073741824];
    (
      node["amenity"="cafe"](${south},${west},${north},${east});
    );
    out center 15;
  `;

  const url =
    "https://overpass-api.de/api/interpreter?data=" +
    encodeURIComponent(query);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Overpass error: ${response.statusText}`);
    }
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: err },
      { status: 500 }
    );
  }
}
