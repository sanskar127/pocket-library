import { tableSchema } from "@nozbe/watermelondb";

export const downloadsSchema = tableSchema({
    name: 'downloads',
    columns: [
        { name: '_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'size', type: 'number' },
        { name: 'uri', type: 'string' },
        { name: 'destination', type: 'string' },
        { name: 'downloadtype', type: 'string' },
        { name: 'bytesDownloaded', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'filetype', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
    ]
})