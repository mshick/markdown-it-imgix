"use strict";

const url = require("url");

const matchUrlRe = function (matchUrl, flags) {
  return new RegExp(`^(https:|http:)?(//)?${matchUrl}`, flags);
};

const getAttr = function (token, attr) {
  const idx = token.attrIndex(attr);
  if (idx === -1) {
    return;
  }
  return token.attrs[idx][1];
};

const buildSrc = function (path, re, profile) {

  const parsed = url.parse(path);
  const path2 = path.replace(re, "");

  if (path !== path2) {
    const protocol = profile.secureUrl ? "https" : "http";
    const host = profile.domain;
    const pathname = path2.replace(/\?$/, "").replace(/^https?/, "").replace(/^:?\/\//, "");
    const query = Object.assign({}, profile.params, parsed.query);
    return url.format({ protocol, host, pathname, query });
  } else {
    return path;
  }
};

const mapSrc = function (profiles) {

  return function (token) {
    if (token.type === "image") {
      const srcIndex = token.attrIndex("src");
      const src = getAttr(token, "src");
      const width = getAttr(token, "width");
      const height = getAttr(token, "height");
      for (const profile of profiles) {
        if (!profile.match || !profile.domain) {
          continue;
        }
        const re = matchUrlRe(profile.match, "i");
        if (re.test(src)) {
          if (width && height) {
            profile.params = Object.assign({}, profile.params, { w: width, h: height });
          }
          token.attrs[srcIndex][1] = buildSrc(src, re, profile);
        }
      }
    }
    return token;
  };
};

module.exports = function (md, options) {

  if (!options) {
    return;
  }

  const profiles = Array.isArray(options) ? options : [ options ];

  const defaultRenderer = md.renderer.rules.image;

  const imgixRenderer = function (tokens, idx, opt, env, self) {
    tokens = tokens.map(mapSrc(profiles));
    return defaultRenderer(tokens, idx, opt, env, self);
  };

  md.renderer.rules.image = imgixRenderer;
};
