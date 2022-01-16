const PurgeCss = require("@fullhuman/postcss-purgecss");
const isDev = process.env.APPENV === "DEV";

const PurgeOptions = {
  // Specify the paths to all of the template files in your project
  content: [
    "./**/*.tsx",
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
};
module.exports = {
  plugins: isDev
    ? [require("tailwindcss")]
    : [require("tailwindcss"), PurgeCss(PurgeOptions)],
};
