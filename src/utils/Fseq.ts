/* eslint-disable camelcase */
import { SmartBuffer } from 'smart-buffer';

export default class Fseq {
  buffer: SmartBuffer;

  minorVersion: number;

  majorVersion: number;

  channelDataStart: number;

  channelCountPerFrame: number;

  numberOfFrames: number;

  stepTimeInMs: number;

  uniqueId: number;

  compressionType: number;

  variableHeaders: Array<[string, any]>;

  // not used
  frameOffsets: Array<[number, number]>;

  sparseRanges: Array<[number, number]>;


  constructor(
    buffer: SmartBuffer,
    minorVersion: number,
    majorVersion: number,
    channelDataStart: number,
    channelCountPerFrame: number,
    numberOfFrames: number,
    stepTimeInMs: number,
    uniqueId: number,
    compressionType: number,
    frameOffsets: Array<[number, number]>,
    sparseRanges: Array<[number, number]>,
    variableHeaders: Array<[string, any]>,
  ) {
    this.buffer = buffer;
    this.minorVersion = minorVersion;
    this.majorVersion = majorVersion;
    this.channelDataStart = channelDataStart;
    this.channelCountPerFrame = channelCountPerFrame;
    this.numberOfFrames = numberOfFrames;
    this.stepTimeInMs = stepTimeInMs;
    this.uniqueId = uniqueId;
    this.compressionType = compressionType;
    this.frameOffsets = frameOffsets;
    this.sparseRanges = sparseRanges;
    this.variableHeaders = variableHeaders;

    const data = this.buffer.internalBuffer.subarray(this.channelDataStart);
    const expectedDataLength = this.channelCountPerFrame * this.numberOfFrames;

    if (data.byteLength !== expectedDataLength) {
      throw new Error('Wrong data length');
    }
  }

  toString(): string {
    const result: string[] = [];

    result.push(`Version: ${this.majorVersion}.${this.minorVersion}`);
    result.push(`Channel data start: ${this.channelDataStart}`);
    result.push(`Channel count per frame: ${this.channelCountPerFrame}`);
    result.push(`Number of frames: ${this.numberOfFrames}`);
    result.push(`Step in ms: ${this.stepTimeInMs}`);
    result.push(`UUID: ${this.uniqueId}`);
    result.push(`Compression type: ${this.compressionType}`);
    result.push(`Frame offsets length: ${this.frameOffsets.length}`);
    result.push(`Sparse ranges length: ${this.sparseRanges.length}`);
    result.push(`Variable headers: ${this.variableHeaders.length}`);

    const variableHeaders = this.variableHeaders.map((variableHeader) => `\t${variableHeader.join(': ')}`);
    result.push(...variableHeaders)

    return result.join('; ');
  }

  get_frame(frame: number) {
    if (frame >= this.numberOfFrames) {
      throw new Error('frame index out of bounds');
    }

    let absoluteSeek = this.channelDataStart; // Skip the header and data tables
    absoluteSeek += frame * this.channelCountPerFrame;

    const data = this.buffer.internalBuffer.subarray(absoluteSeek, absoluteSeek + this.channelCountPerFrame);

    return data;
  }
}
