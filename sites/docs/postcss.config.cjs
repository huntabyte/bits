/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const tailwindcss = require("tailwindcss");
const tailwindNesting = require("tailwindcss/nesting");
const autoprefixer = require("autoprefixer");

const config = {
	plugins: [
		tailwindNesting,
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(path.resolve(__dirname, "./tailwind.config.js")),
		//But others, like autoprefixer, need to run after,
		autoprefixer,
	],
};

module.exports = config;
