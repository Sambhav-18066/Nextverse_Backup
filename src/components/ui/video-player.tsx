
'use client';

interface VideoPlayerProps {
  videoId: string | null;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  if (!videoId) {
    return (
      <div className="aspect-video w-full rounded-lg bg-black/50 border-2 border-dashed border-white/30 flex items-center justify-center">
        <p className="text-white">Select a video to start learning.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl shadow-purple-500/20">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

