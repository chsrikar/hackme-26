import { useState } from 'react';
import TrackCard from './TrackCard';
import TrackModal from './TrackModal';
import { tracks } from '../../data/tracks';

export default function TrackList({ limit }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  const displayedTracks = limit ? tracks.slice(0, limit) : tracks;

  return (
    <>
      <div className="denmu-portfolio-grid">
        {displayedTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onSelect={(t) => setSelectedTrack(t)}
          />
        ))}
      </div>

      {selectedTrack && (
        <TrackModal
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
        />
      )}
    </>
  );
}
