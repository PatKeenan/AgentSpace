// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
    const searchAdd = req.body
    console.log(req)
    /* const search = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchAdd}.json?access_token=pk.eyJ1IjoicGF0a2VlbmFuIiwiYSI6ImNsMGZ4ZmNldDB4YzQzZHF0ZTd3dHBwNHEifQ.78tRNwtM7Sg58BBXuZOAMQ` */
    res.status(200).send({status: 'OK'});
};

export default examples;
