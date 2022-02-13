export interface ArrayBufferFile {
  name: string;
  arrayBuffer: ArrayBuffer | null;
}

export interface ILightshow {
  fseq?: ArrayBufferFile;
  audio?: ArrayBufferFile;
}

export interface ITimelineRow {
  selected: boolean;
  hidden: boolean;
  keyframes: Array<any>;
  data: any;
  title: string;
  channel: any;
}

export interface IKeyFrameIntervals {
  start: { val: number; state: number } | undefined;
  end: { val: number; state: number } | undefined;
}