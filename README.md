## autojump README

一个在vscode中快速打开指定文件夹的命令,灵感来源于z、autojump、zoxide

> 你可以在 keybinds.json 中配置如下快捷键 使用 快速打开文件夹 [已自动设置]

```json
{
  "key": "cmd+o",
  "command": "autojump.openFolder"
},
```

### 可供使用的配置项

```json
{
  "autojump.isSkipWarnModal": false, // 是否跳过未找到匹配项时使用文件夹选择确认弹窗
  "autojump.smartPlugin": "" // 指定使用的数据库来源 z | autojump
}
```

> 如果不指定autojump.smartPlugin 默认按照 autojump/z 的顺序查找对应的数据库文件
> 如果autojump/z的数据库文件都没找到, 则会在用户的home目录下创建.webxmsj的文件作为数据库文件
