# Change Log

All notable changes to the "autojump" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

### Release History

- v0.0.12

  - 新增是否忽略大小写的参数(autojump.ignoreCase),默认false

- v0.0.11

  - 区分取消操作、确定但未输入内容的行为

- v0.0.10

  - 新增autojump.isCancel配置项 按下取消键(esc)时是否打开文件夹选择器

- v0.0.9

  - 添加在不出入别名时,执行对应的打卡文件夹或预览文件夹的行为

- v0.0.8

  - 修复zoxide匹配到多个时 命令执行报错的问题

- v0.0.6

  - 添加对zoxide的支持

- v0.0.5

  - 新增autojump.revealFolder命令(在finder中显示指定文件夹), 默认绑定的快捷键是shift+cmd+o
  - 新增autojump.isRevealCurrent配置项, 通过别名未找到文件夹是是否在finder中显示当前工作文件夹

- v0.0.4

  - 重构代码,支持z、autojump数据文件的读写

- v0.0.3

  - 更新查找匹配规则

- Initial release
