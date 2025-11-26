// models/File.ts
import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class File extends Model {
    static table = 'downloads';

    @field('_id') _id!: string;
    @field('name') name!: string;
    @field('size') size!: number;
    @field('uri') uri!: string;
    @field('destination') destination!: string;
    @field('downloadtype') downloadType!: string;
    @field('bytesDownloaded') bytesDownloaded!: number;
    @field('status') status!: string;
    @field('filetype') fileType!: string;
    @field('created_at') createdAt!: number;
    @field('updated_at') updatedAt!: number;
}
