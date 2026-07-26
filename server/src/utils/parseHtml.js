import * as cheerio from "cheerio";

export function parseHtml(html) {

    const $ = cheerio.load(html);

    return {

        title: $("title").text().trim(),

        description:
            $('meta[name="description"]').attr("content") || "",

        h1:
            $("h1").first().text().trim(),

        images:
            $("img").length,

        links:
            $("a").length

    };

}