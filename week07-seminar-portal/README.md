# Week 7 Simple Agent Seminar Portal

Static GitHub Pages portal for the INFS5706 Week 7 seminar.

## Entry points

- `index.html`: student team workspace
- `facilitator.html`: passcode-gated facilitator controls
- `present.html`: full-screen presentation journey
- `knowledge/*.html`: public synthetic knowledge pages for agent grounding

## Classroom controls

Edit `config.js` before publishing to change:

- facilitator passcode;
- release codes;
- phase timings; and
- team-to-case allocations.

The passcode and release codes are implemented in client-side JavaScript. They deter ordinary classroom access but are not secure authentication.

## Data behaviour

Student responses are stored in browser `localStorage`. Nothing is sent to a server. One nominated team recorder should use the same browser for the whole seminar and download the `.docx` record before leaving.

## GitHub Pages

Upload the complete folder without changing its internal filenames or structure. Configure GitHub Pages to publish the folder contents. All internal links use relative paths and will work from a project Pages URL.

