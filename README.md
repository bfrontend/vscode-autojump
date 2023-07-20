## autojump README

<a href="https://marketplace.visualstudio.com/items?itemName=webxmsj.autojump" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/webxmsj.autojump.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

[中文文档](./README_CN.md)

A command to quickly open a specific folder in VS Code, supporting z, autojump, and zoxide.

> You can configure the following keybindings in keybinds.json to use "Quick Open Folder" [automatically set].

```json
{
  "key": "cmd+o",
  "command": "autojump.openFolder"
},
{
  "key": "shift+cmd+o",
  "command": "autojump.revealFolder"
},
```

### Available configuration options

```json
{
  "autojump.isSkipWarnModal": false, // Enable folder selection confirmation dialog when skipping unmatched items
  "autojump.smartPlugin": "" // Specify the database source to use: z | autojump | zoxide
  "autojump.isRevealCurrent": true // Show current working folder in Finder when no matches are found.
}
```

* If autojump.smartPlugin is not specified, the database files will be searched in the order of autojump/z/zoxide by default
* If no database files for autojump/z/zoxide are found, a .webxmsj file will be created in the user's home directory as the database file.
* Add the command autojump.revealFolder (to show the specified folder in Finder), with the default keybinding of Shift+Cmd+O.
* Add the configuration option autojump.isRevealCurrent, which determines whether to show the current working folder in Finder when a folder is not found through aliases.
