// components/Documentation/VideoTutorials.tsx

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Play, Monitor } from "lucide-react";

interface VideoTutorial {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
}

export const VideoTutorials: React.FC = () => {
    const tutorials: VideoTutorial[] = [
        {
            id: "1",
            title: "Cara Membuat License Baru",
            description:
                "Tutorial cara menggunakan sistem manajemen lisensi untuk membuat license baru.",
            youtubeId: "dQw4w9WgXcQ", // Replace dengan YouTube ID yang sebenarnya
        },
        {
            id: "2",
            title: "Mengelola License yang Ada",
            description:
                "Tutorial cara menggunakan sistem manajemen lisensi untuk mengelola license yang sudah ada.",
            youtubeId: "dQw4w9WgXcQ", // Replace dengan YouTube ID yang sebenarnya
        },
        {
            id: "3",
            title: "Monitor Aktivitas License",
            description:
                "Tutorial cara menggunakan sistem manajemen lisensi untuk memantau aktivitas license.",
            youtubeId: "dQw4w9WgXcQ", // Replace dengan YouTube ID yang sebenarnya
        },
        {
            id: "4",
            title: "Suspend dan Reactive License",
            description:
                "Tutorial cara menggunakan sistem manajemen lisensi untuk suspend dan reactive license.",
            youtubeId: "dQw4w9WgXcQ", // Replace dengan YouTube ID yang sebenarnya
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Play className="h-6 w-6 text-purple-600" />
                        </div>
                        Video Tutorial
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Tutorial cara menggunakan sistem manajemen lisensi
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Video List */}
            <div className="space-y-6">
                {tutorials.map((tutorial) => (
                    <Card key={tutorial.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-blue-600" />
                                {tutorial.title}
                            </CardTitle>
                            <CardDescription>
                                {tutorial.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
                                    title={tutorial.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
