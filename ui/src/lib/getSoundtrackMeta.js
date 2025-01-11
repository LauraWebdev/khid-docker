async function getSoundtrackMeta(urlOrSlug) {
    let response = await fetch("http://localhost:8080/api/soundtrack/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            urlOrSlug: urlOrSlug,
        })
    });
    let json = await response.json();

    if (json?.status === 200) {
        return json.data;
    } else {
        return false;
    }
}

export default getSoundtrackMeta;