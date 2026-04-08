import { audioTracks, type AudioTrackManifest } from "@/lib/media";

export interface AudioTrack extends AudioTrackManifest {}

export { audioTracks };

export const getAvailableTracks = (): AudioTrack[] => audioTracks;
