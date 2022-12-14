window.$docsify = {
    name: "Lij's NoteBook",
    nameLink: {
        '/blog/': '#/blog/',
        '/': '#/',
    },
    repo: 'https://www.lijiong.cn/',
    loadNavbar: true,
    noEmoji: true,
    auto2top: true,
    search: 'auto',
    search: {
        maxAge: 3600000,
        paths: 'auto',
        placeholder: 'Type to search',
        noData: 'No Results',
        depth: 4,
        hideOtherSidebarContent: false,
    },
    copyCode: {
        buttonText: 'Copy to clipboard',
        errorText: 'Error',
        successText: 'Copied'
    },
    footer: {
        copy: '<hr/><span id="sitetime"></span><br/><span>Copyright &copy; 2014 - ่ณไป</span>',
        auth: '<a href="https://www.lijiong.cn" target="_blank">๐ท๏ธ Lijiong Blog</a> <span>ๆๅๆฒ่ๅๆๅฃฐ๏ผ่งๅๅ่ๅ่ฏๅจ</span>',
        style: 'text-align:center;',
    },
}