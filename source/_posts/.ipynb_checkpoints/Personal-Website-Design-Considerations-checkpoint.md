---
title: Personal Website Design Considerations
date: 2022-10-20
categories:
- [Reference]
---

# Hosting

We host our personal website on [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), a static site hosting service. Considerations:

- No need to buy/rent and set up infrastructure, such as Elastic Computing instances, Domain Name, Content Distribution Network, Load Balancer, DDoS protection
- Hosted directly from GitHub repository
- Our personal website meets its limitations:
  - Non-commercial.
  - No confidential information.
  - Published GitHub Pages sites may be no larger than 1 GB.
  - GitHub Pages sites have a soft bandwidth limit of 100 GB per month.
  - GitHub Pages sites have a soft limit of 10 builds per hour.

Implications:

- Static pages.
- Limit content of our personal website to text and lightweight multimedia, such as vector graphics and vector PDFs. Use raster graphics sparingly, and avoid heavyweight multimedia such as audio and video.
- Do not rebuild too frequently (>10 builds per hour).

# Framework

Our personal website uses the [Hexo](https://hexo.io/) blog framework. Considerations:

- Support for GitHub Flavored Markdown.
- Easy-to-use CLI.
- One-command deploy to GitHub Pages.
- Support for two types of pages (Posts and Pages), adequate for a personal website.
- Huge library of spectacular, feature-packed and customizable themes.

# Theme

Our personal website uses the [fluid](https://github.com/fluid-dev/hexo-theme-fluid) theme for Hexo. Considerations:

- Appropriate Features
  - Support for [many third-party commenting systems](https://github.com/YunYouJun/yunyoujun.github.io/issues/105).
  - Mathjax support, renders equations like $E=mc^2$.
  - Mermaid support.
  - Social network links.
- Extremely Detailed Documentation.
- Actively Maintained.

# Our Considerations When Writing Posts

- Make the Markdown file as self-contained as possible. This includes:
  - Using third-party pictures from the Internet with stable URLs whenever possible.
  - Utilize fluid's support for Mermaid, and use Mermaid to describe and render in real-time diagrams such as Flowcharts, Sequence Diagrams, Class Diagrams, State Diagrams, and Mindmaps whenever possible, as opposed to including diagrams generated using other tools.
