import {API_BASE_URL} from "../../env.js";

async function getSoundtrackCovers(urlOrSlug) {
    let response = await fetch(API_BASE_URL + '/api/soundtrack/covers', {
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
        return [];
    }
}

export default getSoundtrackCovers;