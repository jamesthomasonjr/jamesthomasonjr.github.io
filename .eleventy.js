module.exports = function(eleventyConfig) {
  // Copy CSS files
  eleventyConfig.addPassthroughCopy("css");

  // Add a nunjucks filter to turn an array of values into a | separated string
  eleventyConfig.addNunjucksFilter("join", function(value) { return value.join(" | ") });
};
