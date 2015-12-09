/* eslint-disable */

"use strict";

const assert = require("assert");
const Markdown = require("markdown-it");
const imsize = require("markdown-it-imsize");
const imgix = require("./");

describe("markdown-it-imgix", () => {

  const fixture = `text with\n\n![](/another/path/img.png)\n\n![](/example/path/fig.png)\n\nanother paragraph`;
  const fixtureImsize = `text with\n\n![](/another/path/img.png)\n\n![](/example/path/fig.png =500x400)\n\nanother paragraph`;

  it("will apply a single imgix domain when src pattern matches", () => {
    const config = { match: "/example/path", domain: "example.imgix.net" };
    const md = Markdown().use(imgix, config);
    const expected = '<p>text with</p>\n<p><img src="/another/path/img.png" alt=""></p>\n<p><img src="http://example.imgix.net/fig.png" alt=""></p>\n<p>another paragraph</p>\n';
    const res = md.render(fixture);
    assert.equal(res, expected);
  });

  it("will apply imgix params and a secure protocol when set", () => {
    const config = {
      match: "/example/path",
      domain: "example.imgix.net",
      params: { w: 1000 },
      secureUrl: true
    };
    const md = Markdown().use(imgix, config);
    const expected = '<p>text with</p>\n<p><img src="/another/path/img.png" alt=""></p>\n<p><img src="https://example.imgix.net/fig.png?w=1000" alt=""></p>\n<p>another paragraph</p>\n';
    const res = md.render(fixture);
    assert.equal(res, expected);
  });

  it("will apply a multiple imgix domains when src array members match", () => {
    const config = [
      { match: "/example/path", domain: "example.imgix.net" },
      { match: "/another/path", domain: "another.imgix.net" }
    ];
    const md = Markdown().use(imgix, config);
    const expected = '<p>text with</p>\n<p><img src="http://another.imgix.net/img.png" alt=""></p>\n<p><img src="http://example.imgix.net/fig.png" alt=""></p>\n<p>another paragraph</p>\n';
    const res = md.render(fixture);
    assert.equal(res, expected);
  });

  it("will work with imsize markdown extensions", () => {
    const config = { match: "/example/path", domain: "example.imgix.net" };
    const md = Markdown().use(imsize).use(imgix, config);
    const expected = '<p>text with</p>\n<p><img src="/another/path/img.png" alt=""></p>\n<p><img src="http://example.imgix.net/fig.png?w=500&amp;h=400" alt="" width="500" height="400"></p>\n<p>another paragraph</p>\n';
    const res = md.render(fixtureImsize);
    assert.equal(res, expected);
  });
});
