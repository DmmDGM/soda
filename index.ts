// Creates output
const definitions = [
    source("1f0000").tween("ef4f4f", 13).tween("efcfcf", 6).define("red"),
    source("1f0700").tween("ef6f4f", 13).tween("efcfbf", 6).define("coral"),
    source("1f0f00").tween("ef8f4f", 13).tween("efcfaf", 6).define("orange"),
    source("1f1700").tween("efaf4f", 13).tween("efdfbf", 6).define("amber"),
    source("1f1f00").tween("efef4f", 13).tween("efefcf", 6).define("yellow"),
    source("0f1f00").tween("afef4f", 13).tween("dfefcf", 6).define("lime"),
    source("001f00").tween("4fef4f", 13).tween("cfefcf", 6).define("green"),
    source("001f0f").tween("4fefaf", 13).tween("cfefdf", 6).define("teal"),
    source("0f1f1f").tween("4fefef", 13).tween("cfefef", 6).define("cyan"),
    source("000f1f").tween("0f8fef", 13).tween("afcfef", 6).define("blue"),
    source("00001f").tween("4f4fef", 13).tween("cfcfef", 6).define("indigo"),
    source("0f071f").tween("6f4faf", 13).tween("dfcfef", 6).define("violet"),
    source("1f0f1f").tween("8f4f8f", 13).tween("efcfef", 6).define("purple"),
    source("1f0717").tween("af2faf", 13).tween("efbfdf", 6).define("grape"),
    source("1f000f").tween("ef0fbf", 13).tween("efafcf", 6).define("magenta"),
    source("1f030f").tween("ef4fbf", 13).tween("efbfc7", 6).define("fuchsia"),
    source("1f070f").tween("ef8fbf", 13).tween("efcfdf", 6).define("pink"),
    source("0f0f0f").tween("7f7f7f", 13).tween("efefef", 6).define("mono")
];
const output = `:root{${definitions.join("")}}`;

// Writes file
await Bun.write("soda.css", output);
console.log("> Done!");

// Defines color type
type Color = {
    define: (name: string) => string;
    tween: (target: string, steps: number) => Color;
};

// Defines color factory
function source(root: string): Color {
    // Creates gradient
    const gradient = [ root ];

    // Creates instance
    const self: Color = {
        define: (name) => {
            // Defines gradient
            return gradient.map((color, index) => `--sd-${name}-${(index + 1) * 50}:#${color};`).join("");
        },
        tween: (target, steps) => {
            // Calculates delta
            const last = gradient[gradient.length - 1]!;
            const start = rgb(last);
            const end = rgb(target);
            const delta: [ number, number, number ] = [
                (end[0] - start[0]) / steps,
                (end[1] - start[1]) / steps,
                (end[2] - start[2]) / steps
            ];

            // Tweens color
            for(let i = 0; i < steps; i++) {
                const next: [ number, number, number ] = [
                    Math.trunc(start[0] + delta[0] * (i + 1)),
                    Math.trunc(start[1] + delta[1] * (i + 1)),
                    Math.trunc(start[2] + delta[2] * (i + 1))
                ];
                gradient.push(hex(next));
            }
            return self;
        }
    }
    return self;
}

// Defines converters
function rgb(hex: string): [ number, number, number ] {
    // Converts color
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16)
    return [ red, green, blue ];
}
function hex(rgb: [ number, number, number ]): string {
    // Converts color
    const red = rgb[0].toString(16);
    const green = rgb[1].toString(16);
    const blue = rgb[2].toString(16);
    return red.padStart(2, "0") + green.padStart(2, "0") + blue.padStart(2, "0");
}
