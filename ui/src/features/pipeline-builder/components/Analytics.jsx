import { BarChart3, Package, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'

export default function Analytics() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Bundle Size
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">245 KB</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Gzipped: 78 KB
                    </div>
                    <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>JavaScript</span>
                            <span className="font-medium">180 KB</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: '73%' }} />
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>CSS</span>
                            <span className="font-medium">45 KB</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: '18%' }} />
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Other</span>
                            <span className="font-medium">20 KB</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: '8%' }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Last build time
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>Resolution</span>
                            <span className="text-muted-foreground">180ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Transformation</span>
                            <span className="text-muted-foreground">520ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Bundling</span>
                            <span className="text-muted-foreground">380ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Optimization</span>
                            <span className="text-muted-foreground">120ms</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Dependencies
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Total modules
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                            <span>Direct</span>
                            <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Transitive</span>
                            <span className="font-medium">30</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Duplicates</span>
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">2</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Circular</span>
                            <span className="font-medium text-green-600 dark:text-green-400">0</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
