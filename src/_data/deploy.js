// Where this build runs. Netlify sets CONTEXT: "production" for main, "branch-deploy" or "deploy-preview" for
// test addresses such as proofreading--goodplanet-syp.netlify.app. A test address keeps search engines out, like
// "noindex" in site.json does for the whole site; on a laptop (no CONTEXT) nothing changes.
const context = process.env.CONTEXT || "";
module.exports = { context, preview: context !== "" && context !== "production" };
