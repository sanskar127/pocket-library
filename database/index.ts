import { appSchema, Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { downloadsSchema } from './schema/downloadsSchema'
import Downloads from '@/models/Downloads'

const adapter = new SQLiteAdapter({
    schema: appSchema({
        version: 1,
        tables: [downloadsSchema]
    })
})

export const database = new Database({
    adapter,
    modelClasses: [Downloads],
})
