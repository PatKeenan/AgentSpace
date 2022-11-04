import { env } from "env/server.mjs";
import { authedProcedure, t } from "../trpc";
import { z } from "zod";

import type { MapboxPlaces } from "types/map-box";

export const addressSearchRouter = t.router({
    search: authedProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input }) => {
            const data = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${input.query}.json?access_token=${env.MAP_BOX_PUBLIC_KEY}`
            ).then((res) => res.json());
            return data as MapboxPlaces;
        }),
});
