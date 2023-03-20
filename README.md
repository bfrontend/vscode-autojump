## autojump README

一个在vscode中使用autojump 的插件

### 你可以在 keybinds.json 中配置如下快捷键 使用 快速打开文件夹 [已自动设置]

```json
{
  "key": "cmd+o",
  "command": "autojump.openFolder"
},
```

### 可供使用的配置项

```json
{
  "autojump.isSkipWarnModal": false // 是否跳过未找到匹配项时使用文件夹选择确认弹窗
}
```

## TODO

* ~~暂不支持 在未安装autojump的情况下使用(为重新计算权重) WIP~~
