import { z } from "zod";

export const context = z.object({
    id: z
        .string()
        .refine((i) =>
            i.startsWith(
                "postcode" ||
                    "place" ||
                    "district" ||
                    "region" ||
                    "country" ||
                    "neighborhood"
            )
        ),
    text: z.string(),
    wikidata: z.string().optional(),
    short_code: z.string().optional(),
});

export const features = z.object({
    id: z.string().refine((i) => i.startsWith("address.")),
    address: z.string(),
    center: z.array(z.number()).refine((i) => i.length == 2),
    context: z.array(context),
    geometry: z.object({
        type: z.string(),
        coordinates: z.array(z.number()),
        interpolated: z.boolean(),
        omitted: z.boolean(),
    }),
    place_name: z.string(),
    place_type: z.array(z.string()),
    properties: z.any(),
    relevance: z.number(),
    text: z.string(),
    type: z.string(),
});

export const mapboxPlaces = z.object({
    attribution: z.string(),
    features: z.array(features),
    query: z.array(z.string()),
    type: z.string(),
});

export type MapboxPlaces = z.infer<typeof mapboxPlaces>;
