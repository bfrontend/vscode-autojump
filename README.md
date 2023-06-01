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

## 如果不需要在终端中使用autojump 或 未安装autojump命令行工具的情况

> 下列步骤任选其一

* 安装命令行工具[autojump](https://github.com/wting/autojump)

```shell
brew install autojump
```

* 手动创建记录文件

```shell
mkdir -p $HOME/Library/autojump   # 创建文件夹
touch $HOME/Library/autojump/autojump.txt   # 创建文件
```
