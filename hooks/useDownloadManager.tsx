import { useRef } from 'react';
import { Directory, File, Paths,  } from 'expo-file-system';
import {
  startDownload,
  updateProgress,
  pauseDownload,
  completeDownload,
  failDownload,
} from '@/features/downloadSlice';
import { ImageInterface, VideoInterface } from '@/types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// const requestPermissions = async () => {
//   const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
//   if (status !== 'granted') {
//     alert('Permission to access media library is required!');
//   }
// };

const useDownload = (baseURL: string, entry: (VideoInterface | ImageInterface)) => {
  const dispatch = useDispatch()
  const { id, name, type, url, modifiedAt } = entry
  const src = baseURL + (url.replace('', ''))
  const targetLocation = new Directory(Paths.document)
  const { downloadFileAsync } = File

  

}

export default useDownload