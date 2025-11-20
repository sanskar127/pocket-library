import {DownloadManagerInterface} from "@/types/types"

export default class DownloadManager {
    // file!: File
    chunksize?: number
    bytesDownloaded: number
    
    constructor(entry: DownloadManagerInterface) {
        Object.assign(this, entry);
        this.bytesDownloaded = 0
    }
}