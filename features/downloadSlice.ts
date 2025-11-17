// store/slices/downloadSlice.ts
import { DownloadState, downloadType } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DownloadsState {
  [id: string]: DownloadState;
}

const initialState: DownloadsState = {};

const downloadSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    initDownload(state, action: PayloadAction<{ id: string; fileName: string, type:  downloadType }>) {
      state[action.payload.id] = {
        status: 'ongoing',
        type: action.payload.type,
        progress: 0,
        fileName: action.payload.fileName,
        error: null,
      };
    },
    updateProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
      if (state[action.payload.id]) {
        state[action.payload.id].progress = action.payload.progress;
      }
    },
    toggleDownload(state, action: PayloadAction<{ id: string }>) {
      if (state[action.payload.id]) {
        state[action.payload.id].status = state[action.payload.id].status === 'paused' ? 'ongoing' : 'paused';
      }
    },
    finishDownload(state, action: PayloadAction<{ id: string; uri: string }>) {
      if (state[action.payload.id]) {
        state[action.payload.id].status = 'finished';
        // Optionally store the download URI if needed
      }
    },
    failDownload(state, action: PayloadAction<{ id: string; error: string }>) {
      if (state[action.payload.id]) {
        state[action.payload.id].status = 'failed';
        state[action.payload.id].error = action.payload.error;
      }
    },
    cancelDownload(state, action: PayloadAction<{ id: string }>) {
      delete state[action.payload.id];
    },
  },
});

export const {
  initDownload,
  updateProgress,
  toggleDownload,
  finishDownload,
  failDownload,
  cancelDownload,
} = downloadSlice.actions;

export default downloadSlice.reducer;
