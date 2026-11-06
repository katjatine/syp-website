// The page with the missing information for Raphaël (/relecture/) only exists while the preview is behind the PIN code.
// When "pincode" in src/_data/site.json is emptied for the launch, the page disappears.
module.exports = {
  eleventyComputed: {
    permalink: (data) => (data.site && String(data.site.pincode || "").trim() ? "/relecture/" : false),
  },
};
