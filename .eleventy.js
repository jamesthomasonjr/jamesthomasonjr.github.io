module.exports = function(eleventyConfig) {
  // Copy over the CNAME file
  eleventyConfig.addPassthroughCopy("cname");

  // Copy CSS files
  eleventyConfig.addPassthroughCopy("css");

  require('./filters')(eleventyConfig);

  return {
    dir: {
      input: "views"
    }
  }
};
