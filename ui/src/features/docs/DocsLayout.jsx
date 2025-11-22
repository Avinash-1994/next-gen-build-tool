import { Outlet, useLocation } from 'react-router-dom'
import DocsSidebar from './components/DocsSidebar'
import DocsSearch from './components/DocsSearch'
import Breadcrumbs from './components/Breadcrumbs'
import { getBreadcrumbs } from './data/docsData'

export default function DocsLayout() {
    const location = useLocation()
    const breadcrumbs = getBreadcrumbs(location.pathname)

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <DocsSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with Search */}
                <div className="border-b bg-card px-6 py-4">
                    <DocsSearch />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <Breadcrumbs items={breadcrumbs} />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
