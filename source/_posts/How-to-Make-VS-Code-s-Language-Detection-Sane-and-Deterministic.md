---
title: How to Make VS Code's Language Detection Sane (and Deterministic)
date: 2025-08-12
categories:
  - DevOps, SysAdmin
tags:
  - Reference
---

Anyone who's used Visual Studio Code long enough has probably run into some surprisingly silly (and maddening) mistakes from its automatic language detection.

Things get especially annoying with temporary or scratch files: VS Code tries too hard to be clever and ends up insisting your random notes are "Groovy" or "Shell" scripts. If you're like me, you just want **files with clear, non-ambiguous extensions** mapped correctly, and everything else opened as **plain text**. Simpler, saner, less frustrating.

## The Fix: Use Explicit File Associations

By explicitly listing out the extension - language bindings in your `settings.json`, you can make VS Code behave in a much more predictable way.

- For every common, unambiguous extension (`.js`, `.py`, `.cpp`, etc.), set the language association directly.
- For ambiguous or tricky cases (like `.m` for both Objective-C and MATLAB), don't specify anything - you can always override them manually.
- For all other files (including all extensionless files and temporary files), **force them to open as plain text**.

This means no more unwanted language features popping up, and every common language just works.

## How to Set It Up

1. Open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Type and select: `Preferences: Open Settings (JSON)`
3. Replace any existing `"files.associations"` block in your global `settings.json`:

```json
{
    "files.associations": {
        "Dockerfile": "dockerfile",
        "Makefile": "makefile",
        "*.abap": "abap",
        "*.bat": "bat",
        "*.bib": "bibtex",
        "*.c": "c",
        "*.cc": "cpp",
        "*.clj": "clojure",
        "*.cljc": "clojure",
        "*.cljs": "clojure",
        "*.cmd": "bat",
        "*.coffee": "coffeescript",
        "*.cpp": "cpp",
        "*.cs": "csharp",
        "*.cshtml": "razor",
        "*.css": "css",
        "*.cu": "cuda-cpp",
        "*.cuh": "cuda-cpp",
        "*.cxx": "cpp",
        "*.d": "d",
        "*.dart": "dart",
        "*.diff": "diff",
        "*.erl": "erlang",
        "*.fs": "fsharp",
        "*.fsi": "fsharp",
        "*.fsx": "fsharp",
        "*.go": "go",
        "*.groovy": "groovy",
        "*.haml": "haml",
        "*.handlebars": "handlebars",
        "*.hbs": "handlebars",
        "*.hpp": "cpp",
        "*.hrl": "erlang",
        "*.hs": "haskell",
        "*.htm": "html",
        "*.html": "html",
        "*.ini": "ini",
        "*.jade": "jade",
        "*.java": "java",
        "*.jl": "julia",
        "*.js": "javascript",
        "*.json": "json",
        "*.jsonc": "jsonc",
        "*.jsx": "javascriptreact",
        "*.less": "less",
        "*.lua": "lua",
        "*.markdown": "markdown",
        "*.md": "markdown",
        "*.ml": "ocaml",
        "*.mli": "ocaml",
        "*.mm": "objective-cpp",
        "*.p6": "raku",
        "*.pas": "pascal",
        "*.patch": "diff",
        "*.php": "php",
        "*.php4": "php",
        "*.php5": "php",
        "*.phtml": "php",
        "*.pl": "perl",
        "*.pl6": "raku",
        "*.pm": "perl",
        "*.ps1": "powershell",
        "*.psm1": "powershell",
        "*.pug": "pug",
        "*.py": "python",
        "*.r": "r",
        "*.raku": "raku",
        "*.rakumod": "raku",
        "*.rb": "ruby",
        "*.rs": "rust",
        "*.sass": "sass",
        "*.scss": "scss",
        "*.sh": "shellscript",
        "*.shader": "shaderlab",
        "*.slim": "slim",
        "*.sql": "sql",
        "*.styl": "stylus",
        "*.svelte": "svelte",
        "*.swift": "swift",
        "*.tex": "tex",
        "*.ts": "typescript",
        "*.tsx": "typescriptreact",
        "*.txt": "plaintext",
        "*.vb": "vb",
        "*.vue": "vue",
        "*.xml": "xml",
        "*.xsl": "xsl",
        "*.xslt": "xsl",
        "*.yaml": "yaml",
        "*.yml": "yaml",
        "*": "plaintext"
    }
}
```

Notice the last line: `"*": "plaintext"` - this forces every file **not matched above**, including all files with no extension, to open as plain text.

### Why this is so much better

- **No more weird guesses:** Scratch files stay as plain text.
- **You get what you expect:** Every major extension gets its proper language features.
- **You can still override manually:** For rare ambiguous cases, you can still set the language from the bottom right and VS Code remembers per file.

## Conclusion

VS Code's default language detection tries to be smart, but often outsmarts itself. By making associations deterministic and catching all other files as plain text, you make your workflow saner and more predictable.

Try it out and enjoy a quieter, less-annoying VS Code!
