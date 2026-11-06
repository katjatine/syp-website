// The style guide (/styleguide/) is a working page: like /relecture/ it only exists while the preview is behind the PIN code.
// When "pincode" in src/_data/site.json is emptied for the launch, the page disappears.
module.exports = {
  eleventyComputed: {
    permalink: (data) => (data.site && String(data.site.pincode || "").trim() ? "/styleguide/" : false),
  },
};
