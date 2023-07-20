## autojump README

<a href="https://marketplace.visualstudio.com/items?itemName=webxmsj.autojump" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/webxmsj.autojump.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

[英文文档](./README.md)

一个在vscode中快速打开指定文件夹的命令,支持z、autojump、zoxide

> 你可以在 keybinds.json 中配置如下快捷键 使用 快速打开文件夹 [已自动设置]

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

### 可供使用的配置项

```json
{
  "autojump.isSkipWarnModal": false, // 是否跳过未找到匹配项时使用文件夹选择确认弹窗
  "autojump.smartPlugin": "" // 指定使用的数据库来源 z | autojump
  "autojump.isRevealCurrent": true // 是否在未找到匹配项时在finder中显示当前工作文件夹
}
```

* 如果不指定autojump.smartPlugin 默认按照 autojump/z/zoxide 的顺序查找对应的数据库文件
* 如果autojump/z/zoxide的数据库文件都没找到, 则会在用户的home目录下创建.webxmsj的文件作为数据库文件
* 新增autojump.revealFolder命令(在finder中显示指定文件夹), 默认绑定的快捷键是shift+cmd+o
* 新增autojump.isRevealCurrent配置项, 通过别名未找到文件夹是是否在finder中显示当前工作文件
