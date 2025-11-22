// Documentation navigation structure and metadata
export const docsNavigation = [
    {
        title: 'Getting Started',
        path: '/docs/getting-started',
        icon: '🚀',
        items: [
            { title: 'Introduction', path: '/docs/getting-started/introduction' },
            { title: 'Installation', path: '/docs/getting-started/installation' },
            { title: 'Quick Start', path: '/docs/getting-started/quick-start' },
        ],
    },
    {
        title: 'Guide',
        path: '/docs/guide',
        icon: '📘',
        items: [
            { title: 'Visual Builder', path: '/docs/guide/visual-builder' },
            { title: 'Node Types', path: '/docs/guide/node-types' },
            { title: 'Configuration', path: '/docs/guide/configuration' },
        ],
    },
    {
        title: 'Framework Guides',
        path: '/docs/frameworks',
        icon: '⚛️',
        items: [
            { title: 'React', path: '/docs/frameworks/react' },
            { title: 'Vue', path: '/docs/frameworks/vue' },
            { title: 'Angular', path: '/docs/frameworks/angular' },
            { title: 'Svelte', path: '/docs/frameworks/svelte' },
        ],
    },
    {
        title: 'API Reference',
        path: '/docs/api',
        icon: '📖',
        items: [
            { title: 'CLI Reference', path: '/docs/api/cli-reference' },
            { title: 'Configuration API', path: '/docs/api/configuration' },
            { title: 'Plugin API', path: '/docs/api/plugins' },
            { title: 'Node API', path: '/docs/api/node-api' },
        ],
    },
    {
        title: 'Tutorials',
        path: '/docs/tutorials',
        icon: '🎓',
        items: [
            { title: 'Your First Pipeline', path: '/docs/tutorials/first-pipeline' },
            { title: 'Custom Plugins', path: '/docs/tutorials/custom-plugins' },
            { title: 'Micro Frontends', path: '/docs/tutorials/micro-frontends' },
        ],
    },
    {
        title: 'Troubleshooting',
        path: '/docs/troubleshooting',
        icon: '🔧',
        items: [
            { title: 'Common Issues', path: '/docs/troubleshooting/common-issues' },
        ],
    },
    {
        title: 'FAQ',
        path: '/docs/faq',
        icon: '❓',
    },
]

// Flatten navigation for search index
export const getAllDocPages = () => {
    const pages = []

    docsNavigation.forEach(section => {
        if (section.items) {
            section.items.forEach(item => {
                pages.push({
                    title: item.title,
                    path: item.path,
                    section: section.title,
                })
            })
        } else {
            pages.push({
                title: section.title,
                path: section.path,
                section: 'Root',
            })
        }
    })

    return pages
}

// Get breadcrumb trail for a path
export const getBreadcrumbs = (pathname) => {
    const breadcrumbs = [{ title: 'Docs', path: '/docs' }]

    for (const section of docsNavigation) {
        if (section.items) {
            const item = section.items.find(i => i.path === pathname)
            if (item) {
                breadcrumbs.push({ title: section.title, path: section.path })
                breadcrumbs.push({ title: item.title, path: item.path })
                break
            }
        } else if (section.path === pathname) {
            breadcrumbs.push({ title: section.title, path: section.path })
            break
        }
    }

    return breadcrumbs
}

// Find next/previous pages
export const getAdjacentPages = (currentPath) => {
    const allPages = getAllDocPages()
    const currentIndex = allPages.findIndex(p => p.path === currentPath)

    return {
        prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
        next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
    }
}
