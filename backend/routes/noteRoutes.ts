import express, { Response } from 'express';
import Note from '../models/Note';
import { protect, RequestWithUser } from '../middlewares/authMiddleware';


// interface AuthRequest extends Request {
//     user?: {
//         _id: string | object;
//         [key: string]: any;
//     };
// }
const router = express.Router();
// router.use(protect);

// Get notes for a customer or lead
router.get('/', protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { customerId, leadId } = req.query;
        const filter: any = {};
        if (customerId) filter.customerId = customerId;
        if (leadId) filter.leadId = leadId;

        const notes = await Note.find(filter)
            .populate('createdById', 'name email')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new note
router.post('/', protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { content, customerId, leadId } = req.body;
        const newNote = new Note({
            content,
            customerId,
            leadId,
            createdById: req.user?.id
        });
        const savedNote = await newNote.save();
        await savedNote.populate('createdById', 'name email');
        res.status(201).json(savedNote);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a note
router.delete('/:id', protect as express.RequestHandler, async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        // check if the user is the owner of the note
        if (note.createdById.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Unauthorized to delete this note' });
            return;
        }

        await note.deleteOne();
        res.json({ message: 'Note deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
