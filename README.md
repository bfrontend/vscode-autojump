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

> `autojump.isSkipWarnModal`: Enable folder selection confirmation dialog when skipping unmatched items

> `autojump.smartPlugin`: Specify the database source to use: z | autojump | zoxide

> `autojump.isRevealCurrent`: Show current working folder in Finder when no matches are found.

```json
{
  "autojump.isSkipWarnModal": false,
  "autojump.smartPlugin": ""
  "autojump.isRevealCurrent": true
}
```

* If autojump.smartPlugin is not specified, the database files will be searched in the order of autojump/z/zoxide by default
* If no database files for autojump/z/zoxide are found, a .webxmsj file will be created in the user's home directory as the database file.
* Add the command autojump.revealFolder (to show the specified folder in Finder), with the default keybinding of Shift+Cmd+O.
* Add the configuration option autojump.isRevealCurrent, which determines whether to show the current working folder in Finder when a folder is not found through aliases.

<a href="https://www.buymeacoffee.com/gbraad" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<div style="display:flex;height: 300px;gap: 20px;">
<img src="https://cdn.staticaly.com/gh/webxmsj/picx-images-hosting@master/611693473392_.pic.758unr4lga80.webp" alt="alipay"></img>
<img src="https://cdn.staticaly.com/gh/webxmsj/picx-images-hosting@master/601693473391_.pic.6w0ja764mnk0.webp" alt="wechat"></img>
</div>