export async function getAllData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alldata`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getAllData:", error);
    return {};
  }
}
