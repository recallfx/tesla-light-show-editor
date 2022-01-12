import React, { ChangeEventHandler, ChangeEvent, useRef, useState } from 'react';
import { unzipSync } from 'fflate';

import Footer from '../foundation/Footer';

export interface ArrayBufferFile {
  name: string;
  arrayBuffer: ArrayBuffer | null;
}

export interface ILightshow {
  fseq?: ArrayBufferFile;
  audio?: ArrayBufferFile;
}

export interface UploadProps {
  // eslint-disable-next-line no-unused-vars
  received(lightshow: ILightshow): void;
}

export const SUPPORTED_FILE_FORMATS = ['fseq', 'wav', 'mp3'];

export function getFileExtension(name: string): string {
  return name.slice((Math.max(0, name.lastIndexOf('.')) || Infinity) + 1);
}

export async function getLightshowFromZipFile(arrayBuffer: ArrayBuffer): Promise<ILightshow> {
  const uint8Array = new Uint8Array(arrayBuffer);

  const decompressed = unzipSync(uint8Array, {
    filter(zippedFile) {
      const extension = getFileExtension(zippedFile.name);

      return (
        !zippedFile.name.startsWith('__MACOSX') &&
        SUPPORTED_FILE_FORMATS.includes(extension) &&
        // Don't decompress files larger than 10 MiB
        zippedFile.originalSize <= 10_000_000
      );
    },
  });

  return Object.entries(decompressed).reduce(
    (acc: ILightshow, [fileName, data]: [string, Uint8Array]) => {
      const extension = getFileExtension(fileName);

      const arrayBufferFile = {
        name: fileName,
        arrayBuffer: data.buffer,
      };

      if (extension === 'fseq') {
        acc.fseq = arrayBufferFile;
      } else if (extension === 'wav' || extension === 'mp3') {
        acc.audio = arrayBufferFile;
      }

      return acc;
    },
    {
      fseq: undefined,
      audio: undefined,
    },
  );
}

export async function getLightshow(files: FileList): Promise<ILightshow> {
  let lightshow: ILightshow | undefined;

  // eslint-disable-next-line no-restricted-syntax
  for await (const file of files) {
    const { name, type } = file;
    const extension = getFileExtension(name);

    if (type === 'application/zip' || extension === 'zip') {
      // extract zip
      lightshow = await getLightshowFromZipFile(await file.arrayBuffer());
    } else if (extension === 'fseq') {
      // set fseq
      lightshow = {
        fseq: {
          name,
          arrayBuffer: await file.arrayBuffer(),
        },
      };
    } else if (extension === 'wav' || extension === 'mp3') {
      // set audio
      lightshow = {
        audio: {
          name,
          arrayBuffer: await file.arrayBuffer(),
        },
      };
    }
  }

  if (!lightshow?.fseq) {
    throw new Error('Upload must have fseq file.');
  }

  return lightshow;
}

export default function Upload({ received }: UploadProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef(null);

  const handleFileList = async (files: FileList) => {
    if (files.length > 0) {
      try {
        setLoading(true);

        const lightshow = await getLightshow(files);

        setLoading(false);

        received(lightshow);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }
  };

  const onLoadDemoFile = async () => {
    const response = await fetch('/lightshows/lightshow.zip');
    const content = await response.blob();
    const zipFileArrayBuffer = await content.arrayBuffer();

    received(await getLightshowFromZipFile(zipFileArrayBuffer));
  };

  // eslint-disable-next-line no-unused-vars
  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files) {
      handleFileList(event.dataTransfer.files);
    }
  };

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dragEnterHandler = () => {
    setIsDragging(true);
  };

  const dragLeaveHandler = () => {
    setIsDragging(false);
  };

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileList(event.target.files);
    }
  };

  const onFileDropClick = () => {
    // @ts-ignore
    fileInputRef?.current?.click();
  };

  const dropZoneClasses = isDragging ? 'border-solid' : 'border-dashed';
  const dropZoneText = isDragging ? 'Drop!' : 'Drop .fseq file here!';

  return (
    <section className='flex flex-col justify-between min-h-screen'>
      <main className='hero flex-grow container mx-auto'>
        <div className='text-center hero-content w-full'>
          <div className='min-w-fit w-1/2'>
            {!loading && (
              <div>
                <div
                  tabIndex={0}
                  role='button'
                  className={`flex flex-col gap-4 border-2 rounded-lg cursor-pointer h-32 justify-center ${dropZoneClasses}`}
                  onClick={onFileDropClick}
                  onKeyUp={onFileDropClick}
                  onDrop={onDropHandler}
                  onDragLeave={dragLeaveHandler}
                  onDragEnter={dragEnterHandler}
                  onDragOver={dragOverHandler}
                >
                  {dropZoneText}
                </div>

                <input
                  className='hidden'
                  onChange={onFileInputChange}
                  ref={fileInputRef}
                  type='file'
                  accept='.fseq,.wav,.mp3,.zip'
                  multiple
                />
                {errorMessage.length > 0 && <span className='mt-3 text-warning'>{errorMessage}</span>}

                <div className='justify-center flex flex-row items-center mt-3'>
                  <span className='mr-3'>Or you can </span>
                  <button type='button' className='btn btn-primary' onClick={onLoadDemoFile}>
                    Load demo
                  </button>
                </div>
              </div>
            )}
            {loading && <span className='font-extrabold text-3xl'>Loading...</span>}
          </div>
        </div>
      </main>

      <Footer />
    </section>
  );
}
