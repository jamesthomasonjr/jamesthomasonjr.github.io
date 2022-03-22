module.exports = function(eleventyConfig) {
  // Add a nunjucks filter to turn an array of values into string
  eleventyConfig.addNunjucksFilter("join", function(value, separator = ' ') { return value.join(separator) });
};
