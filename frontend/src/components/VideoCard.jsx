import { Link } from "react-router-dom";
import YouTubeEmbed from "./YouTubeEmbed";

const VideoCard = ({ video }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="relative">
                <YouTubeEmbed videoId={video.youtubeUrl} title={video.title} />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 hover:underline">
                    <Link target="_blank" to={video.youtubeUrl}>{video.title}</Link>
                </h3>
                {video.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                        {video.description}
                    </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Added by {video.addedByUsername}</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;