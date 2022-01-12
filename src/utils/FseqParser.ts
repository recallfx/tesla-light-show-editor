import { Buffer } from 'buffer/';
import { SmartBuffer } from 'smart-buffer';
import Fseq from './Fseq';

// we need global Buffer for SmartBuffer to work
// @ts-ignore
// eslint-disable-next-line dot-notation
window['Buffer'] = Buffer;

function getCompressionType(n: number): string {
  if (n === 0) {
    return 'none';
  }

  if (n === 1) {
    return 'zstd';
  }
  if (n === 2) {
    return 'gzip';
  }

  throw new Error(`unrecognized compression type: ${n}`);
}

export default class FseqParser {
  smartBuffer: SmartBuffer;

  fseq: Fseq | null;

  constructor(arrayBuffer: ArrayBuffer) {
    // @ts-ignore
    this.smartBuffer = SmartBuffer.fromBuffer(Buffer.from(arrayBuffer), 'ascii');
    this.fseq = null;

    this.parse();
  }

  parse() {
    const magic = this.smartBuffer.readString(4);
    if (magic !== 'PSEQ') {
      throw new Error(`invalid fseq file magic: ${magic}`);
    }

    const channelDataStart: number = this.smartBuffer.readInt16LE();
    const minorVersion = this.smartBuffer.readUInt8();
    const majorVersion = this.smartBuffer.readUInt8();

    if (majorVersion !== 2 && minorVersion !== 0) {
      throw new Error(`unrecognized fseq file version: ${majorVersion}.${minorVersion}`);
    }

    const standardHeaderLength = this.smartBuffer.readInt16LE();
    const channelCountPerFrame = this.smartBuffer.readInt32LE();

    if (channelCountPerFrame !== 48) {
      throw new Error(`Expected 48 channels, got ${channelCountPerFrame}`);
    }

    const numberOfFrames = this.smartBuffer.readInt32LE();
    const stepTimeInMs = this.smartBuffer.readUInt8();



    const durationSeconds = (numberOfFrames * stepTimeInMs / 1000)
    if (durationSeconds > 5*60) {
      throw new Error(`Expected total duration to be less than ${5*60}s, got ${durationSeconds}s`);
    }

    const bitFlags = this.smartBuffer.readUInt8();

    if (bitFlags !== 0) {
      throw new Error(`unrecognized bit flags: ${bitFlags}`);
    }

    const compressionType = this.smartBuffer.readUInt8();
    
    if (compressionType !== 0) {
      throw new Error(`Expected file format to be V2 Uncompressed, found: ${getCompressionType(compressionType)}`);
    }
    const numCompressionBlocks = this.smartBuffer.readUInt8();

    const numSparseRanges = this.smartBuffer.readUInt8();
    const reservedBitFlags = this.smartBuffer.readUInt8();

    if (reservedBitFlags !== 0) {
      throw new Error(`unrecognized reserved bit flags: ${reservedBitFlags}`);
    }
    const uniqueId = this.smartBuffer.readUInt32LE() + 2 ** 32 * this.smartBuffer.readUInt32LE();

    // compression ranges
    let offset = channelDataStart;

    // frame
    const frameOffsets: Array<[number, number]> = [];

    for (let i = 0; i < numCompressionBlocks; i++) {
      const frameNumber = this.smartBuffer.readUInt32LE();
      const lengthOfBlock = this.smartBuffer.readUInt32LE();

      if (lengthOfBlock > 0) {
        frameOffsets.push([frameNumber, offset]);
        offset += lengthOfBlock;
      }
    }

    // sparse ranges
    const sparseRanges: Array<[number, number]> = [];
    for (let i = 0; i < numSparseRanges; i++) {
      // Uint24
      const startChannelNumber =
        this.smartBuffer.readUInt8() + 2 ** 8 * this.smartBuffer.readUInt8() + 2 ** 16 * this.smartBuffer.readUInt8();
      // Uint24
      const numberOfChannels =
        this.smartBuffer.readUInt8() + 2 ** 8 * this.smartBuffer.readUInt8() + 2 ** 16 * this.smartBuffer.readUInt8();

      sparseRanges.push([startChannelNumber, numberOfChannels]);
    }

    // variable headers
    const variableHeaders: Array<[string, any]> = [];
    let start = this.smartBuffer.readOffset;

    while (start < channelDataStart - 4) {
      const length = this.smartBuffer.readInt16LE();

      if (length === 0) {
        break;
      }

      const vheaderCode = this.smartBuffer.readString(2);
      const vheaderData = this.smartBuffer.readString(length - 4);

      variableHeaders.push([vheaderCode, vheaderData]);
      start += length;
    }

    this.fseq = new Fseq(
      this.smartBuffer,
      minorVersion,
      majorVersion,
      channelDataStart,
      channelCountPerFrame,
      numberOfFrames,
      stepTimeInMs,
      uniqueId,
      compressionType,
      frameOffsets,
      sparseRanges,
      variableHeaders,
    );
  }

  toString(): string {
    return this.fseq?.toString() || 'N/A';
  }
}
