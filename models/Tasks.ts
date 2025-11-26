import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

class Task extends Model {
  static table = 'tasks';

  @field('name') name!: string;
  @field('done') done!: boolean;
  @date('created_at') createdAt!: Date;
  @relation('tags', 'tag_id') tag!: any;
}

export default Task;
