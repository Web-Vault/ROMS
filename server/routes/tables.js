import { Router } from 'express'
import { listTables } from '../controllers/tablesController.js'

const router = Router()
router.get('/', listTables)

export default router
