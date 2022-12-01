import classnames from 'classnames';
import * as React from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

// Styles
import 'video.js/dist/video-js.css';

interface IVideoPlayerProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
  className?: string;
}

const initialOptions: VideoJsPlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options, onReady, className }) => {
  // const videoNode = React.useRef<HTMLVideoElement>(null);
  // const player = React.useRef<videojs.Player>();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const playerRef = React.useRef<VideoJsPlayer | null>(null);

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        onReady?.(player);
      });
    } else {
      const player = playerRef.current;
      onReady?.(player);
      // you can update player here [update player through props]
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef]);
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  return (
    <div data-vjs-player>
      <video ref={videoRef} className={classnames('video-js', className)} />
    </div>
  );
};

export default VideoPlayer;
