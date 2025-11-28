import RiaChat from "@/components/RiaChat";
import { GridPattern } from "@/components/ui/GridPattern";

export default function Agent() {
    return (
        <div className="min-h-screen bg-zinc-950 relative">
            <GridPattern />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Chat with <span className="text-orange-500">Ria</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Your AI wellness assistant is here to help you achieve your health goals
                    </p>
                </div>

                {/* Chat Interface */}
                <div className="max-w-4xl mx-auto">
                    <RiaChat />
                </div>
            </div>
        </div>
    );
}
