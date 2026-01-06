import Table from '../models/Table.js'

export const listTables = async (req, res) => {
  const tables = await Table.find().lean()
  res.json(tables)
}
