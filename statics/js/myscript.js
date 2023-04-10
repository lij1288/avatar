window.$docsify = {
    name: "Li Jiong's Notes",
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
        copy: '<hr/><span id="sitetime"></span><br/><span>Copyright &copy; 2014 - 至今</span>',
        auth: '<a href="https://www.lijiong.cn" target="_blank">🏷️ Lijiong Blog</a> <span>操千曲而后晓声，观千剑而后识器</span>',
        style: 'text-align:center;',
    },
}