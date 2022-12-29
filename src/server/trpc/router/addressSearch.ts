import { env } from "env/server.mjs";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

import type { MapboxPlaces } from "types/map-box";

/* type Reshape = {
    address: string;
    placeName: string;
    longitude: number;
    latitude: number;
}; */

export const addressSearchRouter = t.router({
    search: authedProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input }) => {
            return (await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${input.query}.json?access_token=${env.MAP_BOX_KEY}`
            ).then((res) => res.json())) as MapboxPlaces;
        }),
});
