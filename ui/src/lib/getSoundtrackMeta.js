import {API_BASE_URL} from "../../env.js";

async function getSoundtrackMeta(urlOrSlug) {
    let response = await fetch(API_BASE_URL + '/api/soundtrack/', {
        method: 'POST',
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