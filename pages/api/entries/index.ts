import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Entry, IEntry } from '../../../models'

type Data = 
| { message: string }
| IEntry[]
| IEntry

const getEntries = async (res: NextApiResponse<Data>) => {
    await db.connect()
    
    const entries = await Entry.find({}).sort({ createdAt: 'ascending' })
    await db.disconnect()


    res.status(200).json(entries )
}

const postEntry = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
   const { description = "" } = req.body


   const NewEntry = new Entry({ 
        description,
        createdAt: new Date(),
    });

    try {

        await db.connect()
        await NewEntry.save()
        await db.disconnect()

        return res.status(201).json(NewEntry)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Error al crear la entrada' })
    }
}


export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getEntries(res)
        case 'POST':
            return postEntry(req, res)
        
        default:
            return res.status(400).json({ message: 'Endpoint no existe' })
    }

}