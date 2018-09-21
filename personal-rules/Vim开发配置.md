
### Tips 1: 支持F5调试

- 编辑`~/.vimrc`
``` bash
"""
"Quickly RUN <COPY FROM LaiMingXing ZhiHu>
"""

map <F5> :call CompileRunGcc()<CR>
func! CompileRunGcc()
    exec "w"
    if &filetype == 'c'
        exec "!g++ % -o %<"
        exec "!time ./%<"
    elseif &filetype == 'cpp'
        exec "!g++ % -o %<"
        exec "!time ./%<"
    elseif &filetype == 'java'
        exec "!java %"
        exec "!time ./java %<"
    elseif &filetype == 'sh'
        :!time bash %
    elseif &filetype == 'python'
        exec "!time python %"
    elseif &filetype == 'html'
        exec "!firefox % &"
    elseif &filetype == 'go'
        exec "!time go run %"
    elseif &filetype == 'mkd'
        exec "!~/.vim/markdown.pl % > %.html &"
        exec "!firefox %.html &"
    endif
endfunc
```

### Tips 2: 代码补全

- 使用`YourCompleteMe`插件
```bash
https://github.com/Valloric/YouCompleteMe
```

- 插件`vim-snipmate`
```bash
https://github.com/garbas/vim-snipmate
```

- 插件`xptemplate`
```bash
https://github.com/drmingdrmer/xptemplate
```

### Tips 3: 语法检查

- 插件`Syntastic`
```bash
https://github.com/vim-syntastic/syntastic
```

### Tips 4: 编程提示

- 插件`jedi-vim`
```bash
https://github.com/davidhalter/jedi-vim
```
